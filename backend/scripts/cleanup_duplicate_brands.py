#!/usr/bin/env python3
"""
Clean up duplicate brands and consolidate data.
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

async def cleanup_duplicate_brands():
    """Clean up duplicate brands and consolidate data."""
    
    print("🧹 Cleaning up duplicate brands...")
    print("=" * 50)
    
    await init_firestore()
    db = get_db()
    db_helper = FirestoreHelper(db)
    
    # Get all brands
    brands = await db_helper.get_all_brands()
    print(f"📊 Found {len(brands)} brands")
    
    # Find duplicates by name
    brand_groups = {}
    for brand in brands:
        name = brand['name'].lower()
        if name not in brand_groups:
            brand_groups[name] = []
        brand_groups[name].append(brand)
    
    # Process duplicates
    for name, brand_list in brand_groups.items():
        if len(brand_list) > 1:
            print(f"\n🔄 Found {len(brand_list)} duplicates for '{name}':")
            
            # Sort by creation date (keep the oldest one)
            brand_list.sort(key=lambda x: x.get('created_at', ''))
            keep_brand = brand_list[0]
            duplicate_brands = brand_list[1:]
            
            print(f"   ✅ Keeping: {keep_brand['name']} (ID: {keep_brand['id']})")
            
            for duplicate in duplicate_brands:
                print(f"   🗑️  Removing: {duplicate['name']} (ID: {duplicate['id']})")
                
                # Move queries from duplicate to keep brand
                duplicate_queries = await db_helper.get_queries_by_brand(duplicate['id'])
                print(f"      📝 Moving {len(duplicate_queries)} queries...")
                
                for query in duplicate_queries:
                    # Update query to point to keep brand
                    query['brand_id'] = keep_brand['id']
                    await db_helper.update_query(query['id'], query)
                
                # Move citations from duplicate to keep brand
                duplicate_citations = await db_helper.get_citations_by_brand(duplicate['id'])
                print(f"      📄 Moving {len(duplicate_citations)} citations...")
                
                for citation in duplicate_citations:
                    # Update citation to point to keep brand
                    citation['brand_id'] = keep_brand['id']
                    await db_helper.update_citation(citation['id'], citation)
                
                # Move visibility metrics from duplicate to keep brand
                print(f"      📈 Moving visibility metrics...")
                duplicate_metrics_ref = db.collection("visibility_metrics").document(duplicate['id'])
                keep_metrics_ref = db.collection("visibility_metrics").document(keep_brand['id'])
                
                # Get all daily metrics from duplicate
                daily_metrics = duplicate_metrics_ref.collection("daily").stream()
                for daily_doc in daily_metrics:
                    daily_data = daily_doc.to_dict()
                    # Copy to keep brand
                    keep_metrics_ref.collection("daily").document(daily_doc.id).set(daily_data)
                
                # Delete duplicate brand
                await db_helper.delete_brand(duplicate['id'])
                print(f"      ✅ Deleted duplicate brand")
    
    print(f"\n🎉 Cleanup completed!")
    
    # Show final brands
    final_brands = await db_helper.get_all_brands()
    print(f"\n📊 Final brands ({len(final_brands)}):")
    for brand in final_brands:
        queries = await db_helper.get_queries_by_brand(brand['id'])
        citations = await db_helper.get_citations_by_brand(brand['id'])
        print(f"   🏷️  {brand['name']} (ID: {brand['id']})")
        print(f"      📝 Queries: {len(queries)}")
        print(f"      📄 Citations: {len(citations)}")

async def main():
    """Main function."""
    
    print("🚀 Brand Cleanup Tool")
    print("=" * 50)
    
    response = input("❓ Do you want to clean up duplicate brands? (y/N): ")
    
    if response.lower() in ['y', 'yes']:
        await cleanup_duplicate_brands()
    else:
        print("❌ Cleanup cancelled.")

if __name__ == "__main__":
    asyncio.run(main())
