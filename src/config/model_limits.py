from typing import Dict, Any

# Default limits for agents
AGENT_LIMITS: Dict[str, Any] = {
    "clarifier": {
        "max_questions": 5,
        "max_tokens": 1000
    },
    "product": {
        "max_features": 5,
        "max_tokens": 1500
    },
    "customer": {
        "max_results": 5,
        "max_tokens": 2000,
        "min_features": 3
    },
    "engineer": {
        "max_tokens": 2000
    },
    "risk": {
        "max_tokens": 2000
    },
    "summarizer": {
        "max_tokens": 1000
    }
}

# Global toggle for token limits
ENABLE_TOKEN_LIMITS = True

def get_agent_limit(agent_name: str, limit_name: str, default_value: Any = None) -> Any:
    """Get a specific limit for an agent."""
    # If token limits are disabled, return None for max_tokens
    if limit_name == "max_tokens" and not ENABLE_TOKEN_LIMITS:
        return None
        
    agent_config = AGENT_LIMITS.get(agent_name.lower(), {})
    return agent_config.get(limit_name, default_value)
