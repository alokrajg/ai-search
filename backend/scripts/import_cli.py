#!/usr/bin/env python3
"""
Simple CLI tool for CSV import operations.
Usage: python import_cli.py [command] [file]
"""

import asyncio
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.csv_importer import CSVImporter

async def import_brands(csv_file: str):
    """Import brands from CSV file."""
    importer = CSVImporter()
    await importer.initialize()
    
    print(f"📊 Importing brands from {csv_file}...")
    result = await importer.import_brands_from_csv(csv_file)
    
    print(f"\n✅ Import completed:")
    print(f"  Total rows: {result['total_rows']}")
    print(f"  Successful: {result['successful']}")
    print(f"  Failed: {result['failed']}")
    
    if result['errors']:
        print(f"\n❌ Errors:")
        for error in result['errors']:
            print(f"  - {error}")
    
    if result['brand_ids']:
        print(f"\n🎉 Created brand IDs:")
        for brand_id in result['brand_ids']:
            print(f"  - {brand_id}")

async def import_queries(csv_file: str):
    """Import queries from CSV file."""
    importer = CSVImporter()
    await importer.initialize()
    
    print(f"📊 Importing queries from {csv_file}...")
    result = await importer.import_queries_from_csv(csv_file)
    
    print(f"\n✅ Import completed:")
    print(f"  Total rows: {result['total_rows']}")
    print(f"  Successful: {result['successful']}")
    print(f"  Failed: {result['failed']}")
    
    if result['errors']:
        print(f"\n❌ Errors:")
        for error in result['errors']:
            print(f"  - {error}")
    
    if result['query_ids']:
        print(f"\n🎉 Created query IDs:")
        for query_id in result['query_ids']:
            print(f"  - {query_id}")

async def import_competitors(csv_file: str):
    """Import competitors from CSV file."""
    importer = CSVImporter()
    await importer.initialize()
    
    print(f"📊 Importing competitors from {csv_file}...")
    result = await importer.import_competitors_from_csv(csv_file)
    
    print(f"\n✅ Import completed:")
    print(f"  Total rows: {result['total_rows']}")
    print(f"  Successful: {result['successful']}")
    print(f"  Failed: {result['failed']}")
    
    if result['errors']:
        print(f"\n❌ Errors:")
        for error in result['errors']:
            print(f"  - {error}")
    
    if result['competitor_ids']:
        print(f"\n🎉 Created competitor IDs:")
        for competitor_id in result['competitor_ids']:
            print(f"  - {competitor_id}")

async def create_samples():
    """Create sample CSV files."""
    importer = CSVImporter()
    await importer.initialize()
    importer.create_sample_csv_files()

def print_usage():
    """Print usage information."""
    print("🚀 GEO Search CSV Importer")
    print("=" * 40)
    print("Usage:")
    print("  python import_cli.py brands <csv_file>     - Import brands")
    print("  python import_cli.py queries <csv_file>    - Import queries")
    print("  python import_cli.py competitors <csv_file> - Import competitors")
    print("  python import_cli.py samples               - Create sample CSV files")
    print("")
    print("Examples:")
    print("  python import_cli.py samples")
    print("  python import_cli.py brands sample_brands.csv")
    print("  python import_cli.py queries sample_queries.csv")
    print("  python import_cli.py competitors sample_competitors.csv")

async def main():
    """Main CLI function."""
    if len(sys.argv) < 2:
        print_usage()
        return
    
    command = sys.argv[1].lower()
    
    if command == "samples":
        await create_samples()
    elif command == "brands":
        if len(sys.argv) < 3:
            print("❌ Please provide a CSV file path")
            return
        csv_file = sys.argv[2]
        if not Path(csv_file).exists():
            print(f"❌ File not found: {csv_file}")
            return
        await import_brands(csv_file)
    elif command == "queries":
        if len(sys.argv) < 3:
            print("❌ Please provide a CSV file path")
            return
        csv_file = sys.argv[2]
        if not Path(csv_file).exists():
            print(f"❌ File not found: {csv_file}")
            return
        await import_queries(csv_file)
    elif command == "competitors":
        if len(sys.argv) < 3:
            print("❌ Please provide a CSV file path")
            return
        csv_file = sys.argv[2]
        if not Path(csv_file).exists():
            print(f"❌ File not found: {csv_file}")
            return
        await import_competitors(csv_file)
    else:
        print(f"❌ Unknown command: {command}")
        print_usage()

if __name__ == "__main__":
    asyncio.run(main())
