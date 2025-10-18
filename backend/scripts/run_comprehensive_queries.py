#!/usr/bin/env python3
"""
Run comprehensive queries to generate fresh visibility data.
"""

import asyncio
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from core.database import get_db, FirestoreHelper
from core.query_runner import QueryRunner
from core.aggregator import VisibilityAggregator

async def run_comprehensive_queries():
    """Run all comprehensive queries to generate fresh data."""
    
    print("🚀 Running Comprehensive Queries")
    print("=" * 50)
    
    # Initialize components
    db = get_db()
    db_helper = FirestoreHelper(db)
    query_runner = QueryRunner()
    aggregator = VisibilityAggregator()
    
    # Show current status
    brands = await db_helper.get_brands()
    print(f"📊 Found {len(brands)} brands in database")
    
    total_queries = 0
    for brand in brands:
        queries = await db_helper.get_queries(brand['id'])
        active_queries = [q for q in queries if q.get('active', True)]
        total_queries += len(active_queries)
        print(f"   🏷️  {brand['name']}: {len(active_queries)} active queries")
    
    print(f"\n📝 Total active queries: {total_queries}")
    
    if total_queries == 0:
        print("❌ No active queries found. Please import queries first.")
        return
    
    # Confirm before running
    print(f"\n{'='*50}")
    response = input(f"❓ Run all {total_queries} queries? This will make API calls to Perplexity. (y/N): ")
    
    if response.lower() not in ['y', 'yes']:
        print("❌ Query execution cancelled.")
        return
    
    print(f"\n🔄 Running queries...")
    print("⏳ This may take several minutes due to rate limiting...")
    
    try:
        # Run all queries
        result = await query_runner.run_all_queries()
        
        print(f"\n✅ Query execution completed!")
        print(f"   📊 Total queries: {result['total_queries']}")
        print(f"   ✅ Successful: {result['successful_runs']}")
        print(f"   ❌ Failed: {result['failed_runs']}")
        print(f"   🏷️  Brands processed: {result['brands_processed']}")
        
        # Aggregate the results
        print(f"\n🔄 Aggregating visibility metrics...")
        agg_result = await aggregator.aggregate_all_brands()
        
        print(f"✅ Aggregation completed!")
        print(f"   🏷️  Total brands: {agg_result['total_brands']}")
        print(f"   ✅ Aggregated: {agg_result['aggregated']}")
        print(f"   ❌ Errors: {agg_result['errors']}")
        
        # Show updated metrics
        print(f"\n📊 Updated Visibility Metrics:")
        print("=" * 50)
        
        for brand in brands:
            try:
                # Get current visibility metrics
                today = "2024-01-15"  # Use a fixed date for demo
                metrics = await aggregator.get_visibility_metrics(brand['id'], today)
                
                if metrics:
                    print(f"\n🏷️  {brand['name']}:")
                    print(f"   📈 Citations: {metrics.get('citations_count', 0)}")
                    print(f"   📄 Pages: {metrics.get('unique_pages', 0)}")
                    print(f"   🎯 Visibility Score: {metrics.get('visibility_score', 0):.2%}")
                    
                    engine_breakdown = metrics.get('engine_breakdown', {})
                    if engine_breakdown:
                        print(f"   🔍 Engine Breakdown:")
                        for engine, count in engine_breakdown.items():
                            print(f"      {engine}: {count}")
                else:
                    print(f"\n🏷️  {brand['name']}: No metrics available")
                    
            except Exception as e:
                print(f"\n🏷️  {brand['name']}: Error getting metrics - {e}")
        
        print(f"\n🎉 All done! Your dashboard should now show updated visibility data.")
        
    except Exception as e:
        print(f"❌ Error running queries: {e}")
        raise

async def show_current_metrics():
    """Show current visibility metrics."""
    
    print("📊 Current Visibility Metrics")
    print("=" * 50)
    
    db = get_db()
    db_helper = FirestoreHelper(db)
    aggregator = VisibilityAggregator()
    
    brands = await db_helper.get_brands()
    
    for brand in brands:
        try:
            # Get current visibility metrics
            today = "2024-01-15"  # Use a fixed date for demo
            metrics = await aggregator.get_visibility_metrics(brand['id'], today)
            
            if metrics:
                print(f"\n🏷️  {brand['name']}:")
                print(f"   📈 Citations: {metrics.get('citations_count', 0)}")
                print(f"   📄 Pages: {metrics.get('unique_pages', 0)}")
                print(f"   🎯 Visibility Score: {metrics.get('visibility_score', 0):.2%}")
                
                engine_breakdown = metrics.get('engine_breakdown', {})
                if engine_breakdown:
                    print(f"   🔍 Engine Breakdown:")
                    for engine, count in engine_breakdown.items():
                        print(f"      {engine}: {count}")
            else:
                print(f"\n🏷️  {brand['name']}: No metrics available")
                
        except Exception as e:
            print(f"\n🏷️  {brand['name']}: Error getting metrics - {e}")

async def main():
    """Main function."""
    
    print("🚀 Comprehensive Queries Runner")
    print("=" * 50)
    
    # Show current metrics first
    await show_current_metrics()
    
    print(f"\n{'='*50}")
    print("Options:")
    print("1. Run all queries (generate fresh data)")
    print("2. Show current metrics only")
    print("3. Exit")
    
    choice = input("\n❓ Choose an option (1-3): ")
    
    if choice == "1":
        await run_comprehensive_queries()
    elif choice == "2":
        await show_current_metrics()
    elif choice == "3":
        print("👋 Goodbye!")
    else:
        print("❌ Invalid choice.")

if __name__ == "__main__":
    asyncio.run(main())
