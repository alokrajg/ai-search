#!/usr/bin/env python3
"""
Run a few sample queries to generate fresh data.
"""

import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Load environment variables
load_dotenv()

from core.database import init_firestore, get_db, FirestoreHelper
from core.query_runner import QueryRunner
from core.aggregator import VisibilityAggregator

async def run_sample_queries():
    """Run a few sample queries for Zudio."""
    
    print("🚀 Running Sample Queries for Zudio")
    print("=" * 50)
    
    await init_firestore()
    db = get_db()
    db_helper = FirestoreHelper(db)
    query_runner = QueryRunner()
    
    # Get Zudio brand
    brands = await db_helper.get_all_brands()
    zudio_brand = next((b for b in brands if b['name'].lower() == 'zudio'), None)
    
    if not zudio_brand:
        print("❌ Zudio brand not found")
        return
    
    print(f"🏷️  Found Zudio brand: {zudio_brand['id']}")
    
    # Get a few queries for Zudio
    queries = await db_helper.get_queries_by_brand(zudio_brand['id'])
    print(f"📝 Found {len(queries)} queries for Zudio")
    
    # Run first 5 queries
    sample_queries = queries[:5]
    print(f"\n🔄 Running {len(sample_queries)} sample queries...")
    
    for i, query in enumerate(sample_queries, 1):
        print(f"\n{i}. Running query: {query['text']}")
        try:
            # Run the query
            result = await query_runner.run_single_query(
                brand_id=zudio_brand['id'],
                query_id=query['id']
            )
            
            if result:
                print(f"   ✅ Success: {result.get('citations_found', 0)} citations found")
            else:
                print(f"   ❌ Failed to run query")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Aggregate the results
    print(f"\n📊 Aggregating results...")
    aggregator = VisibilityAggregator()
    
    try:
        result = await aggregator.aggregate_brand(zudio_brand['id'])
        print(f"✅ Aggregation completed!")
        print(f"   📈 Citations: {result.get('citations_count', 0)}")
        print(f"   📄 Pages: {result.get('unique_pages', 0)}")
        print(f"   🎯 Visibility Score: {result.get('visibility_score', 0):.2%}")
        
        engine_breakdown = result.get('engine_breakdown', {})
        if engine_breakdown:
            print(f"   🔍 Engine Breakdown:")
            for engine, count in engine_breakdown.items():
                print(f"      {engine}: {count}")
        
    except Exception as e:
        print(f"❌ Error aggregating: {e}")
    
    print(f"\n🎉 Sample queries completed!")

async def main():
    """Main function."""
    
    print("🚀 Sample Query Runner")
    print("=" * 50)
    
    response = input("❓ Run sample queries for Zudio? (y/N): ")
    
    if response.lower() in ['y', 'yes']:
        await run_sample_queries()
    else:
        print("❌ Cancelled.")

if __name__ == "__main__":
    asyncio.run(main())
