import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from src.ui.controller import ProductConversationManager

def mock_user_input(question):
    print(f"Mock User Input requested for: {question}")
    return "This is a mock response."

def mock_clarifier_callback(question):
    print(f"Mock Clarifier Callback: {question}")
    return "This is a mock response."

def mock_progress_callback(message):
    print(f"Progress: {message}")

def main():
    print("Initializing ProductConversationManager...")
    manager = ProductConversationManager(
        text_input="Create a fitness app",
        image_input=None,
        audio_input=None
    )
    
    print("Running full workflow...")
    try:
        result = manager.run_full_workflow(
            user_input_callback=mock_user_input,
            clarifier_callback=mock_clarifier_callback,
            generate_audio=False,
            progress_callback=mock_progress_callback
        )
        print("Workflow finished.")
        print(result)
    except Exception as e:
        print(f"Workflow failed with error: {e}")

if __name__ == "__main__":
    main()
