"""
Citation management API routes.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
import logging

from core.database import get_db, FirestoreHelper
from core.models import CitationResponse, CitationFilter, APIResponse, PaginatedResponse

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/brand/{brand_id}", response_model=List[CitationResponse])
async def get_citations_by_brand(
    brand_id: str,
    query_id: Optional[str] = Query(None),
    page_url: Optional[str] = Query(None),
    engine: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    limit: int = Query(100, le=1000),
    db=Depends(get_db)
):
    """Get citations for a brand with optional filters."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Get citations for brand
        citations = await db_helper.get_citations_by_brand(brand_id, limit)
        
        # Apply filters (this would be implemented with actual Firestore queries)
        filtered_citations = citations
        
        if query_id:
            filtered_citations = [c for c in filtered_citations if c.get("query_id") == query_id]
        
        if page_url:
            filtered_citations = [c for c in filtered_citations if c.get("matched_url") == page_url]
        
        if engine:
            filtered_citations = [c for c in filtered_citations if c.get("engine") == engine]
        
        if start_date:
            filtered_citations = [c for c in filtered_citations 
                                if c.get("timestamp") and c["timestamp"] >= start_date]
        
        if end_date:
            filtered_citations = [c for c in filtered_citations 
                                if c.get("timestamp") and c["timestamp"] <= end_date]
        
        return [CitationResponse(**citation) for citation in filtered_citations]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting citations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{citation_id}", response_model=CitationResponse)
async def get_citation(citation_id: str, db=Depends(get_db)):
    """Get citation by ID."""
    try:
        # This would query the citations collection by ID
        # For now, return 404 - would be implemented with actual Firestore query
        raise HTTPException(status_code=404, detail="Citation not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting citation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brand/{brand_id}/export")
async def export_citations_csv(
    brand_id: str,
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    engine: Optional[str] = Query(None),
    db=Depends(get_db)
):
    """Export citations as CSV."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Get citations
        citations = await db_helper.get_citations_by_brand(brand_id, 10000)  # Large limit for export
        
        # Apply filters
        if start_date:
            citations = [c for c in citations 
                        if c.get("timestamp") and c["timestamp"] >= start_date]
        
        if end_date:
            citations = [c for c in citations 
                        if c.get("timestamp") and c["timestamp"] <= end_date]
        
        if engine:
            citations = [c for c in citations if c.get("engine") == engine]
        
        # Generate CSV content
        csv_content = "timestamp,engine,query_id,matched_url,matched_domain,confidence,snippet\n"
        
        for citation in citations:
            timestamp = citation.get("timestamp", "").strftime("%Y-%m-%d %H:%M:%S") if citation.get("timestamp") else ""
            engine = citation.get("engine", "")
            query_id = citation.get("query_id", "")
            matched_url = citation.get("matched_url", "")
            matched_domain = citation.get("matched_domain", "")
            confidence = citation.get("confidence", 0.0)
            snippet = citation.get("snippet", "").replace('"', '""')  # Escape quotes
            
            csv_content += f'"{timestamp}","{engine}","{query_id}","{matched_url}","{matched_domain}",{confidence},"{snippet}"\n'
        
        return {
            "content": csv_content,
            "filename": f"citations_{brand_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            "content_type": "text/csv"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exporting citations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brand/{brand_id}/stats")
async def get_citation_stats(brand_id: str, db=Depends(get_db)):
    """Get citation statistics for a brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Get citations
        citations = await db_helper.get_citations_by_brand(brand_id, 10000)
        
        # Calculate stats
        total_citations = len(citations)
        
        # Engine breakdown
        engine_stats = {}
        for citation in citations:
            engine = citation.get("engine", "unknown")
            engine_stats[engine] = engine_stats.get(engine, 0) + 1
        
        # Confidence distribution
        confidence_scores = [c.get("confidence", 0.0) for c in citations]
        avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0.0
        
        # Unique pages
        unique_pages = set()
        for citation in citations:
            if citation.get("matched_url"):
                unique_pages.add(citation["matched_url"])
        
        return {
            "total_citations": total_citations,
            "unique_pages": len(unique_pages),
            "average_confidence": round(avg_confidence, 3),
            "engine_breakdown": engine_stats,
            "confidence_distribution": {
                "high": len([c for c in confidence_scores if c >= 0.8]),
                "medium": len([c for c in confidence_scores if 0.5 <= c < 0.8]),
                "low": len([c for c in confidence_scores if c < 0.5])
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting citation stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
