from dotenv import load_dotenv
import os
from openai import OpenAI

# load variables from .env file into environment
load_dotenv()

print("Environment variables loaded successfully.")

# access the value
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE", "https://openrouter.ai/api/v1")

if not OPENAI_API_KEY:
    print("ERROR: OPENAI_API_KEY not found in environment variables!")
    exit(1)

client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)

response = client.chat.completions.create(
    model="openai/gpt-oss-20b:free",
    messages=[{"role": "user", "content": "What is the latest news on OpenRouter?"}],
    # OpenRouter specific: use 'extra_body' to pass the plugins parameter
    extra_body={
        "plugins": [
            {
                "id": "web",
                "max_results": 5,  # Optional: default is 5
            }
        ]
    }
)

print(response.choices[0].message.content)