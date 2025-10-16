# GEO Search Platform - Backend

A comprehensive backend API for monitoring AI visibility and citation tracking across generative search engines.

## 🚀 Features

### Core Functionality

- **AI Engine Integration**: Perplexity API integration with rate limiting
- **Citation Extraction**: Advanced citation matching and confidence scoring
- **Automated Scheduling**: APScheduler for query running and aggregation
- **Visibility Metrics**: Real-time visibility score calculation
- **Data Aggregation**: Daily/weekly metrics computation
- **RESTful API**: FastAPI-based endpoints for dashboard integration

### Key Components

- **Query Runner**: Automated execution of brand queries against AI engines
- **Citation Extractor**: Intelligent matching of citations to brand content
- **Visibility Aggregator**: Calculation of visibility scores and metrics
- **Firestore Integration**: Scalable NoSQL database for citation storage
- **Rate Limiting**: Built-in rate limiting for API compliance

## 🛠 Tech Stack

- **Framework**: FastAPI (Python 3.8+)
- **Database**: Google Cloud Firestore
- **Scheduling**: APScheduler
- **AI Integration**: Perplexity API
- **HTTP Client**: httpx (async)
- **Validation**: Pydantic
- **Environment**: python-dotenv

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── env.example            # Environment variables template
├── core/                  # Core business logic
│   ├── database.py        # Firestore connection and helpers
│   ├── models.py          # Pydantic models for API
│   ├── perplexity_client.py # Perplexity API client
│   ├── citation_extractor.py # Citation extraction logic
│   ├── query_runner.py    # Query execution engine
│   ├── aggregator.py      # Visibility metrics calculation
│   └── scheduler.py       # APScheduler configuration
├── api/                   # API routes
│   └── routes/
│       ├── brands.py      # Brand management endpoints
│       ├── queries.py     # Query management endpoints
│       ├── citations.py   # Citation retrieval endpoints
│       ├── visibility.py  # Visibility metrics endpoints
│       └── debug.py       # Debug and testing endpoints
└── scripts/
    └── init_firestore.py  # Database initialization script
```

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.8+
- Google Cloud Project with Firestore enabled
- Perplexity API key

### 2. Installation

```bash
# Clone the repository
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Environment Configuration

Edit `.env` file with your settings:

```env
# Required
PERPLEXITY_API_KEY=your_perplexity_api_key_here
GOOGLE_CLOUD_PROJECT=your-gcp-project-id

# Optional (for local development)
FIRESTORE_EMULATOR_HOST=localhost:8080
ENVIRONMENT=development
```

### 4. Initialize Database

```bash
# Run the initialization script
python scripts/init_firestore.py
```

### 5. Start the Server

```bash
# Development mode
python main.py

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Brands

- `POST /api/v1/brands/` - Create a new brand
- `GET /api/v1/brands/{brand_id}` - Get brand details
- `GET /api/v1/brands/` - List all brands

#### Queries

- `POST /api/v1/queries/` - Create a new query
- `GET /api/v1/queries/brand/{brand_id}` - Get queries for a brand

#### Citations

- `GET /api/v1/citations/brand/{brand_id}` - Get citations for a brand
- `GET /api/v1/citations/brand/{brand_id}/export` - Export citations as CSV
- `GET /api/v1/citations/brand/{brand_id}/stats` - Get citation statistics

#### Visibility

- `GET /api/v1/visibility/brand/{brand_id}/timeseries` - Get visibility time series
- `GET /api/v1/visibility/brand/{brand_id}/top-pages` - Get top performing pages
- `GET /api/v1/visibility/brand/{brand_id}/current` - Get current visibility metrics

#### Debug

- `POST /api/v1/debug/test-perplexity` - Test Perplexity API connection
- `POST /api/v1/debug/run-query` - Manually run a single query
- `GET /api/v1/debug/scheduler/status` - Get scheduler status

## 🔧 Configuration

### Scheduler Configuration

- **Query Runner**: Every 30 minutes
- **Aggregation**: Daily at 2 AM UTC
- **Cleanup**: Weekly on Sunday at 3 AM UTC

### Rate Limiting

- **Perplexity API**: 50 calls per minute (configurable)
- **Automatic backoff**: Exponential backoff with jitter

### Data Retention

- **Citations**: 365 days (configurable)
- **Runs**: 30 days (configurable)
- **Aggregates**: Indefinite

## 🧪 Testing

### Manual Testing

```bash
# Test Perplexity connection
curl -X POST "http://localhost:8000/api/v1/debug/test-perplexity"

# Run a single query
curl -X POST "http://localhost:8000/api/v1/debug/run-query" \
  -H "Content-Type: application/json" \
  -d '{"brand_id": "your_brand_id", "query_text": "test query"}'

# Get scheduler status
curl "http://localhost:8000/api/v1/debug/scheduler/status"
```

### Health Check

```bash
curl "http://localhost:8000/health"
```

## 📊 Monitoring

### Logs

- Structured JSON logging
- Request/response logging
- Error tracking
- Performance metrics

### Metrics

- Query execution times
- Citation extraction accuracy
- API response times
- Error rates

## 🔒 Security

### API Security

- CORS configuration
- Rate limiting
- Input validation
- Error handling

### Data Security

- Environment variable protection
- API key management
- Firestore security rules
- Data encryption in transit

## 🚀 Deployment

### Local Development

```bash
python main.py
```

### Production Deployment

```bash
# Using gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Using Docker (if Dockerfile provided)
docker build -t geo-search-backend .
docker run -p 8000:8000 geo-search-backend
```

### Environment Variables for Production

- Set `ENVIRONMENT=production`
- Configure proper `GOOGLE_APPLICATION_CREDENTIALS`
- Set secure `SECRET_KEY`
- Configure `ALLOWED_ORIGINS`

## 🔧 Development

### Adding New AI Engines

1. Extend `EngineType` enum in `models.py`
2. Create new client in `core/` directory
3. Update `query_runner.py` to support new engine
4. Add engine configuration to Firestore

### Adding New Metrics

1. Extend aggregation logic in `aggregator.py`
2. Update `VisibilityResponse` model
3. Add new API endpoints in `visibility.py`

### Database Schema Changes

1. Update Firestore collections in `database.py`
2. Modify Pydantic models in `models.py`
3. Update initialization script

## 📝 API Examples

### Create a Brand

```bash
curl -X POST "http://localhost:8000/api/v1/brands/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "domains": ["mycompany.com"],
    "canonical_pages": ["https://mycompany.com/product"]
  }'
```

### Create a Query

```bash
curl -X POST "http://localhost:8000/api/v1/queries/" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "brand_id_here",
    "text": "best product for beginners",
    "category": "product-help"
  }'
```

### Get Visibility Metrics

```bash
curl "http://localhost:8000/api/v1/visibility/brand/brand_id_here/current"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:

1. Check the API documentation at `/docs`
2. Review the logs for error details
3. Test individual components using debug endpoints
4. Check Firestore data using the initialization script

---

**Built with ❤️ for the future of AI search optimization**
