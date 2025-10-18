"""
GEO Search Platform - Backend API
Main FastAPI application for AI visibility monitoring and citation tracking.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from api.routes import brands, citations, queries, visibility, debug, query_upload, query_export, query_performance, dashboard_metrics
from core.database import init_firestore
from core.scheduler import start_scheduler, stop_scheduler

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup/shutdown events."""
    # Startup
    print("🚀 Starting GEO Search Backend...")
    await init_firestore()
    start_scheduler()
    print("✅ Backend started successfully!")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down GEO Search Backend...")
    stop_scheduler()
    print("✅ Backend stopped successfully!")

# Create FastAPI app
app = FastAPI(
    title="GEO Search Platform API",
    description="Backend API for AI visibility monitoring and citation tracking",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(brands.router, prefix="/api/v1/brands", tags=["brands"])
app.include_router(citations.router, prefix="/api/v1/citations", tags=["citations"])
app.include_router(queries.router, prefix="/api/v1/queries", tags=["queries"])
app.include_router(visibility.router, prefix="/api/v1/visibility", tags=["visibility"])
app.include_router(query_upload.router, prefix="/api/v1/upload", tags=["query-upload"])
app.include_router(query_export.router, prefix="/api/v1/export", tags=["query-export"])
app.include_router(query_performance.router, prefix="/api/v1/performance", tags=["query-performance"])
app.include_router(dashboard_metrics.router, prefix="/api/v1/dashboard", tags=["dashboard-metrics"])
app.include_router(debug.router, prefix="/api/v1/debug", tags=["debug"])

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "GEO Search Platform API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "geo-search-backend"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
