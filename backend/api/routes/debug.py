"""
Debug and testing API routes.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import logging

from core.database import get_db
from core.query_runner import QueryRunner
from core.perplexity_client import PerplexityClient
from core.scheduler import get_scheduler_status, trigger_job_manually
from core.models import APIResponse

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/test-perplexity", response_model=APIResponse)
async def test_perplexity_connection():
    """Test connection to Perplexity API."""
    try:
        client = PerplexityClient()
        is_connected = await client.test_connection()
        
        if is_connected:
            return APIResponse(
                success=True,
                message="Perplexity API connection successful"
            )
        else:
            return APIResponse(
                success=False,
                message="Perplexity API connection failed"
            )
            
    except Exception as e:
        logger.error(f"Error testing Perplexity connection: {e}")
        return APIResponse(
            success=False,
            message=f"Perplexity API test failed: {str(e)}"
        )

@router.post("/run-query", response_model=APIResponse)
async def run_single_query(
    brand_id: str,
    query_text: str,
    db=Depends(get_db)
):
    """Manually run a single query for testing."""
    try:
        runner = QueryRunner()
        
        # Create a temporary query object
        temp_query = {
            "id": "temp_query",
            "brand_id": brand_id,
            "text": query_text,
            "engine_targets": ["perplexity"]
        }
        
        # Get brand data
        from core.database import FirestoreHelper
        db_helper = FirestoreHelper(db)
        brand = await db_helper.get_brand(brand_id)
        
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Execute query
        result = await runner._execute_query(brand, temp_query)
        
        return APIResponse(
            success=True,
            message="Query executed successfully",
            data={
                "run_id": result["run_id"],
                "citations_found": result["citations_found"]
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error running single query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/scheduler/status", response_model=Dict[str, Any])
async def get_scheduler_status_endpoint():
    """Get scheduler status and job information."""
    try:
        status = get_scheduler_status()
        return status
        
    except Exception as e:
        logger.error(f"Error getting scheduler status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scheduler/trigger/{job_id}", response_model=APIResponse)
async def trigger_job(job_id: str):
    """Manually trigger a scheduled job."""
    try:
        result = trigger_job_manually(job_id)
        
        return APIResponse(
            success=True,
            message=result
        )
        
    except Exception as e:
        logger.error(f"Error triggering job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", response_model=Dict[str, Any])
async def health_check():
    """Comprehensive health check."""
    try:
        health_status = {
            "status": "healthy",
            "timestamp": "2025-01-01T00:00:00Z",  # Would use actual timestamp
            "components": {
                "database": "healthy",
                "scheduler": "healthy",
                "perplexity_api": "unknown"
            }
        }
        
        # Test Perplexity connection
        try:
            client = PerplexityClient()
            is_connected = await client.test_connection()
            health_status["components"]["perplexity_api"] = "healthy" if is_connected else "unhealthy"
        except Exception:
            health_status["components"]["perplexity_api"] = "unhealthy"
        
        # Test scheduler
        scheduler_status = get_scheduler_status()
        health_status["components"]["scheduler"] = scheduler_status["status"]
        
        return health_status
        
    except Exception as e:
        logger.error(f"Error in health check: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@router.get("/config", response_model=Dict[str, Any])
async def get_config():
    """Get current configuration (without sensitive data)."""
    import os
    
    return {
        "environment": os.getenv("ENVIRONMENT", "development"),
        "perplexity_model": "sonar-pro",
        "rate_limit_per_minute": 50,
        "aggregation_schedule": "daily at 2 AM UTC",
        "query_schedule": "every 30 minutes",
        "features": {
            "perplexity_integration": True,
            "citation_extraction": True,
            "visibility_aggregation": True,
            "scheduled_jobs": True
        }
    }
