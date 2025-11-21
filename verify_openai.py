"""
Simple verification script to test OpenAI integration.
"""
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.config.env import OPENAI_API_KEY, OPENAI_API_BASE
from src.config.model_config import get_model

def verify_openai_setup():
    """Verify OpenAI configuration and basic functionality."""
    print("=" * 60)
    print("OpenAI Integration Verification")
    print("=" * 60)
    
    # Check API key
    if not OPENAI_API_KEY:
        print("❌ OPENAI_API_KEY not found in environment variables.")
        print("   Please add OPENAI_API_KEY to your .env file.")
        return False
    else:
        print(f"✅ OPENAI_API_KEY found: {OPENAI_API_KEY[:8]}...")
    
    # Check base URL
    if OPENAI_API_BASE:
        print(f"✅ Custom OPENAI_API_BASE configured: {OPENAI_API_BASE}")
    else:
        print("ℹ️  Using default OpenAI base URL")
    
    print("\n" + "-" * 60)
    print("Testing model initialization...")
    print("-" * 60)
    
    try:
        # Test get_model
        model = get_model()
        print(f"✅ Default model created successfully")
        print(f"   Model: {model.model_name}")
        
        # Test with custom parameters
        custom_model = get_model(temperature=0.5, model_name="gpt-4o-mini")
        print(f"✅ Custom model created successfully")
        print(f"   Model: {custom_model.model_name}")
        print(f"   Temperature: {custom_model.temperature}")
        
    except Exception as e:
        print(f"❌ Error creating model: {e}")
        return False
    
    print("\n" + "-" * 60)
    print("Testing basic chat completion...")
    print("-" * 60)
    
    try:
        response = model.invoke("Say 'Hello from OpenAI!' in exactly those words.")
        print(f"✅ Chat completion successful")
        print(f"   Response: {response.content}")
    except Exception as e:
        print(f"❌ Error during chat completion: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("All tests passed! ✅")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = verify_openai_setup()
    sys.exit(0 if success else 1)
