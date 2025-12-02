# Codebase Explanation

This document explains the purpose of each file in the HackWave2.0 project, organized by the modular folder structure.

## Root Directory

- **`run.py`**: Entry point script to launch either the API or the UI. Usage: `python run.py [api|ui]`.
- **`frontend/`**: Next.js web application providing a modern UI for the multi-agent system (cloned from [multi-agent-app](https://github.com/Sambhav242005/multi-agent-app)).
- **`users.db`**: SQLite database for user authentication and session management.
- **`podcast.mp3`**: Sample audio output from the TTS system.
- **`.env`**: Environment configuration file (not committed to version control).
- **`.env.example`**: Template for environment variables including API keys and model configuration.
- **`.gitignore`**: Git ignore rules for the repository.
- **`codebase_explanation.md`**: This file - comprehensive documentation of the project structure.

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

- **`model_limits.py`**: Centralized configuration for model output limits (max questions, features, tokens, etc.)

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
  - Uses OpenRouter web search for online research (replacing DuckDuckGo)
  - Generates market analysis reports with customer insights
  
- **`summarizer.py`**: **Summarizer** agent to aggregate insights from all agents into final report.

### `src/services/`

Specialized services for diagram and audio generation.

- **`diagram/`**:
  - **`diagramAgent.py`**: Agent for generating Mermaid diagrams from product data
  - **`diagram.py`**: Diagram generation utilities with multiple fallback approaches
  
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
  - User authentication and session management
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

## Frontend (`frontend/`)

Next.js web application providing a modern, responsive UI for the multi-agent system. This is a separate application that communicates with the backend API.

Key features:

- Modern React-based UI
- Real-time interaction with agents
- Multi-modal input support
- Responsive design for multiple devices

See the `frontend/README.md` for setup and development instructions.

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
CUSTOMER_MODEL=google/gemini-2.0-flash-exp:free
ENGINEER_MODEL=meta-llama/llama-3.3-70b-instruct
RISK_MODEL=meta-llama/llama-3.3-70b-instruct
SUMMARIZER_MODEL=google/gemini-2.0-flash-exp:free
DIAGRAM_MODEL=google/gemini-2.0-flash-exp:free
```

### 2. Agent Workflow

1. **Clarifier** - Gathers requirements through interactive questions
2. **Product** - Creates detailed product specifications
3. **Customer** - Performs market analysis using web search
4. **Engineer** - Analyzes technical feasibility
5. **Risk** - Assesses legal and compliance risks
6. **Summarizer** - Aggregates all insights into final report
7. **Diagram** - Generates visual Mermaid diagram
8. **TTS** - Creates audio summary (optional)

### 3. API Providers

- **Primary**: OpenAI-compatible APIs (OpenRouter, Azure OpenAI, etc.)
- **Base URL**: Configurable via `OPENAI_API_BASE`
- **Models**: Supports any OpenAI-compatible model names
- **Search**: Uses OpenRouter's web plugin for market research

## Environment Setup

Create a `.env` file based on `.env.example`:

```env
# Required API Keys
OPENAI_API_KEY=your_openrouter_api_key_here
OPENAI_API_BASE=https://openrouter.ai/api/v1

# Model Configuration
USE_SINGLE_MODEL=true
DEFAULT_MODEL=z-ai/glm-4.5-air:free

# Optional: Per-Agent Configuration
# CLARIFIER_MODEL=google/gemini-2.0-flash-exp:free
# PRODUCT_MODEL=meta-llama/llama-3.3-70b-instruct
# etc...
```

## Running the Application

### Backend API

```bash
python run.py api
```

### Desktop UI (PyQt5)

```bash
python run.py ui
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

## Architecture

The project follows a modular architecture:

- **Agents**: Independent AI agents with specific roles
- **Services**: Reusable services (diagram generation, TTS)
- **API**: RESTful API for external integration
- **UI**: Multiple frontend options (PyQt5 desktop, Next.js web)
- **Config**: Centralized configuration management

All agents use the TOON (Token-Oriented Object Notation) format for structured outputs, making the system extensible and maintainable.
