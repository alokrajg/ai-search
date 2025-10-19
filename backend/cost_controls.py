"""
Cost control configuration for AI API usage.
"""

# Cost control settings
COST_CONTROLS = {
    # Maximum queries per scheduler run
    "max_queries_per_run": 20,
    
    # Maximum queries per brand per run
    "max_queries_per_brand": 5,
    
    # Scheduler frequency (hours)
    "scheduler_frequency_hours": 2,
    
    # Daily cost limit (USD)
    "daily_cost_limit": 5.0,
    
    # Model preferences (cost-effective options)
    "model_preferences": {
        "chatgpt": "gpt-3.5-turbo",  # Cheapest OpenAI model
        "perplexity": "sonar",        # Cheaper than sonar-pro
        "google_ai": "gemini-2.0-flash"  # Cheapest Gemini model
    },
    
    # Rate limiting (requests per minute)
    "rate_limits": {
        "chatgpt": 20,      # OpenAI free tier limit
        "perplexity": 5,    # Conservative limit
        "google_ai": 15     # Google AI limit
    }
}

def get_cost_controls():
    """Get cost control configuration."""
    return COST_CONTROLS

def get_model_for_engine(engine: str) -> str:
    """Get the cost-effective model for an engine."""
    return COST_CONTROLS["model_preferences"].get(engine, "default")

def get_rate_limit_for_engine(engine: str) -> int:
    """Get the rate limit for an engine."""
    return COST_CONTROLS["rate_limits"].get(engine, 10)
