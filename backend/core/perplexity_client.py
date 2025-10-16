"""
Perplexity API client for querying AI engines and extracting citations.
"""

import os
import httpx
import json
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import asyncio

logger = logging.getLogger(__name__)

class PerplexityClient:
    """Client for interacting with Perplexity API."""
    
    def __init__(self):
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        self.base_url = "https://api.perplexity.ai/chat/completions"
        self.model = "sonar-pro"
        self.timeout = 30
        
        if not self.api_key:
            raise ValueError("PERPLEXITY_API_KEY environment variable is required")
    
    async def query(self, query_text: str) -> Dict:
        """
        Query Perplexity API and return structured response.
        
        Args:
            query_text: The query to send to Perplexity
            
        Returns:
            Dict containing answer, sources, and metadata
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": query_text
                }
            ],
            "max_tokens": 1000,
            "temperature": 0.2,
            "top_p": 0.9,
            "return_citations": True,
            "search_domain_filter": [],
            "search_recency_filter": "month"
        }
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.base_url,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                data = response.json()
                return self._parse_response(data)
                
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error querying Perplexity: {e.response.status_code} - {e.response.text}")
            raise Exception(f"Perplexity API error: {e.response.status_code}")
        except httpx.TimeoutException:
            logger.error("Timeout querying Perplexity API")
            raise Exception("Perplexity API timeout")
        except Exception as e:
            logger.error(f"Error querying Perplexity: {e}")
            raise
    
    def _parse_response(self, response_data: Dict) -> Dict:
        """
        Parse Perplexity API response and extract structured data.
        
        Args:
            response_data: Raw response from Perplexity API
            
        Returns:
            Dict with parsed answer, sources, and metadata
        """
        try:
            choice = response_data["choices"][0]
            message = choice["message"]
            
            # Extract answer text
            answer = message["content"]
            
            # Extract citations if available
            citations = []
            if "citations" in message:
                citations = message["citations"]
            
            # Extract source URLs from citations
            source_urls = []
            if citations:
                for citation in citations:
                    if "url" in citation:
                        source_urls.append(citation["url"])
            
            # Parse inline citations from answer text
            inline_citations = self._extract_inline_citations(answer)
            source_urls.extend(inline_citations)
            
            # Remove duplicates
            source_urls = list(set(source_urls))
            
            return {
                "answer": answer,
                "sources": citations,
                "source_urls": source_urls,
                "model": response_data.get("model", self.model),
                "usage": response_data.get("usage", {}),
                "created": response_data.get("created", int(datetime.now().timestamp())),
                "raw_response": response_data
            }
            
        except KeyError as e:
            logger.error(f"Error parsing Perplexity response: missing key {e}")
            raise Exception(f"Invalid Perplexity response format: {e}")
        except Exception as e:
            logger.error(f"Error parsing Perplexity response: {e}")
            raise
    
    def _extract_inline_citations(self, text: str) -> List[str]:
        """
        Extract URLs from answer text using regex patterns.
        
        Args:
            text: Answer text to parse
            
        Returns:
            List of extracted URLs
        """
        import re
        
        # Pattern to match URLs
        url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
        urls = re.findall(url_pattern, text)
        
        # Clean up URLs (remove trailing punctuation)
        cleaned_urls = []
        for url in urls:
            # Remove trailing punctuation
            url = re.sub(r'[.,;:!?]+$', '', url)
            cleaned_urls.append(url)
        
        return cleaned_urls
    
    async def test_connection(self) -> bool:
        """
        Test connection to Perplexity API.
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            result = await self.query("What is the capital of France?")
            return "answer" in result
        except Exception as e:
            logger.error(f"Perplexity connection test failed: {e}")
            return False

# Rate limiting helper
class RateLimiter:
    """Simple rate limiter for API calls."""
    
    def __init__(self, max_calls: int, time_window: int = 60):
        self.max_calls = max_calls
        self.time_window = time_window
        self.calls = []
    
    async def acquire(self):
        """Acquire permission to make an API call."""
        now = datetime.now()
        
        # Remove old calls outside the time window
        self.calls = [call_time for call_time in self.calls 
                     if (now - call_time).total_seconds() < self.time_window]
        
        # Check if we can make a call
        if len(self.calls) >= self.max_calls:
            # Calculate wait time
            oldest_call = min(self.calls)
            wait_time = self.time_window - (now - oldest_call).total_seconds()
            if wait_time > 0:
                logger.info(f"Rate limit reached, waiting {wait_time:.2f} seconds")
                await asyncio.sleep(wait_time)
        
        # Record this call
        self.calls.append(now)

# Global rate limiter instance
perplexity_rate_limiter = RateLimiter(max_calls=50, time_window=60)  # 50 calls per minute
