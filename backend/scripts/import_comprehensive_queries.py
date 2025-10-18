#!/usr/bin/env python3
"""
Import comprehensive queries for better visibility data and comparisons.
"""

import asyncio
import csv
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

async def import_comprehensive_queries():
    """Import comprehensive queries from CSV file."""
    
    # Initialize database
    await init_firestore()
    db = get_db()
    db_helper = FirestoreHelper(db)
    
    # Read the comprehensive queries CSV
    csv_file = backend_dir / "comprehensive_queries.csv"
    
    if not csv_file.exists():
        print(f"❌ CSV file not found: {csv_file}")
        return
    
    print(f"📖 Reading queries from: {csv_file}")
    
    imported_count = 0
    skipped_count = 0
    error_count = 0
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            try:
                brand_name = row['brand_name'].strip()
                query_text = row['text'].strip()
                category = row['category'].strip()
                engine_targets = [target.strip() for target in row['engine_targets'].split(',')]
                active = row['active'].strip().lower() == 'true'
                
                # Get brand by name
                brands = await db_helper.get_all_brands()
                brand = None
                for b in brands:
                    if b['name'].lower() == brand_name.lower():
                        brand = b
                        break
                
                if not brand:
                    print(f"⚠️  Brand not found: {brand_name}")
                    skipped_count += 1
                    continue
                
                # Check if query already exists
                existing_queries = await db_helper.get_queries_by_brand(brand['id'])
                query_exists = any(
                    q['text'].lower() == query_text.lower() 
                    for q in existing_queries
                )
                
                if query_exists:
                    print(f"⏭️  Query already exists for {brand_name}: {query_text[:50]}...")
                    skipped_count += 1
                    continue
                
                # Create new query
                query_data = {
                    'brand_id': brand['id'],
                    'text': query_text,
                    'category': category,
                    'engine_targets': engine_targets,
                    'active': active,
                    'created_at': None,  # Will be set by FirestoreHelper
                    'updated_at': None
                }
                
                query_id = await db_helper.create_query(query_data)
                print(f"✅ Added query for {brand_name}: {query_text[:50]}...")
                imported_count += 1
                
            except Exception as e:
                print(f"❌ Error importing query: {e}")
                error_count += 1
    
    print(f"\n📊 Import Summary:")
    print(f"   ✅ Imported: {imported_count}")
    print(f"   ⏭️  Skipped: {skipped_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   📝 Total processed: {imported_count + skipped_count + error_count}")

async def show_current_queries():
    """Show current queries in the database."""
    
    await init_firestore()
    db = get_db()
    db_helper = FirestoreHelper(db)
    
    print("📋 Current Queries in Database:")
    print("=" * 60)
    
    brands = await db_helper.get_all_brands()
    
    for brand in brands:
        queries = await db_helper.get_queries_by_brand(brand['id'])
        print(f"\n🏷️  {brand['name']} ({len(queries)} queries):")
        
        for query in queries:
            status = "🟢" if query.get('active', True) else "🔴"
            engines = ", ".join(query.get('engine_targets', ['perplexity']))
            print(f"   {status} {query['text'][:60]}...")
            print(f"      Category: {query.get('category', 'N/A')} | Engines: {engines}")

async def main():
    """Main function."""
    
    print("🚀 Comprehensive Queries Import Tool")
    print("=" * 50)
    
    # Show current queries first
    await show_current_queries()
    
    print(f"\n{'='*50}")
    response = input("\n❓ Do you want to import the comprehensive queries? (y/N): ")
    
    if response.lower() in ['y', 'yes']:
        await import_comprehensive_queries()
        
        print(f"\n{'='*50}")
        print("📋 Updated Queries in Database:")
        await show_current_queries()
    else:
        print("❌ Import cancelled.")

if __name__ == "__main__":
    asyncio.run(main())
