"""
Pydantic models for API request/response validation.
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class EngineType(str, Enum):
    """Supported AI engines."""
    PERPLEXITY = "perplexity"
    CHATGPT = "chatgpt"
    CLAUDE = "claude"
    GEMINI = "gemini"

class QueryCategory(str, Enum):
    """Query categories."""
    PRODUCT_HELP = "product-help"
    BRAND_INFO = "brand-info"
    COMPETITOR = "competitor"
    GENERAL = "general"

class RunStatus(str, Enum):
    """Run status values."""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"

# Brand Models
class BrandCreate(BaseModel):
    """Model for creating a brand."""
    name: str = Field(..., description="Brand name")
    domains: List[str] = Field(..., description="List of brand domains")
    canonical_pages: List[str] = Field(..., description="List of canonical page URLs")
    canonical_facts: Optional[Dict[str, Any]] = Field(default={}, description="Brand facts and metadata")
    
    def dict_for_firestore(self) -> dict:
        """Convert to dict suitable for Firestore storage."""
        return {
            "name": self.name,
            "domains": self.domains,
            "canonical_pages": self.canonical_pages,
            "canonical_facts": self.canonical_facts or {},
            "created_at": datetime.now()
        }

class BrandResponse(BaseModel):
    """Model for brand response."""
    id: str
    name: str
    domains: List[str]
    canonical_pages: List[str]
    canonical_facts: Dict[str, Any]
    created_at: Optional[datetime] = None

# Query Models
class QueryCreate(BaseModel):
    """Model for creating a query."""
    brand_id: str = Field(..., description="Brand ID")
    text: str = Field(..., description="Query text")
    category: QueryCategory = Field(..., description="Query category")
    engine_targets: List[EngineType] = Field(default=[EngineType.PERPLEXITY], description="Target engines")
    active: bool = Field(default=True, description="Whether query is active")

class QueryResponse(BaseModel):
    """Model for query response."""
    id: str
    brand_id: str
    text: str
    category: str
    engine_targets: List[str]
    active: bool
    created_at: Optional[datetime] = None

# Citation Models
class CitationResponse(BaseModel):
    """Model for citation response."""
    id: str
    brand_id: str
    query_id: str
    engine: str
    timestamp: datetime
    snippet: str
    matched_url: Optional[str] = None
    matched_domain: Optional[str] = None
    confidence: float
    raw_answer: str
    source_urls: List[str]
    dedup_group_id: str
    metadata: Dict[str, Any]

class CitationFilter(BaseModel):
    """Model for citation filtering."""
    brand_id: str
    query_id: Optional[str] = None
    page_url: Optional[str] = None
    engine: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = Field(default=100, le=1000)

# Visibility Models
class VisibilityResponse(BaseModel):
    """Model for visibility metrics."""
    date: str
    citations_count: int
    unique_pages: int
    visibility_score: float
    engine_breakdown: Dict[str, int]

class TopPageResponse(BaseModel):
    """Model for top performing pages."""
    page_url: str
    citations_count: int
    visibility_share: float
    last_cited: Optional[datetime] = None

class VisibilityFilter(BaseModel):
    """Model for visibility filtering."""
    brand_id: str
    start_date: str
    end_date: str
    engine: Optional[str] = None

# Run Models
class RunCreate(BaseModel):
    """Model for creating a run."""
    brand_id: str
    query_id: str
    engine: str

class RunResponse(BaseModel):
    """Model for run response."""
    id: str
    brand_id: str
    query_id: str
    engine: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    status: str
    raw_response_ref: Optional[str] = None
    error_message: Optional[str] = None

# Engine Models
class EngineConfig(BaseModel):
    """Model for engine configuration."""
    name: str
    api_endpoint: str
    rate_limit_per_min: int
    api_key_env: str
    active: bool = True

# Aggregation Models
class AggregateData(BaseModel):
    """Model for aggregate data."""
    date: str
    citations_count: int
    unique_pages: int
    visibility_score: float
    engine_breakdown: Dict[str, int]
    top_pages: List[TopPageResponse]

# API Response Models
class APIResponse(BaseModel):
    """Generic API response model."""
    success: bool
    message: str
    data: Optional[Any] = None

class PaginatedResponse(BaseModel):
    """Paginated response model."""
    items: List[Any]
    total: int
    page: int
    page_size: int
    has_next: bool
