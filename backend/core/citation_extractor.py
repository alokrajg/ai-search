"""
Citation extraction and matching algorithm for AI engine responses.
"""

import re
import hashlib
import logging
from typing import List, Dict, Optional, Tuple
from urllib.parse import urlparse
from datetime import datetime
import asyncio

logger = logging.getLogger(__name__)

class CitationExtractor:
    """Extracts and matches citations from AI engine responses."""
    
    def __init__(self):
        self.confidence_weights = {
            "explicit_url_match": 0.5,
            "domain_mention": 0.2,
            "snippet_similarity": 0.3,
            "engine_confidence": 0.2
        }
    
    async def extract_citations(
        self, 
        response_data: Dict, 
        brand_domains: List[str], 
        canonical_pages: List[str]
    ) -> List[Dict]:
        """
        Extract citations from AI engine response.
        
        Args:
            response_data: Parsed response from AI engine
            brand_domains: List of brand domains to match against
            canonical_pages: List of canonical page URLs
            
        Returns:
            List of extracted citations with confidence scores
        """
        citations = []
        
        answer = response_data.get("answer", "")
        source_urls = response_data.get("source_urls", [])
        
        # Extract citations from explicit source URLs
        for url in source_urls:
            citation = await self._match_url(url, brand_domains, canonical_pages, answer)
            if citation:
                citations.append(citation)
        
        # Extract domain mentions from answer text
        domain_citations = await self._extract_domain_mentions(
            answer, brand_domains, canonical_pages
        )
        citations.extend(domain_citations)
        
        # Extract quoted snippets
        snippet_citations = await self._extract_quoted_snippets(
            answer, brand_domains, canonical_pages
        )
        citations.extend(snippet_citations)
        
        # Deduplicate citations
        citations = self._deduplicate_citations(citations)
        
        return citations
    
    async def _match_url(
        self, 
        url: str, 
        brand_domains: List[str], 
        canonical_pages: List[str], 
        answer: str
    ) -> Optional[Dict]:
        """Match a URL against brand domains and canonical pages."""
        try:
            parsed_url = urlparse(url)
            domain = parsed_url.netloc.lower()
            
            # Check for exact canonical page match
            if url in canonical_pages:
                return {
                    "matched_url": url,
                    "matched_domain": domain,
                    "confidence": 0.95,
                    "match_type": "exact_canonical",
                    "snippet": self._extract_snippet_for_url(answer, url),
                    "source_urls": [url]
                }
            
            # Check for subpath match
            for canonical_page in canonical_pages:
                if url.startswith(canonical_page):
                    return {
                        "matched_url": url,
                        "matched_domain": domain,
                        "confidence": 0.85,
                        "match_type": "subpath",
                        "snippet": self._extract_snippet_for_url(answer, url),
                        "source_urls": [url]
                    }
            
            # Check for domain match
            if domain in [d.lower() for d in brand_domains]:
                return {
                    "matched_url": url,
                    "matched_domain": domain,
                    "confidence": 0.7,
                    "match_type": "domain",
                    "snippet": self._extract_snippet_for_url(answer, url),
                    "source_urls": [url]
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error matching URL {url}: {e}")
            return None
    
    async def _extract_domain_mentions(
        self, 
        answer: str, 
        brand_domains: List[str], 
        canonical_pages: List[str]
    ) -> List[Dict]:
        """Extract domain mentions from answer text."""
        citations = []
        
        for domain in brand_domains:
            # Look for domain mentions in text
            domain_patterns = [
                rf'\b{re.escape(domain)}\b',
                rf'\b{re.escape(domain.replace(".", " "))}\b',
                rf'on {re.escape(domain)}',
                rf'at {re.escape(domain)}'
            ]
            
            for pattern in domain_patterns:
                matches = re.finditer(pattern, answer, re.IGNORECASE)
                for match in matches:
                    snippet = self._extract_context_snippet(answer, match.start(), match.end())
                    
                    citations.append({
                        "matched_domain": domain,
                        "confidence": 0.4,
                        "match_type": "domain_mention",
                        "snippet": snippet,
                        "source_urls": []
                    })
        
        return citations
    
    async def _extract_quoted_snippets(
        self, 
        answer: str, 
        brand_domains: List[str], 
        canonical_pages: List[str]
    ) -> List[Dict]:
        """Extract quoted snippets that might reference brand content."""
        citations = []
        
        # Look for quoted text that might be from brand pages
        quote_patterns = [
            r'"([^"]{20,200})"',  # Double quotes
            r"'([^']{20,200})'",  # Single quotes
            r'—\s*([^—]{20,200})',  # Em dash
            r'•\s*([^•]{20,200})'   # Bullet points
        ]
        
        for pattern in quote_patterns:
            matches = re.finditer(pattern, answer)
            for match in matches:
                snippet = match.group(1)
                
                # Check if snippet might be from brand content
                confidence = await self._calculate_snippet_confidence(
                    snippet, brand_domains, canonical_pages
                )
                
                if confidence > 0.3:
                    citations.append({
                        "confidence": confidence,
                        "match_type": "quoted_snippet",
                        "snippet": snippet,
                        "source_urls": []
                    })
        
        return citations
    
    async def _calculate_snippet_confidence(
        self, 
        snippet: str, 
        brand_domains: List[str], 
        canonical_pages: List[str]
    ) -> float:
        """Calculate confidence score for a snippet."""
        confidence = 0.0
        
        # Check for domain mentions in snippet
        for domain in brand_domains:
            if domain.lower() in snippet.lower():
                confidence += 0.3
        
        # Check for brand-specific keywords (simple heuristic)
        brand_keywords = ["product", "service", "solution", "feature", "pricing"]
        for keyword in brand_keywords:
            if keyword.lower() in snippet.lower():
                confidence += 0.1
        
        # Length-based confidence (longer snippets are more likely to be meaningful)
        if len(snippet) > 50:
            confidence += 0.2
        
        return min(confidence, 1.0)
    
    def _extract_snippet_for_url(self, answer: str, url: str) -> str:
        """Extract relevant snippet from answer for a specific URL."""
        # Look for context around the URL
        url_pattern = re.escape(url)
        match = re.search(url_pattern, answer, re.IGNORECASE)
        
        if match:
            start = max(0, match.start() - 100)
            end = min(len(answer), match.end() + 100)
            return answer[start:end].strip()
        
        # If URL not found in answer, return a generic snippet
        return answer[:200] + "..." if len(answer) > 200 else answer
    
    def _extract_context_snippet(self, text: str, start: int, end: int) -> str:
        """Extract context snippet around a match."""
        context_start = max(0, start - 50)
        context_end = min(len(text), end + 50)
        return text[context_start:context_end].strip()
    
    def _deduplicate_citations(self, citations: List[Dict]) -> List[Dict]:
        """Remove duplicate citations based on content similarity."""
        if not citations:
            return citations
        
        deduplicated = []
        seen_hashes = set()
        
        for citation in citations:
            # Create a hash of the citation content for deduplication
            content = f"{citation.get('snippet', '')}{citation.get('matched_url', '')}{citation.get('matched_domain', '')}"
            content_hash = hashlib.md5(content.encode()).hexdigest()
            
            if content_hash not in seen_hashes:
                seen_hashes.add(content_hash)
                citation["dedup_group_id"] = content_hash
                deduplicated.append(citation)
        
        return deduplicated
    
    def calculate_confidence_score(self, citation: Dict) -> float:
        """Calculate final confidence score for a citation."""
        confidence = 0.0
        
        # Base confidence from match type
        match_type = citation.get("match_type", "")
        if match_type == "exact_canonical":
            confidence += self.confidence_weights["explicit_url_match"]
        elif match_type == "subpath":
            confidence += self.confidence_weights["explicit_url_match"] * 0.9
        elif match_type == "domain":
            confidence += self.confidence_weights["explicit_url_match"] * 0.7
        elif match_type == "domain_mention":
            confidence += self.confidence_weights["domain_mention"]
        elif match_type == "quoted_snippet":
            confidence += citation.get("confidence", 0.0) * self.confidence_weights["snippet_similarity"]
        
        # Additional factors
        if citation.get("source_urls"):
            confidence += 0.1  # Bonus for having source URLs
        
        return min(confidence, 1.0)
