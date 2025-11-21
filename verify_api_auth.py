import requests
import time
import sys

BASE_URL = "http://localhost:8000"

def test_auth_flow():
    print("Testing Auth Flow...")
    
    # 1. Signup
    print("\n1. Signup 'testuser'")
    signup_data = {"username": "testuser", "password": "password123"}
    try:
        resp = requests.post(f"{BASE_URL}/signup", json=signup_data)
        if resp.status_code == 200:
            print("Signup successful")
        elif resp.status_code == 400 and "already registered" in resp.text:
            print("User already registered (expected if re-running)")
        else:
            print(f"Signup failed: {resp.status_code} {resp.text}")
            return
    except Exception as e:
        print(f"Failed to connect to API: {e}")
        return

    # 2. Login
    print("\n2. Login 'testuser'")
    login_data = {"username": "testuser", "password": "password123"}
    resp = requests.post(f"{BASE_URL}/token", data=login_data)
    if resp.status_code != 200:
        print(f"Login failed: {resp.status_code} {resp.text}")
        return
    
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful, token received")

    # 3. Start Conversation (Groq)
    print("\n3. Start Conversation (Groq)")
    start_data = {
        "text_input": "Create a simple todo app",
        "model_provider": "groq"
    }
    resp = requests.post(f"{BASE_URL}/start_conversation", json=start_data, headers=headers)
    if resp.status_code != 200:
        print(f"Start conversation failed: {resp.status_code} {resp.text}")
        return
    
    thread_id = resp.json()["thread_id"]
    print(f"Conversation started, thread_id: {thread_id}")

    # 4. Get State
    print("\n4. Get State")
    resp = requests.get(f"{BASE_URL}/get_state/{thread_id}", headers=headers)
    if resp.status_code != 200:
        print(f"Get state failed: {resp.status_code} {resp.text}")
        return
    print("Get state successful")

    # 5. Signup User 2
    print("\n5. Signup 'testuser2'")
    signup_data2 = {"username": "testuser2", "password": "password123"}
    requests.post(f"{BASE_URL}/signup", json=signup_data2) # Ignore if exists

    # 6. Login User 2
    print("\n6. Login 'testuser2'")
    login_data2 = {"username": "testuser2", "password": "password123"}
    resp = requests.post(f"{BASE_URL}/token", data=login_data2)
    token2 = resp.json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # 7. Access User 1's conversation with User 2's token
    print("\n7. Access User 1's conversation with User 2's token")
    resp = requests.get(f"{BASE_URL}/get_state/{thread_id}", headers=headers2)
    if resp.status_code == 403:
        print("Access denied as expected (403)")
    else:
        print(f"Unexpected status code: {resp.status_code} {resp.text}")

    # 8. Start Conversation (OpenAI) for User 2
    print("\n8. Start Conversation (OpenAI) for User 2")
    # Note: This might fail if OPENAI_API_KEY is not set, but we check if it tries.
    # We expect it to at least accept the request.
    start_data2 = {
        "text_input": "Create a simple chat app",
        "model_provider": "openai"
    }
    resp = requests.post(f"{BASE_URL}/start_conversation", json=start_data2, headers=headers2)
    if resp.status_code == 200:
        print("Start conversation (OpenAI) successful")
    else:
        print(f"Start conversation (OpenAI) failed (might be expected if key missing): {resp.status_code} {resp.text}")

    print("\nVerification Complete!")

if __name__ == "__main__":
    try:
        test_auth_flow()
    except ImportError:
        print("Requests library not found. Please install it.")
