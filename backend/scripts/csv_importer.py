"""
CSV Importer for GEO Search Platform
Bulk import brands, queries, and competitor data from CSV files.
"""

import csv
import asyncio
import os
import sys
from datetime import datetime
from typing import List, Dict, Any
import logging

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import init_firestore, get_db, FirestoreHelper
from core.models import BrandCreate, QueryCreate, QueryCategory, EngineType
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class CSVImporter:
    """CSV importer for bulk data operations."""
    
    def __init__(self):
        self.db = None
        self.db_helper = None
    
    async def initialize(self):
        """Initialize database connection."""
        await init_firestore()
        self.db = get_db()
        self.db_helper = FirestoreHelper(self.db)
        print("✅ Database connection initialized")
    
    async def import_brands_from_csv(self, csv_file_path: str) -> Dict[str, Any]:
        """
        Import brands from CSV file.
        
        CSV Format:
        name,domains,canonical_pages,canonical_facts
        Zudio,"zudio.com,www.zudio.com","https://www.zudio.com/,https://www.zudio.com/products","{""category"":""fashion"",""target_audience"":""young_adults""}"
        """
        results = {
            "total_rows": 0,
            "successful": 0,
            "failed": 0,
            "errors": [],
            "brand_ids": []
        }
        
        try:
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                results["total_rows"] = sum(1 for row in reader)
                
                # Reset file pointer
                file.seek(0)
                reader = csv.DictReader(file)
                
                for row_num, row in enumerate(reader, 1):
                    try:
                        # Parse domains (comma-separated)
                        domains = [d.strip() for d in row['domains'].split(',')]
                        
                        # Parse canonical pages (comma-separated)
                        canonical_pages = [p.strip() for p in row['canonical_pages'].split(',')]
                        
                        # Parse canonical facts (JSON string)
                        canonical_facts = {}
                        if row.get('canonical_facts'):
                            try:
                                import json
                                canonical_facts = json.loads(row['canonical_facts'])
                            except json.JSONDecodeError:
                                canonical_facts = {"raw": row['canonical_facts']}
                        
                        # Create brand data
                        brand_data = BrandCreate(
                            name=row['name'],
                            domains=domains,
                            canonical_pages=canonical_pages,
                            canonical_facts=canonical_facts
                        )
                        
                        # Create brand in Firestore
                        brand_id = await self.db_helper.create_brand(brand_data.dict_for_firestore())
                        results["successful"] += 1
                        results["brand_ids"].append(brand_id)
                        
                        print(f"✅ Created brand: {row['name']} (ID: {brand_id})")
                        
                    except Exception as e:
                        results["failed"] += 1
                        error_msg = f"Row {row_num}: {str(e)}"
                        results["errors"].append(error_msg)
                        print(f"❌ Failed to create brand at row {row_num}: {e}")
        
        except Exception as e:
            print(f"❌ Error reading CSV file: {e}")
            results["errors"].append(f"File error: {str(e)}")
        
        return results
    
    async def import_queries_from_csv(self, csv_file_path: str) -> Dict[str, Any]:
        """
        Import queries from CSV file.
        
        CSV Format:
        brand_name,text,category,engine_targets,active
        Zudio,"affordable fashion for young adults",product-help,"perplexity,chatgpt",true
        Zudio,"trendy clothing brands in India",brand-info,perplexity,true
        """
        results = {
            "total_rows": 0,
            "successful": 0,
            "failed": 0,
            "errors": [],
            "query_ids": []
        }
        
        try:
            # First, get all brands to map names to IDs
            brands_map = await self._get_brands_map()
            
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                results["total_rows"] = sum(1 for row in reader)
                
                # Reset file pointer
                file.seek(0)
                reader = csv.DictReader(file)
                
                for row_num, row in enumerate(reader, 1):
                    try:
                        # Get brand ID from name
                        brand_name = row['brand_name']
                        if brand_name not in brands_map:
                            raise ValueError(f"Brand '{brand_name}' not found")
                        
                        brand_id = brands_map[brand_name]
                        
                        # Parse engine targets (comma-separated)
                        engine_targets = [e.strip() for e in row['engine_targets'].split(',')]
                        
                        # Validate category
                        category = row['category']
                        if category not in [c.value for c in QueryCategory]:
                            raise ValueError(f"Invalid category: {category}")
                        
                        # Parse active status
                        active = row.get('active', 'true').lower() == 'true'
                        
                        # Create query data
                        query_data = QueryCreate(
                            brand_id=brand_id,
                            text=row['text'],
                            category=QueryCategory(category),
                            engine_targets=[EngineType(e) for e in engine_targets],
                            active=active
                        )
                        
                        # Create query in Firestore
                        query_id = await self.db_helper.create_query(query_data.dict())
                        results["successful"] += 1
                        results["query_ids"].append(query_id)
                        
                        print(f"✅ Created query: {row['text'][:50]}... (ID: {query_id})")
                        
                    except Exception as e:
                        results["failed"] += 1
                        error_msg = f"Row {row_num}: {str(e)}"
                        results["errors"].append(error_msg)
                        print(f"❌ Failed to create query at row {row_num}: {e}")
        
        except Exception as e:
            print(f"❌ Error reading CSV file: {e}")
            results["errors"].append(f"File error: {str(e)}")
        
        return results
    
    async def import_competitors_from_csv(self, csv_file_path: str) -> Dict[str, Any]:
        """
        Import competitor data from CSV file.
        
        CSV Format:
        brand_name,competitor_name,competitor_domains,competitor_pages,notes
        Zudio,H&M,"hm.com,www2.hm.com","https://www2.hm.com/en_in/index.html",Fashion retailer
        Zudio,Zara,"zara.com,www.zara.com","https://www.zara.com/in/",Spanish fashion brand
        """
        results = {
            "total_rows": 0,
            "successful": 0,
            "failed": 0,
            "errors": [],
            "competitor_ids": []
        }
        
        try:
            # First, get all brands to map names to IDs
            brands_map = await self._get_brands_map()
            
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                results["total_rows"] = sum(1 for row in reader)
                
                # Reset file pointer
                file.seek(0)
                reader = csv.DictReader(file)
                
                for row_num, row in enumerate(reader, 1):
                    try:
                        # Get brand ID from name
                        brand_name = row['brand_name']
                        if brand_name not in brands_map:
                            raise ValueError(f"Brand '{brand_name}' not found")
                        
                        brand_id = brands_map[brand_name]
                        
                        # Parse competitor domains (comma-separated)
                        competitor_domains = [d.strip() for d in row['competitor_domains'].split(',')]
                        
                        # Parse competitor pages (comma-separated)
                        competitor_pages = [p.strip() for p in row['competitor_pages'].split(',')]
                        
                        # Create competitor data
                        competitor_data = {
                            "brand_id": brand_id,
                            "competitor_name": row['competitor_name'],
                            "competitor_domains": competitor_domains,
                            "competitor_pages": competitor_pages,
                            "notes": row.get('notes', ''),
                            "created_at": datetime.now()
                        }
                        
                        # Create competitor in Firestore
                        competitor_id = await self.db_helper.create_competitor(competitor_data)
                        results["successful"] += 1
                        results["competitor_ids"].append(competitor_id)
                        
                        print(f"✅ Created competitor: {row['competitor_name']} for {brand_name} (ID: {competitor_id})")
                        
                    except Exception as e:
                        results["failed"] += 1
                        error_msg = f"Row {row_num}: {str(e)}"
                        results["errors"].append(error_msg)
                        print(f"❌ Failed to create competitor at row {row_num}: {e}")
        
        except Exception as e:
            print(f"❌ Error reading CSV file: {e}")
            results["errors"].append(f"File error: {str(e)}")
        
        return results
    
    async def _get_brands_map(self) -> Dict[str, str]:
        """Get a mapping of brand names to brand IDs."""
        brands_map = {}
        try:
            # Query all brands from Firestore
            brands = self.db.collection("brands").stream()
            
            for brand_doc in brands:
                brand_data = brand_doc.to_dict()
                brand_name = brand_data.get("name")
                if brand_name:
                    brands_map[brand_name] = brand_doc.id
            
            print(f"✅ Found {len(brands_map)} brands in database")
            return brands_map
        except Exception as e:
            print(f"❌ Error getting brands map: {e}")
            return brands_map
    
    def create_sample_csv_files(self):
        """Create sample CSV files with proper format."""
        
        # Create sample brands CSV
        brands_csv = """name,domains,canonical_pages,canonical_facts
Zudio,"zudio.com,www.zudio.com","https://www.zudio.com/,https://www.zudio.com/products","{""category"":""fashion"",""target_audience"":""young_adults""}"
H&M,"hm.com,www2.hm.com","https://www2.hm.com/en_in/index.html","{""category"":""fashion"",""target_audience"":""all_ages""}"
Zara,"zara.com,www.zara.com","https://www.zara.com/in/","{""category"":""fashion"",""target_audience"":""adults""}"
"""
        
        # Create sample queries CSV
        queries_csv = """brand_name,text,category,engine_targets,active
Zudio,"affordable fashion for young adults",product-help,"perplexity,chatgpt",true
Zudio,"trendy clothing brands in India",brand-info,perplexity,true
Zudio,"best budget fashion stores online",competitor,"perplexity,chatgpt",true
H&M,"sustainable fashion brands",product-help,perplexity,true
H&M,"fast fashion alternatives",competitor,perplexity,true
Zara,"premium fashion brands",brand-info,perplexity,true
"""
        
        # Create sample competitors CSV
        competitors_csv = """brand_name,competitor_name,competitor_domains,competitor_pages,notes
Zudio,H&M,"hm.com,www2.hm.com","https://www2.hm.com/en_in/index.html",Swedish fashion retailer
Zudio,Zara,"zara.com,www.zara.com","https://www.zara.com/in/",Spanish fashion brand
Zudio,Uniqlo,"uniqlo.com,www.uniqlo.com","https://www.uniqlo.com/in/",Japanese casual wear
H&M,Zara,"zara.com,www.zara.com","https://www.zara.com/in/",Spanish fashion brand
H&M,Uniqlo,"uniqlo.com,www.uniqlo.com","https://www.uniqlo.com/in/",Japanese casual wear
"""
        
        # Write sample files
        with open('sample_brands.csv', 'w', encoding='utf-8') as f:
            f.write(brands_csv)
        
        with open('sample_queries.csv', 'w', encoding='utf-8') as f:
            f.write(queries_csv)
        
        with open('sample_competitors.csv', 'w', encoding='utf-8') as f:
            f.write(competitors_csv)
        
        print("✅ Created sample CSV files:")
        print("  - sample_brands.csv")
        print("  - sample_queries.csv")
        print("  - sample_competitors.csv")

async def main():
    """Main function for CSV import operations."""
    importer = CSVImporter()
    await importer.initialize()
    
    print("🚀 CSV Importer for GEO Search Platform")
    print("=" * 50)
    
    # Create sample files
    importer.create_sample_csv_files()
    
    # Example usage (uncomment to run):
    # 
    # # Import brands
    # print("\n📊 Importing brands...")
    # brands_result = await importer.import_brands_from_csv('sample_brands.csv')
    # print(f"Brands imported: {brands_result['successful']}/{brands_result['total_rows']}")
    # 
    # # Import queries
    # print("\n📊 Importing queries...")
    # queries_result = await importer.import_queries_from_csv('sample_queries.csv')
    # print(f"Queries imported: {queries_result['successful']}/{queries_result['total_rows']}")
    # 
    # # Import competitors
    # print("\n📊 Importing competitors...")
    # competitors_result = await importer.import_competitors_from_csv('sample_competitors.csv')
    # print(f"Competitors imported: {competitors_result['successful']}/{competitors_result['total_rows']}")

if __name__ == "__main__":
    asyncio.run(main())
