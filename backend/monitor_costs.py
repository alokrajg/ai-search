#!/usr/bin/env python3
"""
Monitor API costs and usage to prevent unexpected billing.
"""

import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import sys
from pathlib import Path

# Load environment variables
load_dotenv()

# Add config directory to path
config_dir = Path(__file__).parent / "config"
sys.path.insert(0, str(config_dir))

from api_config import api_config

def init_firebase():
    """Initialize Firebase connection."""
    if not firebase_admin._apps:
        cred = credentials.Certificate({
            'type': 'service_account',
            'project_id': os.getenv('FIREBASE_PROJECT_ID'),
            'private_key_id': os.getenv('FIREBASE_PRIVATE_KEY_ID'),
            'private_key': os.getenv('FIREBASE_PRIVATE_KEY').replace('\\\\n', '\\n'),
            'client_email': os.getenv('FIREBASE_CLIENT_EMAIL'),
            'client_id': os.getenv('FIREBASE_CLIENT_ID'),
            'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
            'token_uri': 'https://oauth2.googleapis.com/token',
            'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
            'client_x509_cert_url': os.getenv('FIREBASE_CLIENT_X509_CERT_URL')
        })
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

def monitor_daily_costs():
    """Monitor daily API costs and alert if they exceed limits."""
    db = init_firebase()
    
    print('=== DAILY COST MONITORING ===')
    print(f'Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print()
    
    # Get today's citations
    today = datetime.now().date()
    today_citations = []
    
    all_citations = db.collection('citations').get()
    
    for citation in all_citations:
        citation_data = citation.to_dict()
        created_at = citation_data.get('created_at')
        
        if created_at:
            try:
                if isinstance(created_at, str):
                    created_date = datetime.fromisoformat(created_at.replace('Z', '+00:00')).date()
                else:
                    created_date = created_at.date()
                
                if created_date == today:
                    today_citations.append(citation_data)
            except:
                pass
    
    # Count by engine
    engine_counts = {}
    for citation in today_citations:
        engine = citation.get('engine', 'unknown')
        engine_counts[engine] = engine_counts.get(engine, 0) + 1
    
    print(f'Today\'s API calls: {len(today_citations)}')
    print('By engine:')
    for engine, count in engine_counts.items():
        print(f'  {engine}: {count}')
    
    # Calculate costs using configuration
    costs = {}
    for engine in ['chatgpt', 'perplexity', 'google_ai']:
        count = engine_counts.get(engine, 0)
        if engine == 'perplexity':
            cost_per_request = api_config.get_model_config(engine).get('cost_per_request', 0.002)
            costs[engine] = count * cost_per_request
        else:
            # Estimate based on average tokens
            avg_tokens = api_config.get_model_config(engine).get('max_tokens', 500)
            cost_per_1k = api_config.get_model_config(engine).get('cost_per_1k_tokens', 0.001)
            costs[engine] = count * (avg_tokens / 1000) * cost_per_1k
    
    total_cost = sum(costs.values())
    
    print()
    print('Estimated costs today:')
    for engine, cost in costs.items():
        if cost > 0:
            print(f'  {engine}: ${cost:.3f}')
    print(f'  Total: ${total_cost:.3f}')
    
    # Alert if costs are high (using configuration)
    cost_config = api_config.get_cost_control_config()
    alert_threshold = cost_config.get('daily_cost_limit', 2.0)
    
    if total_cost > alert_threshold:
        print()
        print(f'🚨 WARNING: Daily costs exceed ${alert_threshold:.2f}!')
        print('Consider reducing query frequency or disabling automatic runs.')
    elif total_cost > alert_threshold * 0.5:
        print()
        print(f'⚠️  NOTICE: Daily costs are at ${total_cost:.2f} (50% of limit)')
        print('Monitor usage to avoid exceeding daily limit.')
    
    return total_cost

if __name__ == "__main__":
    monitor_daily_costs()
