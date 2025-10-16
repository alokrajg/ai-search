"""
Setup script for GEO Search Backend
"""

import os
import sys
import subprocess
import asyncio
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def setup_environment():
    """Set up environment file."""
    env_file = Path(".env")
    env_example = Path("env.example")
    
    if not env_file.exists() and env_example.exists():
        print("🔄 Creating .env file from template...")
        with open(env_example, 'r') as src, open(env_file, 'w') as dst:
            dst.write(src.read())
        print("✅ .env file created")
        print("⚠️  Please edit .env file with your configuration")
        return True
    elif env_file.exists():
        print("✅ .env file already exists")
        return True
    else:
        print("❌ env.example file not found")
        return False

def install_dependencies():
    """Install Python dependencies."""
    return run_command("pip install -r requirements.txt", "Installing dependencies")

def check_environment_variables():
    """Check if required environment variables are set."""
    required_vars = ["PERPLEXITY_API_KEY", "GOOGLE_CLOUD_PROJECT"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Missing required environment variables: {', '.join(missing_vars)}")
        print("Please set these in your .env file")
        return False
    
    print("✅ All required environment variables are set")
    return True

async def initialize_database():
    """Initialize Firestore with sample data."""
    try:
        print("🔄 Initializing Firestore database...")
        
        # Import and run the initialization script
        sys.path.append(str(Path(__file__).parent))
        from scripts.init_firestore import init_sample_data
        
        await init_sample_data()
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

def main():
    """Main setup function."""
    print("🚀 Setting up GEO Search Backend...")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Set up environment
    if not setup_environment():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        sys.exit(1)
    
    # Check environment variables
    if not check_environment_variables():
        print("\n⚠️  Please configure your .env file and run setup again")
        print("Required variables:")
        print("- PERPLEXITY_API_KEY: Your Perplexity API key")
        print("- GOOGLE_CLOUD_PROJECT: Your Google Cloud project ID")
        sys.exit(1)
    
    # Initialize database
    try:
        asyncio.run(initialize_database())
    except Exception as e:
        print(f"⚠️  Database initialization skipped: {e}")
        print("You can run it manually later with: python scripts/init_firestore.py")
    
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Start the server: python main.py")
    print("2. Visit API docs: http://localhost:8000/docs")
    print("3. Test the API: http://localhost:8000/health")
    print("\nFor more information, see README.md")

if __name__ == "__main__":
    main()
