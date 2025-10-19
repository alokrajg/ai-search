"""
Firestore database configuration and connection management.
"""

import os
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Global Firestore client
db = None

async def init_firestore():
    """Initialize Firestore connection."""
    global db
    try:
        # Get project ID from environment
        project_id = os.getenv("FIREBASE_PROJECT_ID") or os.getenv("GOOGLE_CLOUD_PROJECT") or os.getenv("FIRESTORE_PROJECT_ID")
        
        if not project_id:
            raise ValueError("FIREBASE_PROJECT_ID, GOOGLE_CLOUD_PROJECT, or FIRESTORE_PROJECT_ID must be set")
        
        # Initialize Firestore client using Firebase Admin SDK credentials
        if os.getenv("FIREBASE_PRIVATE_KEY") and os.getenv("FIREBASE_CLIENT_EMAIL"):
            # Use Firebase Admin SDK credentials from environment variables
            from google.oauth2 import service_account
            import json
            
            # Create credentials from environment variables
            credentials_info = {
                "type": "service_account",
                "project_id": project_id,
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('FIREBASE_CLIENT_EMAIL').replace('@', '%40')}",
                "universe_domain": "googleapis.com"
            }
            
            credentials = service_account.Credentials.from_service_account_info(credentials_info)
            db = firestore.Client(project=project_id, credentials=credentials)
        elif os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            # Use service account key file
            db = firestore.Client(project=project_id)
        else:
            # Use default credentials
            db = firestore.Client(project=project_id)
        
        logger.info(f"✅ Firestore connection initialized successfully for project: {project_id}")
        return db
    except Exception as e:
        logger.error(f"❌ Failed to initialize Firestore: {e}")
        raise

def get_db():
    """Get Firestore database instance."""
    if db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    return db

# Collection names
COLLECTIONS = {
    "brands": "brands",
    "queries": "queries", 
    "engines": "engines",
    "runs": "runs",
    "citations": "citations",
    "aggregates": "aggregates"
}

# Firestore helper functions
class FirestoreHelper:
    """Helper class for common Firestore operations."""
    
    def __init__(self, db_instance):
        self.db = db_instance
    
    async def create_brand(self, brand_data: dict) -> str:
        """Create a new brand document."""
        doc_ref = self.db.collection(COLLECTIONS["brands"]).document()
        doc_ref.set(brand_data)
        return doc_ref.id
    
    async def get_brand(self, brand_id: str) -> dict:
        """Get brand document by ID."""
        doc = self.db.collection(COLLECTIONS["brands"]).document(brand_id).get()
        if doc.exists:
            return {"id": doc.id, **doc.to_dict()}
        return None
    
    async def get_all_brands(self) -> list:
        """Get all brand documents."""
        brands = []
        docs = self.db.collection(COLLECTIONS["brands"]).stream()

        for doc in docs:
            brand_data = doc.to_dict()
            brand_data["id"] = doc.id
            brands.append(brand_data)

        return brands

    async def get_all_queries(self) -> list:
        """Get all query documents."""
        queries = []
        docs = self.db.collection(COLLECTIONS["queries"]).stream()

        for doc in docs:
            query_data = doc.to_dict()
            query_data["id"] = doc.id
            queries.append(query_data)

        return queries
    
    async def create_query(self, query_data: dict) -> str:
        """Create a new query document."""
        doc_ref = self.db.collection(COLLECTIONS["queries"]).document()
        doc_ref.set(query_data)
        return doc_ref.id
    
    async def get_queries_by_brand(self, brand_id: str) -> list:
        """Get all queries for a brand."""
        queries = self.db.collection(COLLECTIONS["queries"])\
            .where(filter=FieldFilter("brand_id", "==", brand_id))\
            .where(filter=FieldFilter("active", "==", True))\
            .stream()
        
        return [{"id": doc.id, **doc.to_dict()} for doc in queries]
    
    async def create_citation(self, citation_data: dict) -> str:
        """Create a new citation document."""
        doc_ref = self.db.collection(COLLECTIONS["citations"]).document()
        doc_ref.set(citation_data)
        return doc_ref.id
    
    async def get_citations_by_brand(self, brand_id: str, limit: int = 100) -> list:
        """Get citations for a brand."""
        citations = self.db.collection(COLLECTIONS["citations"])\
            .where(filter=FieldFilter("brand_id", "==", brand_id))\
            .order_by("timestamp", direction=firestore.Query.DESCENDING)\
            .limit(limit)\
            .stream()
        
        return [{"id": doc.id, **doc.to_dict()} for doc in citations]
    
    async def get_all_citations(self) -> list:
        """Get all citations."""
        citations = []
        docs = self.db.collection(COLLECTIONS["citations"]).stream()
        
        for doc in docs:
            citation_data = doc.to_dict()
            citation_data["id"] = doc.id
            citations.append(citation_data)
        
        return citations
    
    async def create_run(self, run_data: dict) -> str:
        """Create a new run document."""
        doc_ref = self.db.collection(COLLECTIONS["runs"]).document()
        doc_ref.set(run_data)
        return doc_ref.id
    
    async def update_run(self, run_id: str, update_data: dict):
        """Update a run document."""
        self.db.collection(COLLECTIONS["runs"]).document(run_id).update(update_data)
    
    async def create_competitor(self, competitor_data: dict) -> str:
        """Create a new competitor document."""
        doc_ref = self.db.collection("competitors").document()
        doc_ref.set(competitor_data)
        return doc_ref.id
    
    async def create_aggregate(self, brand_id: str, date: str, aggregate_data: dict):
        """Create or update daily aggregate."""
        doc_ref = self.db.collection(COLLECTIONS["aggregates"])\
            .document(brand_id)\
            .collection("daily")\
            .document(date)
        doc_ref.set(aggregate_data)
    
    async def get_aggregates(self, brand_id: str, start_date: str, end_date: str) -> list:
        """Get aggregates for a date range."""
        aggregates = self.db.collection(COLLECTIONS["aggregates"])\
            .document(brand_id)\
            .collection("daily")\
            .where(filter=FieldFilter("date", ">=", start_date))\
            .where(filter=FieldFilter("date", "<=", end_date))\
            .order_by("date")\
            .stream()
        
        return [{"id": doc.id, **doc.to_dict()} for doc in aggregates]
    
    async def delete_brand(self, brand_id: str):
        """Delete a brand and all its associated data."""
        # Delete brand document
        self.db.collection(COLLECTIONS["brands"]).document(brand_id).delete()
        
        # Delete associated queries
        queries = self.db.collection(COLLECTIONS["queries"])\
            .where(filter=FieldFilter("brand_id", "==", brand_id))\
            .stream()
        for query in queries:
            query.reference.delete()
        
        # Delete associated citations
        citations = self.db.collection(COLLECTIONS["citations"])\
            .where(filter=FieldFilter("brand_id", "==", brand_id))\
            .stream()
        for citation in citations:
            citation.reference.delete()
        
        # Delete visibility metrics
        metrics_ref = self.db.collection("visibility_metrics").document(brand_id)
        daily_metrics = metrics_ref.collection("daily").stream()
        for daily_doc in daily_metrics:
            daily_doc.reference.delete()
        metrics_ref.delete()
        
        # Delete aggregates
        aggregates_ref = self.db.collection(COLLECTIONS["aggregates"]).document(brand_id)
        daily_aggregates = aggregates_ref.collection("daily").stream()
        for daily_doc in daily_aggregates:
            daily_doc.reference.delete()
        aggregates_ref.delete()
