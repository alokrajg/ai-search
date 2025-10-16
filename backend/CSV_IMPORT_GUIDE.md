# CSV Import Guide for GEO Search Platform

This guide explains how to bulk import brands, queries, and competitor data using CSV files.

## 🚀 Quick Start

### 1. Create Sample Files

```bash
cd backend
python scripts/import_cli.py samples
```

This creates three sample CSV files:

- `sample_brands.csv` - Brand data
- `sample_queries.csv` - Query data
- `sample_competitors.csv` - Competitor data

### 2. Import Data

```bash
# Import brands
python scripts/import_cli.py brands sample_brands.csv

# Import queries
python scripts/import_cli.py queries sample_queries.csv

# Import competitors
python scripts/import_cli.py competitors sample_competitors.csv
```

## 📊 CSV File Formats

### Brands CSV (`brands.csv`)

| Column            | Type        | Required | Description             | Example                                                   |
| ----------------- | ----------- | -------- | ----------------------- | --------------------------------------------------------- |
| `name`            | String      | ✅       | Brand name              | `Zudio`                                                   |
| `domains`         | String      | ✅       | Comma-separated domains | `zudio.com,www.zudio.com`                                 |
| `canonical_pages` | String      | ✅       | Comma-separated URLs    | `https://www.zudio.com/,https://www.zudio.com/products`   |
| `canonical_facts` | JSON String | ❌       | Brand metadata as JSON  | `{"category":"fashion","target_audience":"young_adults"}` |

**Example:**

```csv
name,domains,canonical_pages,canonical_facts
Zudio,"zudio.com,www.zudio.com","https://www.zudio.com/,https://www.zudio.com/products","{""category"":""fashion"",""target_audience"":""young_adults""}"
H&M,"hm.com,www2.hm.com","https://www2.hm.com/en_in/index.html","{""category"":""fashion"",""target_audience"":""all_ages""}"
```

### Queries CSV (`queries.csv`)

| Column           | Type    | Required | Description                    | Example                                               |
| ---------------- | ------- | -------- | ------------------------------ | ----------------------------------------------------- |
| `brand_name`     | String  | ✅       | Must match existing brand name | `Zudio`                                               |
| `text`           | String  | ✅       | Query text                     | `affordable fashion for young adults`                 |
| `category`       | String  | ✅       | Query category                 | `product-help`, `brand-info`, `competitor`, `general` |
| `engine_targets` | String  | ✅       | Comma-separated engines        | `perplexity,chatgpt`                                  |
| `active`         | Boolean | ❌       | Whether query is active        | `true`, `false`                                       |

**Example:**

```csv
brand_name,text,category,engine_targets,active
Zudio,"affordable fashion for young adults",product-help,"perplexity,chatgpt",true
Zudio,"trendy clothing brands in India",brand-info,perplexity,true
H&M,"sustainable fashion brands",product-help,perplexity,true
```

### Competitors CSV (`competitors.csv`)

| Column               | Type   | Required | Description                    | Example                                |
| -------------------- | ------ | -------- | ------------------------------ | -------------------------------------- |
| `brand_name`         | String | ✅       | Must match existing brand name | `Zudio`                                |
| `competitor_name`    | String | ✅       | Competitor brand name          | `H&M`                                  |
| `competitor_domains` | String | ✅       | Comma-separated domains        | `hm.com,www2.hm.com`                   |
| `competitor_pages`   | String | ✅       | Comma-separated URLs           | `https://www2.hm.com/en_in/index.html` |
| `notes`              | String | ❌       | Additional notes               | `Swedish fashion retailer`             |

**Example:**

```csv
brand_name,competitor_name,competitor_domains,competitor_pages,notes
Zudio,H&M,"hm.com,www2.hm.com","https://www2.hm.com/en_in/index.html",Swedish fashion retailer
Zudio,Zara,"zara.com,www.zara.com","https://www.zara.com/in/",Spanish fashion brand
H&M,Zara,"zara.com,www.zara.com","https://www.zara.com/in/",Spanish fashion brand
```

## 🛠️ Advanced Usage

### Using the Python API Directly

```python
import asyncio
from scripts.csv_importer import CSVImporter

async def import_data():
    importer = CSVImporter()
    await importer.initialize()

    # Import brands
    brands_result = await importer.import_brands_from_csv('my_brands.csv')
    print(f"Imported {brands_result['successful']} brands")

    # Import queries
    queries_result = await importer.import_queries_from_csv('my_queries.csv')
    print(f"Imported {queries_result['successful']} queries")

    # Import competitors
    competitors_result = await importer.import_competitors_from_csv('my_competitors.csv')
    print(f"Imported {competitors_result['successful']} competitors")

# Run the import
asyncio.run(import_data())
```

### Batch Import Script

Create a batch import script for multiple files:

```python
#!/usr/bin/env python3
import asyncio
from scripts.csv_importer import CSVImporter

async def batch_import():
    importer = CSVImporter()
    await importer.initialize()

    files = [
        ('brands.csv', 'brands'),
        ('queries.csv', 'queries'),
        ('competitors.csv', 'competitors')
    ]

    for filename, import_type in files:
        print(f"\n📊 Importing {import_type} from {filename}...")

        if import_type == 'brands':
            result = await importer.import_brands_from_csv(filename)
        elif import_type == 'queries':
            result = await importer.import_queries_from_csv(filename)
        elif import_type == 'competitors':
            result = await importer.import_competitors_from_csv(filename)

        print(f"✅ {import_type.capitalize()}: {result['successful']}/{result['total_rows']} imported")

asyncio.run(batch_import())
```

## 📋 Data Validation

### Brand Validation

- ✅ Brand name must be unique
- ✅ Domains must be valid format
- ✅ Canonical pages must be valid URLs
- ✅ Canonical facts must be valid JSON (if provided)

### Query Validation

- ✅ Brand name must exist in database
- ✅ Category must be one of: `product-help`, `brand-info`, `competitor`, `general`
- ✅ Engine targets must be valid: `perplexity`, `chatgpt`, `claude`, `gemini`
- ✅ Active must be boolean

### Competitor Validation

- ✅ Brand name must exist in database
- ✅ Competitor domains must be valid format
- ✅ Competitor pages must be valid URLs

## 🔧 Troubleshooting

### Common Issues

1. **"Brand not found" error**

   - Ensure brand names in queries/competitors CSV match exactly with brands CSV
   - Import brands first, then queries and competitors

2. **"Invalid category" error**

   - Use only: `product-help`, `brand-info`, `competitor`, `general`

3. **"Invalid engine" error**

   - Use only: `perplexity`, `chatgpt`, `claude`, `gemini`

4. **JSON parsing error in canonical_facts**

   - Ensure proper JSON format with escaped quotes
   - Example: `{"key":"value"}` → `"{""key"":""value""}"`

5. **File not found error**
   - Check file path is correct
   - Ensure file exists in the current directory

### Error Handling

The importer provides detailed error information:

```bash
✅ Import completed:
  Total rows: 10
  Successful: 8
  Failed: 2

❌ Errors:
  - Row 3: Brand 'InvalidBrand' not found
  - Row 7: Invalid category: invalid-category
```

## 📈 Performance Tips

1. **Batch Size**: Import in batches of 100-500 records for optimal performance
2. **File Size**: Keep CSV files under 10MB for best results
3. **Order**: Import brands first, then queries, then competitors
4. **Validation**: Use sample files to test format before importing large datasets

## 🔄 Data Updates

To update existing data:

1. **Brands**: Use the same brand name to update existing records
2. **Queries**: Create new queries (no update functionality yet)
3. **Competitors**: Create new competitor records (no update functionality yet)

## 📞 Support

For issues or questions:

1. Check the error messages in the import output
2. Verify CSV format matches the examples
3. Test with sample files first
4. Check Firestore connection and permissions

---

**Happy importing! 🚀**
