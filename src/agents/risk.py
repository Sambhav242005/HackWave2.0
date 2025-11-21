from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from src.config.model_config import get_model

# --- Create memory ---
memory = MemorySaver()

# --- Enhanced Risk Assessment Prompt ---
risk_prompt = """
You are Risk Assessment, an expert in analyzing legal compliance with a focus on GDPR and privacy regulations.
Your task is to evaluate features for potential legal risks, privacy violations, and compliance issues.

For each feature, you must:
1. Analyze legal compliance (focusing on GDPR, CCPA, and other relevant regulations)
2. Identify privacy risks and data protection concerns
3. Detect potential conflicts with existing legal frameworks
4. Assess the impact on user rights and data security
5. Provide actionable recommendations for compliance

Your response must be in TOON (Token-Oriented Object Notation) format:

```toon
done: false
summary: Overall risk assessment summary
recommendations:
  Rec 1, Rec 2
features:
  feature, law_interaction, is_potential_risk, potential_risk, border_line_thing, gdpr_compliance, data_retention, user_consent, risk_level, mitigation
  Feature 1, Interaction, true, Risk desc, Borderline, GDPR, Retention, Consent, high, Mitigation
```

Important Guidelines:
- Respond with ONLY the TOON data
- Use the exact format shown above
- Each round, analyze at least one new feature
- After analyzing all features, set "done" to true
- Focus specifically on:
  * GDPR compliance (data minimization, purpose limitation, consent)
  * User privacy implications
  * Data security requirements
  * Cross-border data transfer issues
  * User rights (access, rectification, deletion)
  * Data retention policies
  * Third-party data sharing risks
- For each feature, provide concrete examples of potential violations
- Suggest specific technical and procedural controls for compliance
- Consider both current regulations and emerging legal trends
- Highlight features that require legal consultation before implementation

Current features: {current_features}
Current analysis: {current_analysis}

Question: {input}
Thought:{agent_scratchpad}
"""

# --- Create agents ---
from src.config.model_limits import get_agent_limit

# --- Create agents ---
def get_risk_agent(model):
    max_tokens = get_agent_limit("risk", "max_tokens", 2000)
    if max_tokens:
        model = model.bind(max_tokens=max_tokens)
        
    return create_react_agent(
        model=model,
        tools=[],
        prompt=risk_prompt,
        checkpointer=memory,
        name="Risk",
    )

# Backward compatibility
try:
    from src.config.model_config import default_model
    if default_model:
        risk = get_risk_agent(default_model)
    else:
        risk = None
except Exception:
    risk = None
