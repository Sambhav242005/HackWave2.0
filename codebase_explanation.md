# Codebase Explanation

This document explains the purpose of each file in the HackWave2.0 project, organized by the modular folder structure.

## Root Directory

- **`run.py`**: Entry point script to launch either the API or the UI. Usage: `python run.py [api|ui]`.
- **`verify_openai.py`**: Verification script to test OpenAI integration and model configuration.
- **`.env.example`**: Template for environment variables including API keys and model configuration.

## Source Directory (`src/`)

### `src/config/`

Configuration and environment management.

- **`env.py`**: Loads environment variables from `.env` file including:
  - API keys (`OPENAI_API_KEY`, `OPENAI_API_BASE`)
  - Model configuration (`USE_SINGLE_MODEL`, `DEFAULT_MODEL`)
  - Per-agent model settings (when `USE_SINGLE_MODEL=false`)
  
- **`model_config.py`**: Centralized LLM configuration using OpenAI-compatible APIs (OpenRouter, Azure, etc.):
  - `get_model()` - Creates model instances with optional `agent_type` parameter
  - Supports single model for all agents or different models per agent
  - Automatic fallback to `DEFAULT_MODEL`

### `src/models/`

Data models and schemas.

- **`agentComp.py`**: Pydantic models for agent requests and responses, ensuring type safety.

### `src/agents/`

AI agents for different workflow stages.

- **`agent.py`**: Defines `Clarifier` and `Product` agents using LangGraph:
  - **Clarifier**: Gathers product requirements through interactive questions
  - **Product**: Generates product specifications with features
  
- **`engineer.py`**: **Engineer** agent for technical feasibility analysis and implementation planning.

- **`risk.py`**: **Risk** agent for legal compliance and privacy risk assessment (GDPR, CCPA, etc.).

- **`customer.py`**: **Customer** (MarketAnalyst) agent for market research:
  - Uses DuckDuckGo search for online research
  - Generates market analysis reports with customer insights
  
- **`summarizer.py`**: **Summarizer** agent to aggregate insights from all agents into final report.

### `src/services/`

Specialized services for diagram and audio generation.

- **`diagram/`**:
  - **`diagramAgent.py`**: Agent for generating Mermaid diagrams from product data
  - **`diagram.py`**: Diagram generation utilities and helpers
  
- **`tts/`** (Text-to-Speech):
  - **`tts.py`**: TTS core functionality with rate limiting and chunking
  - **`tts_summarize.py`**: Converts summaries to speech-optimized text
  - **`tts_api.py`**: API endpoints for TTS services

### `src/utils/`

Utility modules and helpers.

- **`toon.py`**: Parser for Token-Oriented Object Notation (TOON) - custom format for agent responses.

- **`helper.py`**: General helper functions for input/output processing.

- **`prompt.py`**: Multi-modal prompt generation:
  - Image analysis using OpenAI vision models
  - Audio transcription using OpenAI Whisper
  - Text processing for requirement extraction
  
- **`tools.py`**: Miscellaneous utility tools.

- **`discuss.py`**: Discussion and conversation logic.

### `src/api/`

REST API implementation.

- **`api.py`**: FastAPI application that orchestrates the complete agent workflow:
  - Manages conversation state and thread IDs
  - Coordinates agents: Clarifier → Product → Customer → Engineer → Risk → Summarizer
  - Generates diagrams and audio summaries
  - Provides endpoints for each workflow stage

### `src/ui/`

Desktop GUI application.

- **`app.py`**: PyQt5-based desktop GUI with:
  - Interactive chat interface
  - Multi-modal input support (text, image, audio)
  - Progress tracking and real-time updates
  
- **`controller.py`**: Business logic controller managing the agent workflow:
  - Orchestrates all agents in sequence
  - Handles model initialization with per-agent configuration
  - Manages TTS conversion and audio playback
  - Provides progress callbacks for UI updates

## Key Workflows

### 1. Model Configuration

The system supports two modes:

**Single Model Mode** (Default):

```env
USE_SINGLE_MODEL=true
DEFAULT_MODEL=z-ai/glm-4.5-air:free
```

**Per-Agent Mode**:

```env
USE_SINGLE_MODEL=false
CLARIFIER_MODEL=google/gemini-2.0-flash-exp:free
PRODUCT_MODEL=meta-llama/llama-3.3-70b-instruct
# ... etc
```

### 2. Agent Workflow

1. **Clarifier** - Gathers requirements
2. **Product** - Creates specifications
3. **Customer** - Market analysis
4. **Engineer** - Technical feasibility
5. **Risk** - Compliance assessment
6. **Summarizer** - Final report
7. **Diagram** - Visual representation
8. **TTS** - Audio summary (optional)

### 3. API Providers

- **Primary**: OpenAI-compatible APIs (OpenRouter, Azure OpenAI, etc.)
- **Base URL**: Configurable via `OPENAI_API_BASE`
- **Models**: Supports any OpenAI-compatible model names

## Tests & Utilities

- **`dummy-api.py`**: Mock API implementation for testing
- **`test_toon.py`**: Tests for TOON parser
- **`verify_openai.py`**: OpenAI integration verification

## Environment Setup

Create a `.env` file based on `.env.example`:

```env
# Required
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://openrouter.ai/api/v1

# Model Configuration (see model_config_guide.md)
USE_SINGLE_MODEL=true
DEFAULT_MODEL=z-ai/glm-4.5-air:free
```

For detailed model configuration options, see the `model_config_guide.md` artifact.
