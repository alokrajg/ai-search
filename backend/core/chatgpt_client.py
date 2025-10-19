"""
ChatGPT API client for querying OpenAI's ChatGPT and extracting citations.
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

class ChatGPTClient:
    """Client for interacting with OpenAI ChatGPT API."""
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.base_url = "https://api.openai.com/v1/chat/completions"
        
        # Get configuration from centralized config
        config = api_config.get_model_config("chatgpt")
        self.model = config.get("model", "gpt-3.5-turbo")
        self.max_tokens = config.get("max_tokens", 500)
        self.temperature = config.get("temperature", 0.3)
        self.timeout = config.get("timeout", 30)
        
        # Get rate limiting config
        rate_config = api_config.get_rate_limit_config("chatgpt")
        self.requests_per_minute = rate_config.get("requests_per_minute", 20)
        
        if not self.api_key:
            logger.warning("OPENAI_API_KEY not found. ChatGPT queries will be skipped.")
            self.api_key = None
    
    async def query(self, query_text: str) -> Dict:
        """
        Query ChatGPT API and return structured response.
        
        Args:
            query_text: The query to send to ChatGPT
            
        Returns:
            Dict containing answer, sources, and metadata
        """
        if not self.api_key:
            return {
                "answer": "ChatGPT API key not configured",
                "sources": [],
                "metadata": {
                    "engine": "chatgpt",
                    "model": self.model,
                    "error": "API key not configured"
                }
            }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
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
        
        Question: {query_text}
        """
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant that provides detailed, accurate information with specific references to websites, brands, and sources when relevant."
                },
                {
                    "role": "user",
                    "content": enhanced_prompt
                }
            ],
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "top_p": 0.9
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
                
                # Extract the response content
                answer = data["choices"][0]["message"]["content"]
                
                # Try to extract sources from the response text
                sources = self._extract_sources_from_text(answer)
                
                return {
                    "answer": answer,
                    "sources": sources,
                    "metadata": {
                        "engine": "chatgpt",
                        "model": self.model,
                        "usage": data.get("usage", {}),
                        "timestamp": datetime.now().isoformat()
                    }
                }
                
        except httpx.TimeoutException:
            logger.error(f"ChatGPT API timeout for query: {query_text}")
            return {
                "answer": "Request timed out",
                "sources": [],
                "metadata": {
                    "engine": "chatgpt",
                    "model": self.model,
                    "error": "timeout"
                }
            }
        except httpx.HTTPStatusError as e:
            logger.error(f"ChatGPT API error {e.response.status_code}: {e.response.text}")
            return {
                "answer": f"API error: {e.response.status_code}",
                "sources": [],
                "metadata": {
                    "engine": "chatgpt",
                    "model": self.model,
                    "error": f"http_{e.response.status_code}"
                }
            }
        except Exception as e:
            logger.error(f"ChatGPT API error: {e}")
            return {
                "answer": f"Error: {str(e)}",
                "sources": [],
                "metadata": {
                    "engine": "chatgpt",
                    "model": self.model,
                    "error": str(e)
                }
            }
    
    def _extract_sources_from_text(self, text: str) -> List[Dict]:
        """
        Extract potential sources from ChatGPT response text.
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
                "title": url,  # ChatGPT doesn't provide titles
                "snippet": "",
                "confidence": 0.7  # Medium confidence for URL extraction
            })
        
        # Look for brand/company mentions (simple heuristic)
        brand_indicators = [
            "website", "site", "official", "brand", "company", "store",
            "shop", "online", "platform", "service"
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
