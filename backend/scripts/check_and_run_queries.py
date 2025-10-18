#!/usr/bin/env python3
"""
Check current data and run queries to generate fresh visibility metrics.
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

async def check_current_data():
    """Check what data currently exists in the database."""
    
    print("🔍 Checking Current Data in Database")
    print("=" * 50)
    
    await init_firestore()
    db = get_db()
    db_helper = FirestoreHelper(db)
    
    # Check brands
    brands = await db_helper.get_all_brands()
    print(f"📊 Brands: {len(brands)}")
    for brand in brands:
        print(f"   🏷️  {brand['name']} (ID: {brand['id']})")
    
    # Check queries
    all_queries = await db_helper.get_all_queries()
    print(f"\n📝 Total Queries: {len(all_queries)}")
    
    for brand in brands:
        queries = await db_helper.get_queries_by_brand(brand['id'])
        active_queries = [q for q in queries if q.get('active', True)]
        print(f"   🏷️  {brand['name']}: {len(active_queries)} active queries")
    
    # Check citations
    citations = await db_helper.get_all_citations()
    print(f"\n📄 Total Citations: {len(citations)}")
    
    for brand in brands:
        brand_citations = [c for c in citations if c.get('brand_id') == brand['id']]
        print(f"   🏷️  {brand['name']}: {len(brand_citations)} citations")
    
    # Check visibility metrics
    print(f"\n📈 Visibility Metrics:")
    for brand in brands:
        # Check for any visibility metrics
        metrics_docs = db.collection("visibility_metrics").document(brand['id']).collection("daily").stream()
        metrics_count = len(list(metrics_docs))
        print(f"   🏷️  {brand['name']}: {metrics_count} daily metrics")
    
    return brands, all_queries, citations

async def run_queries_for_brand(brand_id: str, brand_name: str):
    """Run queries for a specific brand."""
    
    print(f"\n🚀 Running queries for {brand_name}...")
    
    await init_firestore()
    db = get_db()
    db_helper = FirestoreHelper(db)
    query_runner = QueryRunner()
    
    try:
        # Run queries for this brand
        result = await query_runner.run_brand_queries(brand_id)
        
        print(f"   ✅ Queries completed for {brand_name}")
        print(f"      📊 Total queries: {result['total_queries']}")
        print(f"      ✅ Successful: {result['successful_runs']}")
        print(f"      ❌ Failed: {result['failed_runs']}")
        
        return result
        
    except Exception as e:
        print(f"   ❌ Error running queries for {brand_name}: {e}")
        return None

async def aggregate_metrics_for_brand(brand_id: str, brand_name: str):
    """Aggregate metrics for a specific brand."""
    
    print(f"\n📊 Aggregating metrics for {brand_name}...")
    
    await init_firestore()
    db = get_db()
    aggregator = VisibilityAggregator()
    
    try:
        # Aggregate metrics for this brand
        result = await aggregator.aggregate_brand(brand_id)
        
        print(f"   ✅ Metrics aggregated for {brand_name}")
        print(f"      📈 Citations: {result.get('citations_count', 0)}")
        print(f"      📄 Pages: {result.get('unique_pages', 0)}")
        print(f"      🎯 Visibility Score: {result.get('visibility_score', 0):.2%}")
        
        return result
        
    except Exception as e:
        print(f"   ❌ Error aggregating metrics for {brand_name}: {e}")
        return None

async def main():
    """Main function."""
    
    print("🚀 Query Runner and Data Checker")
    print("=" * 50)
    
    # Check current data
    brands, queries, citations = await check_current_data()
    
    if len(queries) == 0:
        print("\n❌ No queries found. Please import queries first.")
        return
    
    print(f"\n{'='*50}")
    print("Options:")
    print("1. Run queries for all brands")
    print("2. Run queries for Zudio only")
    print("3. Just aggregate existing data")
    print("4. Show current metrics only")
    print("5. Exit")
    
    choice = input("\n❓ Choose an option (1-5): ")
    
    if choice == "1":
        print(f"\n🔄 Running queries for all brands...")
        for brand in brands:
            await run_queries_for_brand(brand['id'], brand['name'])
            await aggregate_metrics_for_brand(brand['id'], brand['name'])
    
    elif choice == "2":
        zudio_brand = next((b for b in brands if b['name'].lower() == 'zudio'), None)
        if zudio_brand:
            await run_queries_for_brand(zudio_brand['id'], zudio_brand['name'])
            await aggregate_metrics_for_brand(zudio_brand['id'], zudio_brand['name'])
        else:
            print("❌ Zudio brand not found")
    
    elif choice == "3":
        print(f"\n📊 Aggregating existing data...")
        for brand in brands:
            await aggregate_metrics_for_brand(brand['id'], brand['name'])
    
    elif choice == "4":
        print(f"\n📈 Current Metrics:")
        for brand in brands:
            await aggregate_metrics_for_brand(brand['id'], brand['name'])
    
    elif choice == "5":
        print("👋 Goodbye!")
    
    else:
        print("❌ Invalid choice.")
    
    print(f"\n🎉 Done! Check your dashboard for updated data.")

if __name__ == "__main__":
    asyncio.run(main())
