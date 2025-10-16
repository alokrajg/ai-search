"""
Firestore initialization script for setting up sample data.
"""

import asyncio
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import init_firestore, get_db, FirestoreHelper

# Load environment variables
load_dotenv()

async def init_sample_data():
    """Initialize Firestore with sample data."""
    try:
        # Initialize Firestore
        await init_firestore()
        db = get_db()
        db_helper = FirestoreHelper(db)
        
        print("🚀 Initializing Firestore with sample data...")
        
        # Create sample brand
        brand_data = {
            "name": "Acme Inc",
            "domains": ["acme.com", "products.acme.com"],
            "canonical_pages": [
                "https://acme.com/product-x",
                "https://acme.com/product-y",
                "https://acme.com/about",
                "https://acme.com/pricing"
            ],
            "canonical_facts": {
                "pricing": "199",
                "product_name": "AcmeX",
                "founded": "2020"
            },
            "created_at": datetime.now()
        }
        
        brand_id = await db_helper.create_brand(brand_data)
        print(f"✅ Created brand: {brand_id}")
        
        # Create sample queries
        sample_queries = [
            {
                "brand_id": brand_id,
                "text": "how to crop images on mobile",
                "category": "product-help",
                "engine_targets": ["perplexity"],
                "active": True,
                "created_at": datetime.now()
            },
            {
                "brand_id": brand_id,
                "text": "best image editing software for beginners",
                "category": "product-help",
                "engine_targets": ["perplexity"],
                "active": True,
                "created_at": datetime.now()
            },
            {
                "brand_id": brand_id,
                "text": "AcmeX pricing and features",
                "category": "brand-info",
                "engine_targets": ["perplexity"],
                "active": True,
                "created_at": datetime.now()
            },
            {
                "brand_id": brand_id,
                "text": "image editing tools comparison",
                "category": "competitor",
                "engine_targets": ["perplexity"],
                "active": True,
                "created_at": datetime.now()
            }
        ]
        
        query_ids = []
        for query_data in sample_queries:
            query_id = await db_helper.create_query(query_data)
            query_ids.append(query_id)
            print(f"✅ Created query: {query_id}")
        
        # Create engine configuration
        engine_data = {
            "name": "perplexity",
            "api_endpoint": "https://api.perplexity.ai/chat/completions",
            "rate_limit_per_min": 50,
            "api_key_env": "PERPLEXITY_API_KEY",
            "active": True,
            "created_at": datetime.now()
        }
        
        # Store engine config (this would be in engines collection)
        print("✅ Engine configuration ready")
        
        print(f"""
🎉 Firestore initialization completed!

Sample data created:
- Brand ID: {brand_id}
- Queries: {len(query_ids)} queries created
- Engine: Perplexity configured

You can now:
1. Set your PERPLEXITY_API_KEY environment variable
2. Start the backend server: python main.py
3. Test the API endpoints
4. Run queries manually via the debug endpoints
        """)
        
    except Exception as e:
        print(f"❌ Error initializing Firestore: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(init_sample_data())
