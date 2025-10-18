#!/usr/bin/env python3
"""
Test script to check available Google AI models.
"""

import os
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_google_models():
    """Test what Google AI models are available."""
    api_key = os.getenv("GOOGLE_AI_API_KEY")
    
    if not api_key:
        print("❌ GOOGLE_AI_API_KEY not found")
        return
    
    print(f"🔑 API Key found: {api_key[:10]}...")
    
    # Try to list available models
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            print(f"📊 Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                models = data.get("models", [])
                print(f"✅ Found {len(models)} models:")
                for model in models:
                    name = model.get("name", "Unknown")
                    display_name = model.get("displayName", "No display name")
                    print(f"  - {name} ({display_name})")
            else:
                print(f"❌ Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test a simple generation request
    print("\n🧪 Testing generation request...")
    
    models_to_try = [
        "gemini-pro",
        "gemini-1.5-flash", 
        "gemini-1.5-pro",
        "gemini-1.0-pro"
    ]
    
    for model in models_to_try:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": "Hello, can you respond with just 'Hi'?"
                            }
                        ]
                    }
                ]
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)
                print(f"  {model}: {response.status_code}")
                
                if response.status_code == 200:
                    print(f"    ✅ {model} works!")
                    data = response.json()
                    if "candidates" in data and len(data["candidates"]) > 0:
                        answer = data["candidates"][0]["content"]["parts"][0]["text"]
                        print(f"    Response: {answer}")
                    break
                else:
                    print(f"    ❌ {response.text[:100]}...")
                    
        except Exception as e:
            print(f"    ❌ {model}: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_google_models())
