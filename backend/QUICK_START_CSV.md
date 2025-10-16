# 🚀 Quick Start: CSV Import System

## ✅ What We Just Built

A complete CSV import system that allows you to bulk import:

- **Brands** with domains, canonical pages, and metadata
- **Queries** with categories, engine targets, and activation status
- **Competitors** with domains, pages, and notes

## 🎯 How to Use

### 1. Create Sample Files

```bash
cd backend
source venv/bin/activate
python scripts/import_cli.py samples
```

### 2. Import Your Data

```bash
# Import brands first
python scripts/import_cli.py brands sample_brands.csv

# Then import queries
python scripts/import_cli.py queries sample_queries.csv

# Finally import competitors
python scripts/import_cli.py competitors sample_competitors.csv
```

## 📊 CSV File Examples

### Brands CSV

```csv
name,domains,canonical_pages,canonical_facts
Zudio,"zudio.com,www.zudio.com","https://www.zudio.com/,https://www.zudio.com/products","{""category"":""fashion"",""target_audience"":""young_adults""}"
```

### Queries CSV

```csv
brand_name,text,category,engine_targets,active
Zudio,"affordable fashion for young adults",product-help,"perplexity,chatgpt",true
```

### Competitors CSV

```csv
brand_name,competitor_name,competitor_domains,competitor_pages,notes
Zudio,H&M,"hm.com,www2.hm.com","https://www2.hm.com/en_in/index.html",Swedish fashion retailer
```

## ✅ Success! What We Imported

### Brands Created:

- ✅ **Zudio** (ID: v8ZznKlRWYMQkTZytgW6)
- ✅ **H&M** (ID: Kq6qhN9bu9XmIwqayjwZ)
- ✅ **Zara** (ID: SrzVbtOKuYfEQc2rkROK)

### Queries Created:

- ✅ **6 queries** across all brands
- ✅ **Categories**: product-help, brand-info, competitor
- ✅ **Engines**: perplexity, chatgpt

### Competitors Created:

- ✅ **5 competitor relationships**
- ✅ **Cross-brand competitor mapping**

## 🔍 Verify Your Data

```bash
# Check a specific brand
curl "http://localhost:8000/api/v1/brands/v8ZznKlRWYMQkTZytgW6"

# Check queries for a brand
curl "http://localhost:8000/api/v1/queries/brand/v8ZznKlRWYMQkTZytgW6"

# Check visibility metrics
curl "http://localhost:8000/api/v1/visibility/brand/v8ZznKlRWYMQkTZytgW6/current"
```

## 🎉 Ready for Production!

Your CSV import system is now:

- ✅ **Fully functional** - All imports working
- ✅ **Error handling** - Detailed error messages
- ✅ **Data validation** - Proper format checking
- ✅ **Firebase integrated** - All data stored in Firestore
- ✅ **API ready** - Data accessible via REST API

## 📋 Next Steps

1. **Create your own CSV files** with your brand data
2. **Import your data** using the CLI tool
3. **Run queries** to test citation extraction
4. **Monitor visibility** metrics in your dashboard
5. **Scale up** with larger datasets

**Happy importing! 🚀**
