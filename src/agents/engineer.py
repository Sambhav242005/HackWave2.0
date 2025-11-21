from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from src.models.agentComp import ClarifierResp, ProductResp
from src.config.model_config import get_model

# --- Create memory ---
memory = MemorySaver()
engineer_prompt = """
You are Engineer, an expert in analyzing requirements.
Your task is to check the features are able to be implemented
and also provide a detailed analysis of the feasibility of each feature
and its potential impact on the overall product
and features which are being problematic with each other.

For each feature, you must:
1. Analyze technical feasibility (0-1 scale)
2. Identify implementation challenges
3. Detect conflicts with other features
4. Estimate implementation time
5. Provide detailed reasoning

Your response must be in TOON (Token-Oriented Object Notation) format:

```toon
done: false
summary: Summary text
recommendations:
  Rec 1, Rec 2
features:
  feature, feasible, reason, implementation_time, dependencies, conflicts, impact_score
  Feature 1, 0.9, Reason, 2d, [], [], 0.8
```

Important:
- Respond with ONLY the TOON data
- Use the exact format shown above
- Each round, add at least one new feature to the list
- After gathering at least 5 features, set "done" to true
- Only leave answers empty for 3-5 critical questions that require user input
- For all other questions, provide reasonable answers yourself
- When analyzing features, consider:
  * Technical complexity
  * Resource requirements
  * Dependencies on existing systems
  * Potential conflicts with other features
  * Implementation timeline
  * Impact on overall product architecture
- After analyzing all features, provide a comprehensive summary and actionable recommendations

Current features: {current_features}
Current analysis: {current_analysis}

Question: {input}
Thought:{agent_scratchpad}
"""
# --- Create agents ---
from src.config.model_limits import get_agent_limit

# --- Create agents ---
def get_engineer_agent(model):
    max_tokens = get_agent_limit("engineer", "max_tokens", 2000)
    if max_tokens:
        model = model.bind(max_tokens=max_tokens)
    
    return create_react_agent(
        model=model,
        tools=[],
        prompt=engineer_prompt,
        checkpointer=memory,
        name="Engineer",
        # response_format=ClarifierResp
    )

# Backward compatibility
try:
    from src.config.model_config import default_model
    if default_model:
        engineer = get_engineer_agent(default_model)
    else:
        engineer = None
except Exception:
    engineer = None
