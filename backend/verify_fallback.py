import sys
import os
import json
from src.services.diagram.diagram import generate_mermaid_from_toon

# Add project root to path
sys.path.append(os.getcwd())

def test_fallback_generation():
    summary_data = {
        "name": "TestProject",
        "features": [
            {"name": "Login"},
            {"name": "Dashboard"},
            {"name": "Settings"}
        ],
        "tech_stack": ["React", "Python"]
    }
    
    print("Testing fallback diagram generation...")
    try:
        diagram_code = generate_mermaid_from_toon(summary_data)
        print("\nGenerated Mermaid Code:")
        print(diagram_code)
        
        if "Checker" in diagram_code:
            print("\nSUCCESS: 'Checker' node found in diagram.")
        else:
            print("\nFAILURE: 'Checker' node NOT found in diagram.")
            
        if "flowchart TD" in diagram_code:
             print("SUCCESS: Valid flowchart syntax detected.")
        else:
             print("FAILURE: Invalid flowchart syntax.")

    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_fallback_generation()
