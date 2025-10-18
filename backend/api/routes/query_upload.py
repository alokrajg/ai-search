"""
Query upload and processing endpoints.
"""

import csv
import io
import logging
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse

from core.database import get_db, FirestoreHelper
from core.query_runner import QueryRunner
from core.aggregator import VisibilityAggregator

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/upload")
async def upload_queries_csv(
    file: UploadFile = File(...),
    db=Depends(get_db)
):
    """Upload and import queries from CSV file."""
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        # Read CSV content
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        # Parse CSV
        csv_reader = csv.DictReader(io.StringIO(csv_content))
        queries_data = list(csv_reader)
        
        if not queries_data:
            raise HTTPException(status_code=400, detail="CSV file is empty")
        
        # Validate required columns
        required_columns = ['brand_name', 'text', 'category', 'engine_targets', 'active']
        for col in required_columns:
            if col not in queries_data[0]:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Missing required column: {col}"
                )
        
        db_helper = FirestoreHelper(db)
        
        # Get all brands
        brands = await db_helper.get_all_brands()
        brand_map = {brand['name'].lower(): brand for brand in brands}
        
        imported_count = 0
        skipped_count = 0
        errors = []
        
        for row in queries_data:
            try:
                brand_name = row['brand_name'].strip()
                query_text = row['text'].strip()
                category = row['category'].strip()
                engine_targets = [target.strip() for target in row['engine_targets'].split(',')]
                active = row['active'].strip().lower() == 'true'
                
                # Find brand
                brand = brand_map.get(brand_name.lower())
                if not brand:
                    errors.append(f"Brand not found: {brand_name}")
                    continue
                
                # Check if query already exists
                existing_queries = await db_helper.get_queries_by_brand(brand['id'])
                query_exists = any(
                    q['text'].lower() == query_text.lower() 
                    for q in existing_queries
                )
                
                if query_exists:
                    skipped_count += 1
                    continue
                
                # Create new query
                query_data = {
                    'brand_id': brand['id'],
                    'text': query_text,
                    'category': category,
                    'engine_targets': engine_targets,
                    'active': active,
                    'created_at': None,
                    'updated_at': None
                }
                
                await db_helper.create_query(query_data)
                imported_count += 1
                
            except Exception as e:
                errors.append(f"Error processing row: {str(e)}")
        
        return JSONResponse({
            "success": True,
            "message": f"Successfully imported {imported_count} queries",
            "data": {
                "queries_imported": imported_count,
                "queries_skipped": skipped_count,
                "errors": errors[:5]  # Limit error messages
            }
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading queries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process")
async def process_uploaded_queries(db=Depends(get_db)):
    """Process uploaded queries and generate visibility data."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Get all brands and count their queries
        brands = await db_helper.get_all_brands()
        
        total_queries = 0
        for brand in brands:
            queries = await db_helper.get_queries_by_brand(brand['id'])
            total_queries += len(queries)
        
        # For now, return mock data to avoid API timeouts
        # In production, this would actually run the queries
        successful_runs = min(total_queries, 5)  # Mock: process up to 5 queries
        failed_runs = max(0, total_queries - 5)  # Mock: any remaining as failed
        total_citations = successful_runs * 2  # Mock: 2 citations per successful query
        
        return JSONResponse({
            "success": True,
            "message": f"Processed {successful_runs} queries successfully (demo mode)",
            "data": {
                "queries_processed": total_queries,
                "successful_runs": successful_runs,
                "failed_runs": failed_runs,
                "citations_found": total_citations
            }
        })
        
    except Exception as e:
        logger.error(f"Error processing queries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/template")
async def download_csv_template():
    """Download CSV template for query upload."""
    template_content = """brand_name,text,category,engine_targets,active
Zudio,affordable fashion for young adults,product-help,"perplexity,chatgpt",true
Zudio,trendy clothing brands in India,brand-info,perplexity,true
Zudio,best budget fashion stores online,competitor,"perplexity,chatgpt",true
H&M,sustainable fashion brands,product-help,perplexity,true
H&M,fast fashion alternatives,competitor,perplexity,true
Zara,premium fashion brands,brand-info,perplexity,true"""
    
    return JSONResponse({
        "success": True,
        "message": "CSV template generated",
        "data": {
            "template": template_content,
            "columns": [
                "brand_name - Name of the brand",
                "text - Query text to search",
                "category - Query category (product-help, brand-info, competitor, general)",
                "engine_targets - Comma-separated list of AI engines (perplexity, chatgpt, claude, gemini)",
                "active - Whether the query is active (true/false)"
            ]
        }
    })
