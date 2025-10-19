"""
Google AI Search client for querying Google's AI-powered search and extracting citations.
"""

import os
import httpx
import json
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import asyncio
from dotenv import load_dotenv
import sys
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

# Add config directory to path
config_dir = Path(__file__).parent.parent / "config"
sys.path.insert(0, str(config_dir))

from api_config import api_config

logger = logging.getLogger(__name__)

class GoogleAIClient:
    """Client for interacting with Google AI Search API."""
    
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_AI_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        
        # Get configuration from centralized config
        config = api_config.get_model_config("google_ai")
        self.model = config.get("model", "gemini-2.0-flash")
        self.max_tokens = config.get("max_tokens", 300)
        self.temperature = config.get("temperature", 0.1)
        self.timeout = config.get("timeout", 30)
        
        # Get rate limiting config
        rate_config = api_config.get_rate_limit_config("google_ai")
        self.requests_per_minute = rate_config.get("requests_per_minute", 15)
        
        if not self.api_key:
            logger.warning("GOOGLE_AI_API_KEY not found. Google AI queries will be skipped.")
            self.api_key = None
    
    async def query(self, query_text: str) -> Dict:
        """
        Query Google AI (Gemini) API and return structured response.
        
        Args:
            query_text: The query to send to Google AI
            
        Returns:
            Dict containing answer, sources, and metadata
        """
        if not self.api_key:
            return {
                "answer": "Google AI API key not configured",
                "sources": [],
                "metadata": {
                    "engine": "google_ai",
                    "model": "gemini-2.0-flash",
                    "error": "API key not configured"
                }
            }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        # Enhanced prompt to encourage citations and source references
        enhanced_prompt = f"""
        Please provide a comprehensive answer to the following question: "{query_text}"
        
        In your response, please:
        1. Provide a detailed and helpful answer
        2. Include specific website URLs, brand names, or sources when relevant
        3. Mention specific companies, products, or services when appropriate
        4. Be specific about locations, prices, or other concrete details when available
        5. If you reference any websites or brands, please mention them explicitly
        
        Question: {query_text}
        """
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": enhanced_prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": self.temperature,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": self.max_tokens,
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }
        
        try:
            url = f"{self.base_url}?key={self.api_key}"
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    url,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                data = response.json()
                
                # Extract the response content
                if "candidates" in data and len(data["candidates"]) > 0:
                    candidate = data["candidates"][0]
                    if "content" in candidate and "parts" in candidate["content"]:
                        answer = candidate["content"]["parts"][0]["text"]
                    else:
                        answer = "No response generated"
                else:
                    answer = "No response generated"
                
                # Try to extract sources from the response text
                sources = self._extract_sources_from_text(answer)
                
                return {
                    "answer": answer,
                    "sources": sources,
                    "metadata": {
                        "engine": "google_ai",
                        "model": "gemini-2.0-flash",
                        "usage": data.get("usageMetadata", {}),
                        "timestamp": datetime.now().isoformat()
                    }
                }
                
        except httpx.TimeoutException:
            logger.error(f"Google AI API timeout for query: {query_text}")
            return {
                "answer": "Request timed out",
                "sources": [],
                "metadata": {
                    "engine": "google_ai",
                    "model": "gemini-2.0-flash",
                    "error": "timeout"
                }
            }
        except httpx.HTTPStatusError as e:
            logger.error(f"Google AI API error {e.response.status_code}: {e.response.text}")
            return {
                "answer": f"API error: {e.response.status_code}",
                "sources": [],
                "metadata": {
                    "engine": "google_ai",
                    "model": "gemini-2.0-flash",
                    "error": f"http_{e.response.status_code}"
                }
            }
        except Exception as e:
            logger.error(f"Google AI API error: {e}")
            return {
                "answer": f"Error: {str(e)}",
                "sources": [],
                "metadata": {
                    "engine": "google_ai",
                    "model": "gemini-2.0-flash",
                    "error": str(e)
                }
            }
    
    def _extract_sources_from_text(self, text: str) -> List[Dict]:
        """
        Extract potential sources from Google AI response text.
        This is a simple heuristic-based approach.
        """
        sources = []
        
        # Look for URLs
        import re
        url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
        urls = re.findall(url_pattern, text)
        
        for url in urls:
            sources.append({
                "url": url,
                "title": url,  # Google AI doesn't provide titles
                "snippet": "",
                "confidence": 0.7  # Medium confidence for URL extraction
            })
        
        # Look for brand/company mentions (simple heuristic)
        brand_indicators = [
            "website", "site", "official", "brand", "company", "store",
            "shop", "online", "platform", "service", "app", "marketplace"
        ]
        
        sentences = text.split('.')
        for sentence in sentences:
            if any(indicator in sentence.lower() for indicator in brand_indicators):
                # Extract potential brand names (capitalized words)
                words = sentence.split()
                potential_brands = [word.strip('.,!?') for word in words 
                                  if word[0].isupper() and len(word) > 2]
                
                for brand in potential_brands:
                    sources.append({
                        "url": f"https://www.{brand.lower()}.com",  # Guess URL
                        "title": brand,
                        "snippet": sentence.strip(),
                        "confidence": 0.5  # Lower confidence for brand extraction
                    })
        
        return sources[:10]  # Limit to 10 sources
