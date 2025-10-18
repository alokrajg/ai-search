"""
Query management API routes.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
import logging

from core.database import get_db, FirestoreHelper
from core.models import QueryCreate, QueryResponse, APIResponse

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[QueryResponse])
async def get_all_queries(db=Depends(get_db)):
    """Get all queries."""
    try:
        db_helper = FirestoreHelper(db)
        queries = await db_helper.get_all_queries()
        return [QueryResponse(**query) for query in queries]
    except Exception as e:
        logger.error(f"Error getting queries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=APIResponse)
async def create_query(query_data: QueryCreate, db=Depends(get_db)):
    """Create a new query."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(query_data.brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Convert Pydantic model to dict
        query_dict = query_data.dict()
        
        # Create query in Firestore
        query_id = await db_helper.create_query(query_dict)
        
        return APIResponse(
            success=True,
            message="Query created successfully",
            data={"query_id": query_id}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brand/{brand_id}", response_model=List[QueryResponse])
async def get_queries_by_brand(brand_id: str, db=Depends(get_db)):
    """Get all queries for a brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Verify brand exists
        brand = await db_helper.get_brand(brand_id)
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Get queries for brand
        queries = await db_helper.get_queries_by_brand(brand_id)
        
        return [QueryResponse(**query) for query in queries]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting queries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{query_id}", response_model=QueryResponse)
async def get_query(query_id: str, db=Depends(get_db)):
    """Get query by ID."""
    try:
        # This would query the queries collection by ID
        # For now, return 404 - would be implemented with actual Firestore query
        raise HTTPException(status_code=404, detail="Query not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{query_id}", response_model=APIResponse)
async def update_query(query_id: str, query_data: QueryCreate, db=Depends(get_db)):
    """Update a query."""
    try:
        # This would update the query in Firestore
        # For now, return not implemented
        raise HTTPException(status_code=501, detail="Not implemented")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{query_id}", response_model=APIResponse)
async def delete_query(query_id: str, db=Depends(get_db)):
    """Delete a query."""
    try:
        # This would delete the query from Firestore
        # For now, return not implemented
        raise HTTPException(status_code=501, detail="Not implemented")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{query_id}/toggle", response_model=APIResponse)
async def toggle_query_status(query_id: str, db=Depends(get_db)):
    """Toggle query active status."""
    try:
        # This would toggle the active status of the query
        # For now, return not implemented
        raise HTTPException(status_code=501, detail="Not implemented")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error toggling query status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
