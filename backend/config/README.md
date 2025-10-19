# API Configuration Guide

This directory contains centralized configuration for cost-effective API usage.

## Files

- `api_config.py` - Main configuration file with all API parameters
- `README.md` - This documentation file

## Cost Control Environment Variables

Add these to your `.env` file to customize cost controls:

```bash
# Maximum queries per run (default: 10)
MAX_QUERIES_PER_RUN=10

# Maximum queries per brand per run (default: 3)
MAX_QUERIES_PER_BRAND=3

# Daily cost limit in USD (default: 2.0)
DAILY_COST_LIMIT=2.0

# Enable cost monitoring (default: true)
ENABLE_COST_MONITORING=true

# Enable retry on failure (default: false to save costs)
ENABLE_RETRY_ON_FAILURE=false

# Maximum retries per request (default: 1)
MAX_RETRIES=1

# Scheduler frequency in hours (default: 2)
SCHEDULER_FREQUENCY_HOURS=2

# Enable query caching (default: true)
ENABLE_QUERY_CACHING=true

# Cache duration in hours (default: 24)
CACHE_DURATION_HOURS=24

# Enable smart batching (default: true)
ENABLE_SMART_BATCHING=true

# Batch size for queries (default: 5)
BATCH_SIZE=5

# Enable cost alerts (default: true)
ENABLE_COST_ALERTS=true

# Cost alert threshold in USD (default: 1.0)
COST_ALERT_THRESHOLD=1.0
```

## Cost-Effective Settings

### Model Selection

- **ChatGPT**: `gpt-3.5-turbo` (cheapest OpenAI model)
- **Perplexity**: `sonar` (cheaper than sonar-pro)
- **Google AI**: `gemini-2.0-flash` (cheapest Gemini model)

### Token Limits

- **ChatGPT**: 500 tokens (reduced from 1000)
- **Perplexity**: 400 tokens (reduced from 1000)
- **Google AI**: 300 tokens (reduced from 1000)

### Rate Limits

- **ChatGPT**: 20 requests/minute
- **Perplexity**: 5 requests/minute
- **Google AI**: 15 requests/minute

### Cost Controls

- **Max queries per run**: 10 (reduced from 20)
- **Max queries per brand**: 3 (reduced from 5)
- **Daily cost limit**: $2.00
- **Retry on failure**: Disabled (saves costs)

## Usage

All API clients now automatically use these configurations:

```python
from config.api_config import api_config

# Get model configuration
config = api_config.get_model_config("perplexity")
model = config.get("model")  # "sonar"
max_tokens = config.get("max_tokens")  # 400

# Get cost controls
cost_config = api_config.get_cost_control_config()
max_queries = cost_config.get("max_queries_per_run")  # 10
```

## Monitoring

Use the cost monitoring script to track daily usage:

```bash
python monitor_costs.py
```

## Benefits

1. **Centralized Configuration**: All API parameters in one place
2. **Cost Optimization**: Reduced token limits and query frequency
3. **Rate Limiting**: Prevents excessive API calls
4. **Monitoring**: Track costs and usage
5. **Flexibility**: Easy to adjust parameters via environment variables
