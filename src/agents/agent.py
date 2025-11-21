from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from src.config.model_config import get_model

# --- Create memory ---
memory = MemorySaver()

from src.config.model_limits import get_agent_limit

# --- Create agents ---
def get_clarifier_agent(model, max_questions=None):
    if max_questions is None:
        max_questions = get_agent_limit("clarifier", "max_questions", 5)
    
    max_tokens = get_agent_limit("clarifier", "max_tokens", 1000)
    if max_tokens:
        model = model.bind(max_tokens=max_tokens)
        
    return create_react_agent(
        model=model,
        tools=[],
        prompt=f"""
You are Clarifier, an expert in gathering product requirements.
Your task is to ask focused questions about product features and business logic.

For each question, you have two options:
1. If you can reasonably infer the answer yourself, provide it in the "answer" field.
2. If you need specific input from the user, leave the "answer" field empty.

IMPORTANT: Only leave the answer empty for 3-5 critical questions that absolutely require user input.
For all other questions, provide reasonable answers yourself.
Limit the total number of questions to a maximum of {max_questions}.

Your response must be in TOON (Token-Oriented Object Notation) format:

```toon
done: false
resp:
  question, answer
  What is the primary purpose?, The primary purpose is to help users track fitness.
```

OR when needing user input:

```toon
done: false
resp:
  question, answer
  What specific metrics to track?, 
```

Important:
- Respond with ONLY the TOON data, no other text
- Use the exact format shown above
- Each round, add at least one new question if needed
- After gathering enough information or reaching {max_questions} questions, set "done" to true
- Only leave answers empty for 3-5 critical questions that require user input
""",
        checkpointer=memory,
        name="Clarifier",
    )

def get_product_agent(model, max_features=None):
    if max_features is None:
        max_features = get_agent_limit("product", "max_features", 5)
    
    max_tokens = get_agent_limit("product", "max_tokens", 1500)
    if max_tokens:
        model = model.bind(max_tokens=max_tokens)
        
    return create_react_agent(
        model=model,
        tools=[],
        prompt=f"""
You are Product, responsible for confirming requirements and providing feature details.
Based on the conversation history, generate a product description with at least {max_features} features.

Your response must be in TOON format:

```toon
name: App Name
description: A brief description of the app
features:
  name, reason, goal_oriented, development_time, cost_estimate
  Feature 1, Why needed, 0.8, 2 weeks, 5000.0
```

Important:
- Respond with ONLY the TOON data
- Include at least {max_features} features
- Follow the exact indentation and CSV-like structure for lists
""",
        checkpointer=memory,
        name="Product"
    )

# Backward compatibility (uses default model)
try:
    from src.config.model_config import default_model
    if default_model:
        clarifier = get_clarifier_agent(default_model)
        product = get_product_agent(default_model)
    else:
        clarifier = None
        product = None
except Exception:
    clarifier = None
    product = None
