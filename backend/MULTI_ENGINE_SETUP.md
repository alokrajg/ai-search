# Multi-Engine AI Search Setup

This document explains how to set up and use multiple AI engines (Perplexity, ChatGPT, and Google AI) in the AI Search Platform.

## 🚀 Supported AI Engines

### 1. Perplexity AI

- **API**: Perplexity API
- **Model**: sonar-pro
- **Features**: Real-time web search with citations
- **Rate Limiting**: Built-in rate limiting
- **Required**: `PERPLEXITY_API_KEY`

### 2. ChatGPT (OpenAI)

- **API**: OpenAI Chat Completions API
- **Model**: gpt-4 (or gpt-3.5-turbo)
- **Features**: Advanced reasoning with source extraction
- **Rate Limiting**: OpenAI's built-in limits
- **Required**: `OPENAI_API_KEY`

### 3. Google AI (Gemini)

- **API**: Google AI Studio API
- **Model**: gemini-pro
- **Features**: Google's latest AI with web knowledge
- **Rate Limiting**: Google's built-in limits
- **Required**: `GOOGLE_AI_API_KEY`

## 🔧 Setup Instructions

### 1. Environment Configuration

Create or update your `.env` file:

```env
# Required API Keys
PERPLEXITY_API_KEY=your_perplexity_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
```

### 2. API Key Setup

#### Perplexity API Key

1. Go to [Perplexity API](https://www.perplexity.ai/settings/api)
2. Create an account and generate an API key
3. Add to your `.env` file

#### OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to your `.env` file

#### Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env` file

### 3. Test the Setup

Run the test script to verify all clients are working:

```bash
cd backend
python test_new_clients.py
```

## 📊 Usage Examples

### 1. Single Engine Query

```csv
brand_name,text,category,engine_targets,active
Zudio,"affordable fashion for young adults",product-help,perplexity,true
```

### 2. Multiple Engine Query

```csv
brand_name,text,category,engine_targets,active
Zudio,"affordable fashion for young adults",product-help,"perplexity,chatgpt",true
```

### 3. All Engines Query

```csv
brand_name,text,category,engine_targets,active
Zudio,"affordable fashion for young adults",product-help,"perplexity,chatgpt,google_ai",true
```

## 🔄 How It Works

### Query Execution Flow

1. **Query Parsing**: System reads `engine_targets` from CSV
2. **Engine Selection**: Determines which engines to query
3. **Parallel Execution**: Queries each engine simultaneously
4. **Citation Extraction**: Extracts citations from each response
5. **Data Storage**: Stores results with engine-specific metadata

### Engine-Specific Features

#### Perplexity

- Real-time web search
- Built-in citations
- High accuracy for current information

#### ChatGPT

- Advanced reasoning
- Source extraction from response text
- Good for comprehensive answers

#### Google AI

- Google's latest AI model
- Web knowledge integration
- Competitive with other engines

## 📈 Performance Considerations

### Rate Limiting

- **Perplexity**: Built-in rate limiting (5 requests/minute)
- **ChatGPT**: OpenAI's rate limits (varies by tier)
- **Google AI**: Google's rate limits (varies by quota)

### Cost Optimization

- **Perplexity**: Pay per request
- **ChatGPT**: Pay per token (gpt-3.5-turbo is cheaper)
- **Google AI**: Pay per request

### Error Handling

- Each engine is queried independently
- If one engine fails, others continue
- Detailed error logging for debugging

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Not Found**

   ```
   ❌ ChatGPT API key not configured. Set OPENAI_API_KEY environment variable.
   ```

   **Solution**: Add the API key to your `.env` file

2. **Rate Limit Exceeded**

   ```
   ❌ ChatGPT Error: Rate limit exceeded
   ```

   **Solution**: Wait or upgrade your API plan

3. **Unknown Engine**
   ```
   ❌ Unknown engine: claude
   ```
   **Solution**: Use supported engines: `perplexity`, `chatgpt`, `google_ai`

### Debug Mode

Enable debug logging:

```env
LOG_LEVEL=DEBUG
```

## 📊 Monitoring

### Query Results

Each query execution returns:

- Total citations found across all engines
- Per-engine results with citation counts
- Error details for failed engines

### Dashboard Integration

The dashboard will show:

- Engine-specific citation counts
- Performance metrics per engine
- Comparative analysis across engines

## 🔮 Future Enhancements

### Planned Features

- Claude AI integration
- Custom engine configurations
- Advanced citation scoring
- Engine performance analytics
- Cost tracking per engine

### Custom Engines

The system is designed to easily add new engines:

1. Create a new client class
2. Add to `_query_engine` method
3. Update `EngineType` enum
4. Add to documentation

## 📚 API Reference

### ChatGPT Client

```python
from core.chatgpt_client import ChatGPTClient

client = ChatGPTClient()
response = await client.query("Your query here")
```

### Google AI Client

```python
from core.google_ai_client import GoogleAIClient

client = GoogleAIClient()
response = await client.query("Your query here")
```

### Query Runner

```python
from core.query_runner import QueryRunner

runner = QueryRunner()
result = await runner.run_single_query(brand_id, query_id)
```

## 🎯 Best Practices

1. **Start Small**: Test with one engine first
2. **Monitor Costs**: Track API usage and costs
3. **Handle Errors**: Implement proper error handling
4. **Rate Limiting**: Respect API rate limits
5. **Data Quality**: Review citation quality regularly

## 📞 Support

For issues or questions:

1. Check the logs for detailed error messages
2. Verify API keys are correctly configured
3. Test individual engines using the test script
4. Review the troubleshooting section above
