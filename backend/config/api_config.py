"""
Cost-effective API configuration for AI services.
This file centralizes all API parameters to optimize costs and performance.
"""

import os
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class APIConfig:
    """Centralized API configuration for cost optimization."""
    
    # Cost-effective model selections
    MODELS = {
        "chatgpt": {
            "model": "gpt-3.5-turbo",  # Cheapest OpenAI model
            "max_tokens": 500,          # Reduced token limit
            "temperature": 0.3,         # Lower temperature for consistency
            "timeout": 30,
            "cost_per_1k_tokens": 0.0015,  # Input tokens
            "cost_per_1k_output_tokens": 0.002  # Output tokens
        },
        "perplexity": {
            "model": "sonar",           # Cheaper than sonar-pro
            "max_tokens": 400,          # Reduced token limit
            "temperature": 0.2,         # Lower temperature
            "timeout": 30,
            "cost_per_request": 0.002   # Estimated cost per request
        },
        "google_ai": {
            "model": "gemini-2.0-flash",  # Cheapest Gemini model
            "max_tokens": 300,          # Reduced token limit
            "temperature": 0.1,         # Lower temperature
            "timeout": 30,
            "cost_per_1k_tokens": 0.00075  # Input tokens
        }
    }
    
    # Rate limiting to prevent excessive costs
    RATE_LIMITS = {
        "chatgpt": {
            "requests_per_minute": 20,
            "requests_per_hour": 1000,
            "requests_per_day": 10000
        },
        "perplexity": {
            "requests_per_minute": 5,
            "requests_per_hour": 100,
            "requests_per_day": 1000
        },
        "google_ai": {
            "requests_per_minute": 15,
            "requests_per_hour": 500,
            "requests_per_day": 5000
        }
    }
    
    # Cost control settings
    COST_CONTROLS = {
        "max_queries_per_run": int(os.getenv("MAX_QUERIES_PER_RUN", "10")),
        "max_queries_per_brand": int(os.getenv("MAX_QUERIES_PER_BRAND", "3")),
        "daily_cost_limit": float(os.getenv("DAILY_COST_LIMIT", "2.0")),
        "enable_cost_monitoring": os.getenv("ENABLE_COST_MONITORING", "true").lower() == "true",
        "enable_retry_on_failure": os.getenv("ENABLE_RETRY_ON_FAILURE", "false").lower() == "true",
        "max_retries": int(os.getenv("MAX_RETRIES", "1"))
    }
    
    # Query optimization settings
    QUERY_OPTIMIZATION = {
        "min_query_length": 10,         # Minimum query length
        "max_query_length": 200,        # Maximum query length
        "enable_query_caching": True,   # Cache responses to avoid duplicate calls
        "cache_duration_hours": 24,     # How long to cache responses
        "enable_smart_batching": True,  # Batch similar queries
        "batch_size": 5                 # Number of queries to batch together
    }
    
    # Response optimization
    RESPONSE_OPTIMIZATION = {
        "max_response_length": 1000,    # Limit response length
        "enable_response_compression": True,
        "extract_citations_only": True,  # Only extract citations, not full responses
        "max_citations_per_response": 5  # Limit number of citations
    }
    
    # Error handling and fallbacks
    ERROR_HANDLING = {
        "enable_fallback_engines": True,
        "fallback_order": ["google_ai", "chatgpt", "perplexity"],  # Cheapest first
        "enable_graceful_degradation": True,
        "log_all_errors": True
    }
    
    # Monitoring and alerting
    MONITORING = {
        "enable_usage_tracking": True,
        "enable_cost_alerts": True,
        "cost_alert_threshold": 1.0,    # Alert when daily cost exceeds $1
        "enable_performance_metrics": True,
        "log_slow_requests": True,
        "slow_request_threshold_seconds": 10
    }

    @classmethod
    def get_model_config(cls, engine: str) -> Dict[str, Any]:
        """Get model configuration for a specific engine."""
        return cls.MODELS.get(engine, {})
    
    @classmethod
    def get_rate_limit_config(cls, engine: str) -> Dict[str, int]:
        """Get rate limit configuration for a specific engine."""
        return cls.RATE_LIMITS.get(engine, {})
    
    @classmethod
    def get_cost_control_config(cls) -> Dict[str, Any]:
        """Get cost control configuration."""
        return cls.COST_CONTROLS
    
    @classmethod
    def get_query_optimization_config(cls) -> Dict[str, Any]:
        """Get query optimization configuration."""
        return cls.QUERY_OPTIMIZATION
    
    @classmethod
    def get_response_optimization_config(cls) -> Dict[str, Any]:
        """Get response optimization configuration."""
        return cls.RESPONSE_OPTIMIZATION
    
    @classmethod
    def get_error_handling_config(cls) -> Dict[str, Any]:
        """Get error handling configuration."""
        return cls.ERROR_HANDLING
    
    @classmethod
    def get_monitoring_config(cls) -> Dict[str, Any]:
        """Get monitoring configuration."""
        return cls.MONITORING
    
    @classmethod
    def is_engine_enabled(cls, engine: str) -> bool:
        """Check if an engine is enabled based on API key availability."""
        api_keys = {
            "chatgpt": os.getenv("OPENAI_API_KEY"),
            "perplexity": os.getenv("PERPLEXITY_API_KEY"),
            "google_ai": os.getenv("GOOGLE_AI_API_KEY")
        }
        return bool(api_keys.get(engine))
    
    @classmethod
    def get_enabled_engines(cls) -> list:
        """Get list of enabled engines based on API key availability."""
        return [engine for engine in ["chatgpt", "perplexity", "google_ai"] 
                if cls.is_engine_enabled(engine)]
    
    @classmethod
    def estimate_request_cost(cls, engine: str, input_tokens: int = 0, output_tokens: int = 0) -> float:
        """Estimate the cost of a request for a specific engine."""
        config = cls.get_model_config(engine)
        
        if engine == "perplexity":
            return config.get("cost_per_request", 0.002)
        elif engine in ["chatgpt", "google_ai"]:
            input_cost = (input_tokens / 1000) * config.get("cost_per_1k_tokens", 0.001)
            output_cost = (output_tokens / 1000) * config.get("cost_per_1k_output_tokens", 0.002)
            return input_cost + output_cost
        
        return 0.0

# Global configuration instance
api_config = APIConfig()
