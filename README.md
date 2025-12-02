# Multi Agents App

Multi Agents App is an intelligent platform that orchestrates a workflow of specialized AI agents to transform raw ideas into comprehensive product specifications.

## Description

This project is designed to streamline the early stages of product development by simulating a cross-functional team of experts. Instead of spending weeks on brainstorming, requirements gathering, and risk assessment, users can input a simple idea and receive a holistic analysis. The application uses a chain of Large Language Models (LLMs) to act as a Product Manager, Customer Researcher, Lead Engineer, and Risk Analyst, collaborating to produce a detailed and actionable project blueprint.

## How It Works

The application leverages a chain of autonomous agents, each with a specific role:

1. **Classifier Agent**: Analyzes the input to determine the nature of the request.
2. **Clarifier Agent**: Engages with the user to refine and expand on the initial concept.
3. **Product Agent**: Generates detailed product requirements, features, and specifications.
4. **Customer Agent**: Analyzes target demographics and user personas.
5. **Engineer Agent**: Proposes technical architecture and implementation details.
6. **Risk Agent**: Identifies potential pitfalls, security risks, and mitigation strategies.
7. **Summarizer Agent**: Consolidates all generated insights into a cohesive final report.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: FastAPI, LangChain
- **Infrastructure**: Docker, Nginx

## Getting Started

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd HackWave2.0
    ```

2. **Configure Environment**:
    - Copy the example environment file:

      ```bash
      cp backend/.env.example backend/.env
      ```

    - Edit `backend/.env` with your API keys.

3. **Run the Application**:

    ```bash
    docker-compose up --build
    ```

4. **Access**:
    - Web Interface: [http://localhost](http://localhost)
    - API Docs: [http://localhost/api/docs](http://localhost/api/docs)
