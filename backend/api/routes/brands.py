"""
Brand management API routes.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
import logging

from core.database import get_db, FirestoreHelper
from core.models import BrandCreate, BrandResponse, APIResponse

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=APIResponse)
async def create_brand(brand_data: BrandCreate, db=Depends(get_db)):
    """Create a new brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Convert Pydantic model to dict suitable for Firestore
        brand_dict = brand_data.dict_for_firestore()
        
        # Create brand in Firestore
        brand_id = await db_helper.create_brand(brand_dict)
        
        return APIResponse(
            success=True,
            message="Brand created successfully",
            data={"brand_id": brand_id}
        )
        
    except Exception as e:
        logger.error(f"Error creating brand: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(brand_id: str, db=Depends(get_db)):
    """Get brand by ID."""
    try:
        db_helper = FirestoreHelper(db)
        brand = await db_helper.get_brand(brand_id)
        
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        return BrandResponse(**brand)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting brand: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[BrandResponse])
async def list_brands(db=Depends(get_db)):
    """List all brands."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Get all brands (this would be implemented with actual Firestore query)
        brands = []  # Placeholder - would query brands collection
        
        return [BrandResponse(**brand) for brand in brands]
        
    except Exception as e:
        logger.error(f"Error listing brands: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{brand_id}", response_model=APIResponse)
async def update_brand(brand_id: str, brand_data: BrandCreate, db=Depends(get_db)):
    """Update a brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Check if brand exists
        existing_brand = await db_helper.get_brand(brand_id)
        if not existing_brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Update brand with Firestore-compatible data
        brand_dict = brand_data.dict_for_firestore()
        # Remove created_at for updates
        brand_dict.pop("created_at", None)
        db.collection("brands").document(brand_id).update(brand_dict)
        
        return APIResponse(
            success=True,
            message="Brand updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating brand: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{brand_id}", response_model=APIResponse)
async def delete_brand(brand_id: str, db=Depends(get_db)):
    """Delete a brand."""
    try:
        db_helper = FirestoreHelper(db)
        
        # Check if brand exists
        existing_brand = await db_helper.get_brand(brand_id)
        if not existing_brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        
        # Delete brand
        db.collection("brands").document(brand_id).delete()
        
        return APIResponse(
            success=True,
            message="Brand deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting brand: {e}")
        raise HTTPException(status_code=500, detail=str(e))
