"""
Visibility aggregation and metrics calculation.
"""

import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from collections import defaultdict

from .database import get_db, FirestoreHelper

logger = logging.getLogger(__name__)

class VisibilityAggregator:
    """Aggregates citation data and calculates visibility metrics."""
    
    def __init__(self):
        self.db = get_db()
        self.db_helper = FirestoreHelper(self.db)
    
    async def aggregate_all_brands(self) -> Dict:
        """Aggregate visibility metrics for all brands."""
        try:
            # Get all brands
            brands = await self._get_all_brands()
            
            total_aggregated = 0
            errors = 0
            
            for brand in brands:
                try:
                    await self.aggregate_brand(brand["id"])
                    total_aggregated += 1
                except Exception as e:
                    errors += 1
                    logger.error(f"Error aggregating brand {brand['id']}: {e}")
            
            return {
                "total_brands": len(brands),
                "aggregated": total_aggregated,
                "errors": errors
            }
            
        except Exception as e:
            logger.error(f"Error aggregating all brands: {e}")
            raise
    
    async def aggregate_brand(self, brand_id: str, date: Optional[str] = None) -> Dict:
        """Aggregate visibility metrics for a specific brand."""
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        
        try:
            # Get citations for the date
            start_date = f"{date} 00:00:00"
            end_date = f"{date} 23:59:59"
            
            citations = await self._get_citations_for_date_range(
                brand_id, start_date, end_date
            )
            
            # Calculate metrics
            metrics = await self._calculate_metrics(citations, brand_id)
            
            # Store aggregate
            aggregate_data = {
                "date": date,
                "citations_count": metrics["citations_count"],
                "unique_pages": metrics["unique_pages"],
                "visibility_score": metrics["visibility_score"],
                "engine_breakdown": metrics["engine_breakdown"],
                "top_pages": metrics["top_pages"],
                "created_at": datetime.now()
            }
            
            await self.db_helper.create_aggregate(brand_id, date, aggregate_data)
            
            logger.info(f"Aggregated metrics for brand {brand_id} on {date}")
            
            return aggregate_data
            
        except Exception as e:
            logger.error(f"Error aggregating brand {brand_id}: {e}")
            raise
    
    async def _calculate_metrics(self, citations: List[Dict], brand_id: str) -> Dict:
        """Calculate visibility metrics from citations."""
        if not citations:
            return {
                "citations_count": 0,
                "unique_pages": 0,
                "visibility_score": 0.0,
                "engine_breakdown": {},
                "top_pages": []
            }
        
        # Basic counts
        citations_count = len(citations)
        
        # Unique pages
        unique_pages = set()
        for citation in citations:
            if citation.get("matched_url"):
                unique_pages.add(citation["matched_url"])
        
        # Engine breakdown
        engine_breakdown = defaultdict(int)
        for citation in citations:
            engine = citation.get("engine", "unknown")
            engine_breakdown[engine] += 1
        
        # Top pages
        page_citations = defaultdict(int)
        for citation in citations:
            url = citation.get("matched_url")
            if url:
                page_citations[url] += 1
        
        top_pages = [
            {
                "page_url": url,
                "citations_count": count,
                "visibility_share": (count / citations_count) * 100
            }
            for url, count in sorted(page_citations.items(), key=lambda x: x[1], reverse=True)[:10]
        ]
        
        # Visibility score calculation
        visibility_score = await self._calculate_visibility_score(citations)
        
        return {
            "citations_count": citations_count,
            "unique_pages": len(unique_pages),
            "visibility_score": visibility_score,
            "engine_breakdown": dict(engine_breakdown),
            "top_pages": top_pages
        }
    
    async def _calculate_visibility_score(self, citations: List[Dict]) -> float:
        """Calculate visibility score from citations."""
        if not citations:
            return 0.0
        
        # Weighted citations based on confidence
        weighted_citations = sum(
            citation.get("confidence", 0.0) for citation in citations
        )
        
        # Normalize to 0-100 scale
        # This is a simplified calculation - in production, you might want to
        # compare against competitors or use more sophisticated metrics
        max_possible = len(citations) * 1.0  # Assuming max confidence of 1.0
        visibility_score = (weighted_citations / max_possible) * 100 if max_possible > 0 else 0.0
        
        return round(visibility_score, 2)
    
    async def get_visibility_timeseries(
        self, 
        brand_id: str, 
        start_date: str, 
        end_date: str
    ) -> List[Dict]:
        """Get visibility time series data for a brand."""
        try:
            aggregates = await self.db_helper.get_aggregates(brand_id, start_date, end_date)
            
            # Sort by date
            aggregates.sort(key=lambda x: x["date"])
            
            return aggregates
            
        except Exception as e:
            logger.error(f"Error getting visibility timeseries: {e}")
            raise
    
    async def get_top_pages(
        self, 
        brand_id: str, 
        start_date: str, 
        end_date: str, 
        limit: int = 10
    ) -> List[Dict]:
        """Get top performing pages for a brand."""
        try:
            # Get citations for date range
            citations = await self._get_citations_for_date_range(
                brand_id, start_date, end_date
            )
            
            # Count citations per page
            page_citations = defaultdict(int)
            page_last_cited = {}
            
            for citation in citations:
                url = citation.get("matched_url")
                if url:
                    page_citations[url] += 1
                    timestamp = citation.get("timestamp")
                    if timestamp and (url not in page_last_cited or timestamp > page_last_cited[url]):
                        page_last_cited[url] = timestamp
            
            # Calculate total citations for share calculation
            total_citations = sum(page_citations.values())
            
            # Create top pages list
            top_pages = []
            for url, count in sorted(page_citations.items(), key=lambda x: x[1], reverse=True)[:limit]:
                top_pages.append({
                    "page_url": url,
                    "citations_count": count,
                    "visibility_share": (count / total_citations) * 100 if total_citations > 0 else 0,
                    "last_cited": page_last_cited.get(url)
                })
            
            return top_pages
            
        except Exception as e:
            logger.error(f"Error getting top pages: {e}")
            raise
    
    async def _get_citations_for_date_range(
        self, 
        brand_id: str, 
        start_date: str, 
        end_date: str
    ) -> List[Dict]:
        """Get citations for a date range."""
        # This would query the citations collection with date filters
        # For now, return empty list - would be implemented with actual Firestore query
        return []
    
    async def _get_all_brands(self) -> List[Dict]:
        """Get all brands from database."""
        # This would query the brands collection
        # For now, return empty list - would be implemented with actual Firestore query
        return []
