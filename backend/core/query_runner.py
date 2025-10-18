"""
Query runner for executing brand queries against AI engines.
"""

import logging
from datetime import datetime
from typing import List, Dict, Optional
import asyncio

from .database import get_db, FirestoreHelper
from .perplexity_client import PerplexityClient, perplexity_rate_limiter
from .chatgpt_client import ChatGPTClient
from .google_ai_client import GoogleAIClient
from .citation_extractor import CitationExtractor
from .models import RunStatus

logger = logging.getLogger(__name__)

class QueryRunner:
    """Runs brand queries against AI engines and stores results."""
    
    def __init__(self):
        self.db = get_db()
        self.db_helper = FirestoreHelper(self.db)
        self.perplexity_client = PerplexityClient()
        self.chatgpt_client = ChatGPTClient()
        self.google_ai_client = GoogleAIClient()
        self.citation_extractor = CitationExtractor()
    
    async def run_all_queries(self) -> Dict:
        """Run all active queries for all brands."""
        try:
            # Get all active brands
            brands = await self._get_active_brands()
            
            total_queries = 0
            successful_runs = 0
            failed_runs = 0
            
            for brand in brands:
                brand_id = brand["id"]
                brand_result = await self._run_brand_queries(brand_id)
                
                total_queries += brand_result["total_queries"]
                successful_runs += brand_result["successful_runs"]
                failed_runs += brand_result["failed_runs"]
            
            return {
                "total_queries": total_queries,
                "successful_runs": successful_runs,
                "failed_runs": failed_runs,
                "brands_processed": len(brands)
            }
            
        except Exception as e:
            logger.error(f"Error running all queries: {e}")
            raise
    
    async def run_brand_queries(self, brand_id: str) -> Dict:
        """Run all queries for a specific brand."""
        return await self._run_brand_queries(brand_id)
    
    async def run_single_query(self, brand_id: str, query_id: str) -> Dict:
        """Run a single query for a brand."""
        try:
            # Get brand and query data
            brand = await self.db_helper.get_brand(brand_id)
            if not brand:
                raise Exception(f"Brand {brand_id} not found")
            
            query = await self._get_query(query_id)
            if not query:
                raise Exception(f"Query {query_id} not found")
            
            if query["brand_id"] != brand_id:
                raise Exception("Query does not belong to brand")
            
            # Run the query
            result = await self._execute_query(brand, query)
            
            return {
                "success": True,
                "run_id": result["run_id"],
                "citations_found": result["citations_found"]
            }
            
        except Exception as e:
            logger.error(f"Error running single query: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _run_brand_queries(self, brand_id: str) -> Dict:
        """Run all queries for a brand."""
        try:
            # Get brand data
            brand = await self.db_helper.get_brand(brand_id)
            if not brand:
                logger.warning(f"Brand {brand_id} not found")
                return {"total_queries": 0, "successful_runs": 0, "failed_runs": 0}
            
            # Get active queries for brand
            queries = await self.db_helper.get_queries_by_brand(brand_id)
            
            total_queries = len(queries)
            successful_runs = 0
            failed_runs = 0
            
            # Run each query
            for query in queries:
                try:
                    result = await self._execute_query(brand, query)
                    successful_runs += 1
                    
                    logger.info(f"Query {query['id']} completed successfully")
                    
                except Exception as e:
                    failed_runs += 1
                    logger.error(f"Query {query['id']} failed: {e}")
                    
                    # Record failed run
                    await self._record_failed_run(brand_id, query["id"], str(e))
            
            return {
                "total_queries": total_queries,
                "successful_runs": successful_runs,
                "failed_runs": failed_runs
            }
            
        except Exception as e:
            logger.error(f"Error running brand queries for {brand_id}: {e}")
            raise
    
    async def _execute_query(self, brand: Dict, query: Dict) -> Dict:
        """Execute a single query against multiple AI engines."""
        brand_id = brand["id"]
        query_id = query["id"]
        query_text = query["text"]
        engine_targets = query.get("engine_targets", ["perplexity"])
        
        # Ensure engine_targets is a list
        if isinstance(engine_targets, str):
            engine_targets = [engine.strip() for engine in engine_targets.split(",")]
        
        total_citations_found = 0
        engine_results = []
        
        # Execute query against each engine
        for engine in engine_targets:
            engine = engine.strip().lower()
            
            # Create run record for this engine
            run_data = {
                "brand_id": brand_id,
                "query_id": query_id,
                "engine": engine,
                "started_at": datetime.now(),
                "status": RunStatus.RUNNING,
                "raw_response_ref": None
            }
            run_id = await self.db_helper.create_run(run_data)
            
            try:
                # Query the appropriate engine
                response_data = await self._query_engine(engine, query_text)
                
                # Extract citations
                citations = await self.citation_extractor.extract_citations(
                    response_data,
                    brand["domains"],
                    brand["canonical_pages"]
                )
                
                # Store citations
                engine_citations = 0
                for citation in citations:
                    citation_data = {
                        "brand_id": brand_id,
                        "query_id": query_id,
                        "engine": engine,
                        "timestamp": datetime.now(),
                        "snippet": citation.get("snippet", ""),
                        "matched_url": citation.get("matched_url"),
                        "matched_domain": citation.get("matched_domain"),
                        "confidence": citation.get("confidence", 0.0),
                        "raw_answer": response_data.get("answer", ""),
                        "source_urls": citation.get("source_urls", []),
                        "dedup_group_id": citation.get("dedup_group_id", ""),
                        "metadata": {
                            "match_type": citation.get("match_type", ""),
                            "model": response_data.get("metadata", {}).get("model", ""),
                            "usage": response_data.get("metadata", {}).get("usage", {})
                        }
                    }
                    
                    await self.db_helper.create_citation(citation_data)
                    engine_citations += 1
                
                # Update run record
                await self.db_helper.update_run(run_id, {
                    "ended_at": datetime.now(),
                    "status": RunStatus.SUCCESS,
                    "raw_response_ref": f"runs/{run_id}/response.json"
                })
                
                engine_results.append({
                    "engine": engine,
                    "citations_found": engine_citations,
                    "status": "success"
                })
                
                total_citations_found += engine_citations
                
                logger.info(f"Query {query_id} on {engine} completed: {engine_citations} citations found")
                
            except Exception as e:
                logger.error(f"Error executing query {query_id} on {engine}: {e}")
                
                # Update run record with error
                await self.db_helper.update_run(run_id, {
                    "ended_at": datetime.now(),
                    "status": RunStatus.FAILED,
                    "error_message": str(e)
                })
                
                engine_results.append({
                    "engine": engine,
                    "citations_found": 0,
                    "status": "error",
                    "error": str(e)
                })
        
        return {
            "query_id": query_id,
            "total_citations_found": total_citations_found,
            "engine_results": engine_results
        }
    
    async def _query_engine(self, engine: str, query_text: str) -> Dict:
        """Query a specific AI engine."""
        engine = engine.lower().strip()
        
        if engine == "perplexity":
            # Apply rate limiting for Perplexity
            await perplexity_rate_limiter.acquire()
            return await self.perplexity_client.query(query_text)
        elif engine == "chatgpt":
            return await self.chatgpt_client.query(query_text)
        elif engine in ["google_ai", "gemini", "google"]:
            return await self.google_ai_client.query(query_text)
        else:
            logger.warning(f"Unknown engine: {engine}")
            return {
                "answer": f"Unknown engine: {engine}",
                "sources": [],
                "metadata": {
                    "engine": engine,
                    "error": "unknown_engine"
                }
            }
    
    async def _get_active_brands(self) -> List[Dict]:
        """Get all active brands from database."""
        try:
            return await self.db_helper.get_all_brands()
        except Exception as e:
            logger.error(f"Error getting active brands: {e}")
            return []
    
    async def _get_query(self, query_id: str) -> Optional[Dict]:
        """Get a specific query by ID."""
        try:
            doc = self.db.collection("queries").document(query_id).get()
            if doc.exists:
                return {"id": doc.id, **doc.to_dict()}
            return None
        except Exception as e:
            logger.error(f"Error getting query {query_id}: {e}")
            return None
    
    async def _record_failed_run(self, brand_id: str, query_id: str, error_message: str):
        """Record a failed run."""
        run_data = {
            "brand_id": brand_id,
            "query_id": query_id,
            "engine": "perplexity",
            "started_at": datetime.now(),
            "ended_at": datetime.now(),
            "status": RunStatus.FAILED,
            "error_message": error_message
        }
        await self.db_helper.create_run(run_data)
