import os
import json
import re
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

from src.utils import toon
from src.config.model_limits import get_agent_limit
from src.config.model_config import get_model
from src.utils.api_search import search as api_search

# --- Memory ---
memory = MemorySaver()

# --- Tools ---
def search_tool(query: str):
    """Search the web for information."""
    return api_search(query)

# --- Factory Function ---
def get_customer_agent(model):
    # Get limits
    max_results = get_agent_limit("customer", "max_results", 5)
    min_features = get_agent_limit("customer", "min_features", 3)
    max_tokens = get_agent_limit("customer", "max_tokens", 2000)
    
    if max_tokens:
        model = model.bind(max_tokens=max_tokens)
    
    market_analyst_prompt = f"""
You are Customer, a market research expert.
Your goal is to validate product ideas against current market trends and competitor data.

You have access to a web search tool. Use it to find real-world data.
For the given product idea and features, you must:
1. Search for similar existing apps
2. Analyze their features and pricing
3. Identify market gaps
4. Assess the target audience

Your response must be in TOON (Token-Oriented Object Notation) format:

```toon
market_analysis:
  target_audience: Who is this for?
  competitors:
    name, pros, cons, pricing
    Comp 1, Good UI, Expensive, $10/mo
  market_gaps:
    - Gap 1
    - Gap 2
  verdict:
    viability_score: 0.8
    reasoning: Good potential because...
```

Important:
- Respond with ONLY the TOON data
- Use the exact format shown above
- Include at least {min_features} competitors if possible
- Be specific with data found from search
"""
    
    return create_react_agent(
        model=model,
        tools=[search_tool],
        prompt=market_analyst_prompt,
        checkpointer=memory,
        name="Customer"
    )

# --- Customer Function ---
def customer(query: str, model=None) -> str:
    """
    Customer agent function that performs market research.
    """
    print(f"Customer Agent: Analyzing '{query}'...")
    
    # Initialize model if not provided
    if model is None:
        model = get_model(agent_type="customer")
        
    # Create the agent runner
    agent = get_customer_agent(model)
    
    # Run the agent
    try:
        result = agent.invoke(
            {"messages": [HumanMessage(content=query)]},
            {"configurable": {"thread_id": "customer_research"}}
        )
        
        output_text = result["messages"][-1].content
        usage_metadata = result["messages"][-1].response_metadata.get("token_usage") if hasattr(result["messages"][-1], "response_metadata") else None
        
        from src.utils.token_tracker import token_tracker
        if usage_metadata:
            token_tracker.track_usage(usage_metadata)
            
        # Parse TOON
        try:
            parsed = toon.parse_response(output_text)
            if not parsed:
                 # Fallback to JSON if TOON fails (just in case)
                parsed = json.loads(output_text)
            return json.dumps(parsed, indent=2)
        except Exception as e:
            print(f"Parsing error: {e}")
            # Return raw text if parsing fails, but wrapped in a structure
            return json.dumps({"error": "Failed to parse TOON", "raw_output": output_text})

    except Exception as e:
        raise ValueError(f"Customer agent failed: {e}")

# --- Run ---
if __name__ == "__main__":
    from src.config.env import OPENAI_API_KEY
    if not OPENAI_API_KEY:
        print("❌ Error: OPENAI_API_KEY not found. Please create an '.env' file with your API key.")
    else:
        print("\n--- Final Market Analysis Report ---")
        print(customer("AI-powered fitness apps"))
