#!/usr/bin/env python3
"""
Test script for the new ChatGPT and Google AI clients.
Run this to verify the API clients are working correctly.
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from core.chatgpt_client import ChatGPTClient
from core.google_ai_client import GoogleAIClient

async def test_chatgpt():
    """Test ChatGPT client."""
    print("🤖 Testing ChatGPT Client...")
    
    client = ChatGPTClient()
    
    if not client.api_key:
        print("❌ ChatGPT API key not configured. Set OPENAI_API_KEY environment variable.")
        return
    
    try:
        response = await client.query("What are the best affordable fashion brands in India?")
        print(f"✅ ChatGPT Response: {response['answer'][:200]}...")
        print(f"📊 Sources found: {len(response['sources'])}")
        print(f"🔧 Metadata: {response['metadata']}")
    except Exception as e:
        print(f"❌ ChatGPT Error: {e}")

async def test_google_ai():
    """Test Google AI client."""
    print("\n🔍 Testing Google AI Client...")
    
    client = GoogleAIClient()
    
    if not client.api_key:
        print("❌ Google AI API key not configured. Set GOOGLE_AI_API_KEY environment variable.")
        return
    
    try:
        response = await client.query("What are the best affordable fashion brands in India?")
        print(f"✅ Google AI Response: {response['answer'][:200]}...")
        print(f"📊 Sources found: {len(response['sources'])}")
        print(f"🔧 Metadata: {response['metadata']}")
    except Exception as e:
        print(f"❌ Google AI Error: {e}")

async def main():
    """Run all tests."""
    print("🚀 Testing New AI Engine Clients\n")
    
    await test_chatgpt()
    await test_google_ai()
    
    print("\n✨ Testing complete!")
    print("\n📝 To use these clients:")
    print("1. Set OPENAI_API_KEY for ChatGPT")
    print("2. Set GOOGLE_AI_API_KEY for Google AI")
    print("3. Update your queries to include 'chatgpt' or 'google_ai' in engine_targets")

if __name__ == "__main__":
    asyncio.run(main())
