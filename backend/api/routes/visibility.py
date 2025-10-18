"""
Visibility metrics API routes.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from core.database import get_db, FirestoreHelper
from core.aggregator import VisibilityAggregator
from core.models import VisibilityResponse, TopPageResponse, VisibilityFilter, APIResponse

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/brand/{brand_id}/timeseries", response_model=List[VisibilityResponse])
async def get_visibility_timeseries(
    brand_id: str,
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format"),
    engine: Optional[str] = Query(None, description="Filter by engine"),
    db=Depends(get_db)
):
    """Get visibility time series data for a brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Validate dates
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        if start_dt > end_dt:
            raise HTTPException(status_code=400, detail="Start date must be before end date")
        
        # Get aggregates
        aggregator = VisibilityAggregator()
        aggregates = await aggregator.get_visibility_timeseries(brand_id, start_date, end_date)
        
        # Filter by engine if specified
        if engine:
            # This would filter the aggregates by engine
            # For now, return all aggregates
            pass
        
        return [VisibilityResponse(**agg) for agg in aggregates]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting visibility timeseries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brand/{brand_id}/top-pages", response_model=List[TopPageResponse])
async def get_top_pages(
    brand_id: str,
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format"),
    limit: int = Query(10, le=50, description="Number of top pages to return"),
    db=Depends(get_db)
):
    """Get top performing pages for a brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Validate dates
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        if start_dt > end_dt:
            raise HTTPException(status_code=400, detail="Start date must be before end date")
        
        # Get top pages
        aggregator = VisibilityAggregator()
        top_pages = await aggregator.get_top_pages(brand_id, start_date, end_date, limit)
        
        return [TopPageResponse(**page) for page in top_pages]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting top pages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brand/{brand_id}/current", response_model=VisibilityResponse)
async def get_current_visibility(brand_id: str, db=Depends(get_db)):
    """Get current visibility metrics for a brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Get today's date
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Try to get today's visibility metrics
        doc_ref = db.collection("visibility_metrics").document(brand_id).collection("daily").document(today)
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            return VisibilityResponse(**data)
        else:
            # Return empty metrics if no data
            return VisibilityResponse(
                date=today,
                citations_count=0,
                unique_pages=0,
                visibility_score=0.0,
                engine_breakdown={}
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current visibility: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brand/{brand_id}/ranking", response_model=dict)
async def get_ranking_by_engine(brand_id: str, db=Depends(get_db)):
    """Get ranking by AI engine."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Get last 30 days of data
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        
        # Get aggregates
        aggregator = VisibilityAggregator()
        aggregates = await aggregator.get_visibility_timeseries(brand_id, start_date, end_date)
        
        # Calculate engine rankings
        engine_rankings = {}
        for agg in aggregates:
            for engine, count in agg.get("engine_breakdown", {}).items():
                if engine not in engine_rankings:
                    engine_rankings[engine] = 0
                engine_rankings[engine] += count
        
        # Convert to percentage-based rankings (simplified)
        total_citations = sum(engine_rankings.values())
        if total_citations > 0:
            for engine in engine_rankings:
                engine_rankings[engine] = round((engine_rankings[engine] / total_citations) * 100, 1)
        
        return {
            "brand_id": brand_id,
            "period": f"{start_date} to {end_date}",
            "engine_rankings": engine_rankings,
            "total_citations": total_citations
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting ranking by engine: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/brand/{brand_id}/aggregate", response_model=APIResponse)
async def trigger_aggregation(brand_id: str, db=Depends(get_db)):
    """Manually trigger aggregation for a brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Trigger aggregation
        aggregator = VisibilityAggregator()
        result = await aggregator.aggregate_brand(brand_id)
        
        return APIResponse(
            success=True,
            message="Aggregation completed successfully",
            data=result
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error triggering aggregation: {e}")
        raise HTTPException(status_code=500, detail=str(e))
