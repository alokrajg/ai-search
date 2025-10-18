#!/usr/bin/env python3
"""
Simple cleanup - just delete the duplicate brand.
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

async def simple_cleanup():
    """Simple cleanup - delete the duplicate brand."""
    
    print("🧹 Simple cleanup - removing duplicate brand...")
    print("=" * 50)
    
    await init_firestore()
    db = get_db()
    db_helper = FirestoreHelper(db)
    
    # Get all brands
    brands = await db_helper.get_all_brands()
    print(f"📊 Found {len(brands)} brands")
    
    # Find Zudio brands
    zudio_brands = [b for b in brands if b['name'].lower() == 'zudio']
    
    if len(zudio_brands) > 1:
        print(f"\n🔄 Found {len(zudio_brands)} Zudio brands:")
        
        # Sort by creation date (keep the oldest one)
        zudio_brands.sort(key=lambda x: x.get('created_at', ''))
        keep_brand = zudio_brands[0]
        duplicate_brands = zudio_brands[1:]
        
        print(f"   ✅ Keeping: {keep_brand['name']} (ID: {keep_brand['id']})")
        print(f"      Created: {keep_brand.get('created_at', 'Unknown')}")
        
        for duplicate in duplicate_brands:
            print(f"   🗑️  Removing: {duplicate['name']} (ID: {duplicate['id']})")
            print(f"      Created: {duplicate.get('created_at', 'Unknown')}")
            
            # Delete the duplicate brand
            await db_helper.delete_brand(duplicate['id'])
            print(f"      ✅ Deleted duplicate brand")
    else:
        print("✅ No duplicate Zudio brands found")
    
    print(f"\n🎉 Cleanup completed!")
    
    # Show final brands
    final_brands = await db_helper.get_all_brands()
    print(f"\n📊 Final brands ({len(final_brands)}):")
    for brand in final_brands:
        print(f"   🏷️  {brand['name']} (ID: {brand['id']})")

async def main():
    """Main function."""
    
    print("🚀 Simple Brand Cleanup Tool")
    print("=" * 50)
    
    response = input("❓ Do you want to remove duplicate Zudio brand? (y/N): ")
    
    if response.lower() in ['y', 'yes']:
        await simple_cleanup()
    else:
        print("❌ Cleanup cancelled.")

if __name__ == "__main__":
    asyncio.run(main())
