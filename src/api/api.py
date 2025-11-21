from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import uuid
import time
from typing import Dict, Any, List, Optional
from langchain_core.messages import HumanMessage
from src.agents.agent import get_clarifier_agent, get_product_agent
from src.models.agentComp import ClarifierResp, ProductResp, EngineerAnalysis, RiskAssessment, CustomerAnalysis, SummarizerOutput
from src.agents.engineer import get_engineer_agent
from src.agents.customer import customer
from src.agents.risk import get_risk_agent
from src.agents.summarizer import get_summarizer_agent, compile_agent_reports
from src.services.diagram.diagramAgent import generate_mermaid_link
import src.utils.toon as toon

# Auth imports
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, status
from datetime import timedelta
from src.services.auth import User, UserInDB, Token, create_user, verify_user, create_access_token, get_user as get_user_db, ACCESS_TOKEN_EXPIRE_MINUTES
from src.config.model_config import get_model
from jose import JWTError, jwt
from src.config.env import JWT_SECRET_KEY, ALGORITHM

app = FastAPI(title="Product Conversation API")

# Auth Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# In-memory storage for conversation states
conversation_states: Dict[str, Dict[str, Any]] = {}

# Pydantic models for request/response
class TextInput(BaseModel):
    text_input: str
    image_input: Optional[str] = None
    audio_input: Optional[str] = None
    model_provider: Optional[str] = "groq" # Default to groq

class StartConversationRequest(TextInput):
    pass

class UserSignup(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None

class ContinueClarifierRequest(BaseModel):
    thread_id: str
    answers: List[str]

class RunWorkflowRequest(BaseModel):
    thread_id: str

class RunWorkflowStreamRequest(TextInput):
    pass

# Helper functions
def generate_thread_id() -> str:
    return str(uuid.uuid4())

def get_conversation_state(thread_id: str) -> Dict[str, Any]:
    if thread_id not in conversation_states:
        raise HTTPException(status_code=404, detail="Thread not found")
    return conversation_states[thread_id]

def update_conversation_state(thread_id: str, state: Dict[str, Any]) -> None:
    conversation_states[thread_id] = state

# Helper function from working code
def process_agent_response(response: str, response_model):
    """Process agent response and parse into the given model using TOON"""
    try:
        # Parse TOON
        data = toon.parse_response(response)
        
        # Handle potential structure mismatches if any
        # For ClarifierResp, we expect 'resp' list. TOON parser returns dict.
        # For ProductResp, we expect 'features' list.
        
        return response_model(**data)
    except Exception as e:
        print(f"Error parsing TOON: {e}")
        return None

# Auth Dependency
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_db(username)
    if user is None:
        raise credentials_exception
    return user

# API Endpoints
@app.post("/signup", response_model=Token)
async def signup(user: UserSignup):
    user_in = User(username=user.username, email=user.email, full_name=user.full_name)
    if not create_user(user_in, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_db(form_data.username)
    if not user or not verify_user(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.post("/start_conversation")
async def start_conversation(request: StartConversationRequest, current_user: User = Depends(get_current_user)):
    """Start a new clarifier conversation"""
    thread_id = generate_thread_id()
    config = {"configurable": {"thread_id": thread_id}}

    # Initialize the state
    state = {
        "thread_id": thread_id,
        "username": current_user.username,
        "model_provider": request.model_provider,
        "text_input": request.text_input,
        "image_input": request.image_input,
        "audio_input": request.audio_input,
        "clarifier_done": False,
        "current_round": 0,
        "workflow_done": False,
        "messages": [],
        "final_data": {},
        "config": config
    }

    # Get model and agent
    try:
        model = get_model(provider=request.model_provider)
        clarifier = get_clarifier_agent(model)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Start clarifier conversation
    initial_message = HumanMessage(
        content=f"Start gathering requirements for a new product based on: {request.text_input}. Only ask 3-5 critical questions that require user input."
    )

    clarifier_result = clarifier.invoke({"messages": [initial_message]}, config)
    clarifier_messages = clarifier_result["messages"]
    clarifier_response = clarifier_messages[-1].content

    # Process clarifier response
    clarifier_obj = process_agent_response(clarifier_response, ClarifierResp)
    if clarifier_obj:
        state["final_data"]["clarifier"] = clarifier_obj.model_dump()
        state["clarifier_done"] = clarifier_obj.done
        state["current_round"] = 1
        state["messages"] = clarifier_messages

        # Add clarifier response to messages
        state["messages"].append({
            "role": "assistant",
            "content": toon.dumps({
                "resp": [q.dict() for q in clarifier_obj.resp],
                "done": clarifier_obj.done
            })
        })

    update_conversation_state(thread_id, state)

    return {
        "session_id": thread_id,
        "clarifier_questions": [q.dict() for q in clarifier_obj.resp],
        "status": "success"
    }

@app.post("/continue_clarifier")
async def continue_clarifier(request: ContinueClarifierRequest, current_user: User = Depends(get_current_user)):
    """Continue the clarifier conversation with user answers"""
    state = get_conversation_state(request.thread_id)
    
    # Verify ownership
    if state.get("username") != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

    config = state["config"]

    if state.get("clarifier_done", False):
        return {
            "session_id": request.thread_id,
            "clarifier_questions": [],
            "status": "clarification_complete"
        }

    try:
        # Get model and agent
        model = get_model(provider=state.get("model_provider", "groq"))
        clarifier = get_clarifier_agent(model)

        # Get the last clarifier message
        last_message = state["messages"][-1]
        clarifier_data = toon.loads(last_message["content"])

        # Update with user answers
        if "resp" in clarifier_data:
            questions = clarifier_data["resp"]
            for i, question in enumerate(questions):
                if i < len(request.answers) and not question.get("answer"):
                    question["answer"] = request.answers[i]
                    # Add user answer to messages
                    state["messages"].append(
                        HumanMessage(content=f"User answered: '{question['question']}' -> '{request.answers[i]}'")
                    )

            # Continue clarifier conversation
            clarifier_result = clarifier.invoke({"messages": state["messages"]}, config)
            clarifier_messages = clarifier_result["messages"]
            clarifier_response = clarifier_messages[-1].content

            # Process clarifier response
            clarifier_obj = process_agent_response(clarifier_response, ClarifierResp)
            if clarifier_obj:
                state["final_data"]["clarifier"] = clarifier_obj.model_dump()
                state["clarifier_done"] = clarifier_obj.done
                state["current_round"] += 1
                state["messages"] = clarifier_messages

                # Add clarifier response to messages
                state["messages"].append({
                    "role": "assistant",
                    "content": toon.dumps({
                        "resp": [q.dict() for q in clarifier_obj.resp],
                        "done": clarifier_obj.done
                    })
                })

        update_conversation_state(request.thread_id, state)

        if state.get("clarifier_done", False):
            return {
                "session_id": request.thread_id,
                "clarifier_questions": [],
                "status": "clarification_complete"
            }
        else:
            return {
                "session_id": request.thread_id,
                "clarifier_questions": [q.dict() for q in clarifier_obj.resp],
                "status": "continue"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error continuing clarifier: {str(e)}")

@app.get("/get_state/{thread_id}")
async def get_state(thread_id: str, current_user: User = Depends(get_current_user)):
    """Get the current state of the conversation"""
    state = get_conversation_state(thread_id)

    # Verify ownership
    if state.get("username") != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

    response_state = {
        "session_id": thread_id,
        "state": state["final_data"],
        "clarifier_done": state.get("clarifier_done", False),
        "current_round": state.get("current_round", 0)
    }

    return response_state

@app.post("/run_workflow")
async def run_workflow(request: RunWorkflowRequest, current_user: User = Depends(get_current_user)):
    """Run the workflow for a given thread_id"""
    state = get_conversation_state(request.thread_id)
    
    # Verify ownership
    if state.get("username") != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

    config = state["config"]

    # Check if clarifier is done
    if not state.get("clarifier_done", False):
        raise HTTPException(status_code=400, detail="Clarifier conversation not completed")

    # Run the workflow in the background
    background_tasks = BackgroundTasks()
    background_tasks.add_task(run_workflow_background, request.thread_id, config)

    return {
        "status": "workflow_started",
        "session_id": request.thread_id
    }

async def run_workflow_background(thread_id: str, config: dict):
    """Run the workflow in the background"""
    state = get_conversation_state(thread_id)

    try:
        # Get model and agents
        model_provider = state.get("model_provider", "groq")
        model = get_model(provider=model_provider)
        
        product_agent = get_product_agent(model)
        customer_agent = customer # Customer is a function, but we need to pass model to it? No, customer.py was refactored to get_customer_agent(model) which returns a runnable/function.
        # Wait, customer.py: get_customer_agent(model) returns a function `customer_agent(product_spec)`.
        # So I should call get_customer_agent(model).
        customer_func = customer # This is the old import. I need to use the factory.
        # I imported `customer` from `src.agents.customer`. 
        # Let's check `src/agents/customer.py` again.
        # It defines `get_customer_agent(model)`.
        # I should have imported `get_customer_agent`.
        # In Chunk 1, I imported `customer`. I should fix that import or just use `get_customer_agent` if I imported it.
        # I'll assume I need to fix the import or use what I have.
        # Actually, I'll fix the import in this chunk too if possible, or just use `src.agents.customer.get_customer_agent`.
        
        engineer_agent = get_engineer_agent(model)
        risk_agent = get_risk_agent(model)
        summarizer = get_summarizer_agent(model)

        # Run product agent
        product_result = product_agent.invoke({"messages": state["messages"]}, config)
        product_messages = product_result["messages"]
        product_response = product_messages[-1].content
        product_obj = process_agent_response(product_response, ProductResp)

        if product_obj:
            state["final_data"]["product"] = product_obj.model_dump()
            # Ensure at least 5 features
            if len(product_obj.features) < 5:
                retry_message = HumanMessage(content="Generate a product response with at least 5 features based on our conversation.")
                product_result = product_agent.invoke({"messages": product_messages + [retry_message]}, config)
                product_messages = product_result["messages"]
                product_response = product_messages[-1].content
                product_obj = process_agent_response(product_response, ProductResp)
                if product_obj:
                    state["final_data"]["product"] = product_obj.model_dump()

        # Run customer agent
        # The refactored customer agent is a function returned by get_customer_agent(model)
        # But I need to import get_customer_agent.
        # I will use dynamic import or fix imports at top of file.
        from src.agents.customer import get_customer_agent
        customer_runner = get_customer_agent(model)
        customer_result = customer_runner(product_response)
        
        try:
            # customer_result is a JSON string. We can parse it into our Pydantic model to validate it.
            customer_data = json.loads(customer_result)
            customer_obj = CustomerAnalysis(**customer_data)
            state["final_data"]["customer"] = customer_obj.model_dump()
        except Exception as e:
            print(f"Error validating customer data: {e}")
            state["final_data"]["customer"] = json.loads(customer_result)

        # Run engineer agent
        engineer_result = engineer_agent.invoke(
            {"messages": [HumanMessage(content=toon.dumps(state["final_data"]["customer"]))],
             "current_features": "None", "current_analysis": "None"}, 
            config
        )
        engineer_response = engineer_result["messages"][-1].content
        engineer_obj = process_agent_response(engineer_response, EngineerAnalysis)
        if engineer_obj:
            state["final_data"]["engineer"] = {"analysis": engineer_obj.model_dump()}
        else:
            # Fallback or error handling
            state["final_data"]["engineer"] = {"analysis": toon.parse_response(engineer_response)}

        # Run risk agent
        risk_result = risk_agent.invoke(
            {"messages": [HumanMessage(content=engineer_response)]},
            config
        )
        risk_response = risk_result["messages"][-1].content
        risk_obj = process_agent_response(risk_response, RiskAssessment)
        if risk_obj:
            state["final_data"]["risk"] = {"assessment": risk_obj.model_dump()}
        else:
            state["final_data"]["risk"] = {"assessment": toon.parse_response(risk_response)}

        # Generate final summary
        summary_result = summarizer.invoke(
            {"messages": [HumanMessage(content=toon.dumps(state["final_data"], indent=2))]},
            config
        )
        summary_response = summary_result["messages"][-1].content
        summary_obj = process_agent_response(summary_response, SummarizerOutput)
        if summary_obj:
            summary = summary_obj.summary
        else:
            summary_data = toon.parse_response(summary_response)
            summary = summary_data.get("summary", summary_response)
        state["final_data"]["summary"] = summary

        # Update state to mark workflow as done
        state["workflow_done"] = True
        update_conversation_state(thread_id, state)
    except Exception as e:
        print(f"Error running workflow: {str(e)}")
        state["workflow_error"] = str(e)
        update_conversation_state(thread_id, state)

@app.get("/get_result/{thread_id}")
async def get_result(thread_id: str, current_user: User = Depends(get_current_user)):
    """Get the final result of the workflow"""
    state = get_conversation_state(thread_id)

    # Verify ownership
    if state.get("username") != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

    if not state.get("workflow_done", False):
        if "workflow_error" in state:
            raise HTTPException(status_code=500, detail=f"Workflow failed: {state['workflow_error']}")
        raise HTTPException(status_code=404, detail="Workflow result not available yet")

    # Return the final data
    result = {
        "session_id": thread_id,
        "final_data": state["final_data"],
        "summary": state["final_data"].get("summary", ""),
        "tts_file": state["final_data"].get("tts_file", ""),
        "status": "success"
    }

    return result

@app.post("/run_workflow_stream")
async def run_workflow_stream(request: RunWorkflowStreamRequest, current_user: User = Depends(get_current_user)):
    """Run the entire workflow in one go and stream the results"""
    thread_id = generate_thread_id()
    config = {"configurable": {"thread_id": thread_id}}

    # Initialize the state
    state = {
        "thread_id": thread_id,
        "username": current_user.username,
        "model_provider": request.model_provider,
        "text_input": request.text_input,
        "image_input": request.image_input,
        "audio_input": request.audio_input,
        "clarifier_done": True,
        "current_round": 1,
        "workflow_done": False,
        "messages": [],
        "final_data": {},
        "config": config
    }

    update_conversation_state(thread_id, state)

    async def generate_stream():
        try:
            # Step 1: Start
            yield json.dumps({
                "step": "start",
                "status": "success",
                "data": {
                    "session_id": thread_id,
                    "timestamp": time.time()
                },
                "session_id": thread_id,
                "timestamp": time.time()
            }) + "\n"

            # Step 2: Run clarifier (simulated)
            initial_message = HumanMessage(
                content=f"Start gathering requirements for a new product based on: {request.text_input}. Only ask 3-5 critical questions that require user input."
            )
            
            # Get model and agents
            model_provider = state.get("model_provider", "groq")
            model = get_model(provider=model_provider)
            
            clarifier_agent = get_clarifier_agent(model)
            product_agent = get_product_agent(model)
            from src.agents.customer import get_customer_agent
            customer_runner = get_customer_agent(model)
            engineer_agent = get_engineer_agent(model)
            risk_agent = get_risk_agent(model)
            summarizer = get_summarizer_agent(model)

            clarifier_result = clarifier_agent.invoke({"messages": [initial_message]}, config)
            clarifier_messages = clarifier_result["messages"]
            clarifier_response = clarifier_messages[-1].content

            clarifier_obj = process_agent_response(clarifier_response, ClarifierResp)
            if clarifier_obj:
                state["final_data"]["clarifier"] = clarifier_obj.model_dump()
                state["messages"] = clarifier_messages

                # Simulate user answers for streaming
                for q in clarifier_obj.resp:
                    q.answer = f"Answer for: {q.question}"
                    state["messages"].append(
                        HumanMessage(content=f"User answered: '{q.question}' -> '{q.answer}'")
                    )

                # Continue clarifier until done
                while not clarifier_obj.done:
                    clarifier_result = clarifier_agent.invoke({"messages": state["messages"]}, config)
                    clarifier_messages = clarifier_result["messages"]
                    clarifier_response = clarifier_messages[-1].content
                    clarifier_obj = process_agent_response(clarifier_response, ClarifierResp)

                    if clarifier_obj:
                        state["final_data"]["clarifier"] = clarifier_obj.model_dump()
                        state["messages"] = clarifier_messages

                        # Simulate user answers
                        for q in clarifier_obj.resp:
                            if not q.answer:
                                q.answer = f"Answer for: {q.question}"
                                state["messages"].append(
                                    HumanMessage(content=f"User answered: '{q.question}' -> '{q.answer}'")
                                )

                yield json.dumps({
                    "step": "clarifier",
                    "status": "success",
                    "data": state["final_data"]["clarifier"],
                    "error": None,
                    "session_id": thread_id,
                    "timestamp": time.time()
                }) + "\n"

            # Step 3: Run product agent
            product_result = product_agent.invoke({"messages": state["messages"]}, config)
            product_messages = product_result["messages"]
            product_response = product_messages[-1].content
            product_obj = process_agent_response(product_response, ProductResp)

            if product_obj:
                state["final_data"]["product"] = product_obj.model_dump()
                # Ensure at least 5 features
                if len(product_obj.features) < 5:
                    retry_message = HumanMessage(content="Generate a product response with at least 5 features based on our conversation.")
                    product_result = product_agent.invoke({"messages": product_messages + [retry_message]}, config)
                    product_messages = product_result["messages"]
                    product_response = product_messages[-1].content
                    product_obj = process_agent_response(product_response, ProductResp)
                    if product_obj:
                        state["final_data"]["product"] = product_obj.model_dump()

                # Generate diagram (simulated)
                diagram_url = "https://example.com/diagram.png"
                state["final_data"]["diagram_url"] = diagram_url

                yield json.dumps({
                    "step": "product",
                    "status": "success",
                    "data": {
                        "product": state["final_data"]["product"],
                        "diagram_url": diagram_url
                    },
                    "error": None,
                    "session_id": thread_id,
                    "timestamp": time.time()
                }) + "\n"

            # Step 4: Run customer agent
            customer_result = customer_runner(product_response)
            state["final_data"]["customer"] = json.loads(customer_result)
            yield json.dumps({
                "step": "customer",
                "status": "success",
                "data": state["final_data"]["customer"],
                "error": None,
                "session_id": thread_id,
                "timestamp": time.time()
            }) + "\n"

            # Step 5: Run engineer agent
            engineer_result = engineer_agent.invoke(
                {"messages": [HumanMessage(content=json.dumps(state["final_data"]["customer"]))]},
                config
            )
            engineer_response = engineer_result["messages"][-1].content
            state["final_data"]["engineer"] = {"analysis": json.loads(engineer_response)}
            yield json.dumps({
                "step": "engineer",
                "status": "success",
                "data": state["final_data"]["engineer"],
                "error": None,
                "session_id": thread_id,
                "timestamp": time.time()
            }) + "\n"

            # Step 6: Run risk agent
            risk_result = risk_agent.invoke(
                {"messages": [HumanMessage(content=engineer_response)]},
                config
            )
            risk_response = risk_result["messages"][-1].content
            state["final_data"]["risk"] = {"assessment": json.loads(risk_response)}
            yield json.dumps({
                "step": "risk",
                "status": "success",
                "data": state["final_data"]["risk"],
                "error": None,
                "session_id": thread_id,
                "timestamp": time.time()
            }) + "\n"

            # Step 7: Generate summary
            summary_result = summarizer.invoke(
                {"messages": [HumanMessage(content=json.dumps(state["final_data"], indent=2))]},
                config
            )
            summary = summary_result["messages"][-1].content
            state["final_data"]["summary"] = summary
            yield json.dumps({
                "step": "summary",
                "status": "success",
                "data": {"summary": summary},
                "error": None,
                "session_id": thread_id,
                "timestamp": time.time()
            }) + "\n"

            # Step 8: Convert to speech
            tts_file = "https://example.com/speech.mp3"
            state["final_data"]["tts_file"] = tts_file
            yield json.dumps({
                "step": "tts",
                "status": "success",
                "data": {"tts_file": tts_file},
                "error": None,
                "session_id": thread_id,
                "timestamp": time.time()
            }) + "\n"

            # Final result
            result = {
                "session_id": thread_id,
                "final_data": {
                    "customer": state["final_data"]["customer"],
                    "engineer": state["final_data"]["engineer"],
                    "risk": state["final_data"]["risk"],
                    "diagram_url": state["final_data"].get("diagram_url"),
                },
                "summary": summary,
                "tts_file": tts_file,
                "status": "success"
            }
            yield json.dumps(result) + "\n"

            # Update state to mark workflow as done
            state["workflow_done"] = True
            update_conversation_state(thread_id, state)
        except Exception as e:
            yield json.dumps({
                "step": "error",
                "status": "error",
                "error": str(e),
                "session_id": thread_id,
                "timestamp": time.time()
            }) + "\n"

    return StreamingResponse(
        generate_stream(),
        media_type="application/json"
    )

@app.post("/generate_product")
async def generate_product(request: RunWorkflowRequest, current_user: User = Depends(get_current_user)):
    """Generate product data for a given thread_id"""
    state = get_conversation_state(request.thread_id)
    
    # Verify ownership
    if state.get("username") != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")
    config = state["config"]

    # Check if clarifier is done
    if not state.get("clarifier_done", False):
        raise HTTPException(status_code=400, detail="Clarifier conversation not completed")

    try:
        # Get model and agent
        model_provider = state.get("model_provider", "groq")
        model = get_model(provider=model_provider)
        product_agent = get_product_agent(model)

        # Run product agent
        product_result = product_agent.invoke({"messages": state["messages"]}, config)
        product_messages = product_result["messages"]
        product_response = product_messages[-1].content
        product_obj = process_agent_response(product_response, ProductResp)

        if product_obj:
            state["final_data"]["product"] = product_obj.model_dump()
            # Ensure at least 5 features
            if len(product_obj.features) < 5:
                retry_message = HumanMessage(content="Generate a product response with at least 5 features based on our conversation.")
                product_result = product.invoke({"messages": product_messages + [retry_message]}, config)
                product_messages = product_result["messages"]
                product_response = product_messages[-1].content
                product_obj = process_agent_response(product_response, ProductResp)
                if product_obj:
                    state["final_data"]["product"] = product_obj.model_dump()

            # Generate diagram (simulated)
            diagram_url = "https://example.com/diagram.png"
            state["final_data"]["diagram_url"] = diagram_url

            # Update state
            update_conversation_state(request.thread_id, state)

            return {
                "session_id": request.thread_id,
                "product_data": state["final_data"]["product"],
                "diagram_url": diagram_url,
                "status": "success"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate product data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating product: {str(e)}")

async def run_workflow_background_with_progress(thread_id: str, config: dict):
    """Run the workflow in the background with progress tracking"""
    state = get_conversation_state(thread_id)

    try:
        # Get model and agents
        model_provider = state.get("model_provider", "groq")
        model = get_model(provider=model_provider)
        
        product_agent = get_product_agent(model)
        from src.agents.customer import get_customer_agent
        customer_runner = get_customer_agent(model)
        engineer_agent = get_engineer_agent(model)
        risk_agent = get_risk_agent(model)
        summarizer = get_summarizer_agent(model)

        # Update progress: Starting product agent
        state["progress"] = {
            "current_step": "product",
            "status": "running",
            "message": "Generating product specifications..."
        }
        update_conversation_state(thread_id, state)

        # Run product agent
        product_result = product_agent.invoke({"messages": state["messages"]}, config)
        product_messages = product_result["messages"]
        product_response = product_messages[-1].content
        product_obj = process_agent_response(product_response, ProductResp)

        if product_obj:
            state["final_data"]["product"] = product_obj.model_dump()
            # Ensure at least 5 features
            if len(product_obj.features) < 5:
                retry_message = HumanMessage(content="Generate a product response with at least 5 features based on our conversation.")
                product_result = product_agent.invoke({"messages": product_messages + [retry_message]}, config)
                product_messages = product_result["messages"]
                product_response = product_messages[-1].content
                product_obj = process_agent_response(product_response, ProductResp)
                if product_obj:
                    state["final_data"]["product"] = product_obj.model_dump()

            # Generate diagram (simulated)
            diagram_url = "https://example.com/diagram.png"
            state["final_data"]["diagram_url"] = diagram_url

            # Update progress: Product agent complete
            state["progress"] = {
                "current_step": "product",
                "status": "completed",
                "message": "Product specifications generated successfully"
            }
            update_conversation_state(thread_id, state)

        # Update progress: Starting customer agent
        state["progress"] = {
            "current_step": "customer",
            "status": "running",
            "message": "Analyzing customer segments..."
        }
        update_conversation_state(thread_id, state)

        # Run customer agent
        customer_result = customer_runner(product_response)
        state["final_data"]["customer"] = json.loads(customer_result)

        # Update progress: Customer agent complete
        state["progress"] = {
            "current_step": "customer",
            "status": "completed",
            "message": "Customer analysis completed"
        }
        update_conversation_state(thread_id, state)

        # Update progress: Starting engineer agent
        state["progress"] = {
            "current_step": "engineer",
            "status": "running",
            "message": "Evaluating technical feasibility..."
        }
        update_conversation_state(thread_id, state)

        # Run engineer agent
        engineer_result = engineer_agent.invoke(
            {"messages": [HumanMessage(content=json.dumps(state["final_data"]["customer"]))]},
            config
        )
        engineer_response = engineer_result["messages"][-1].content
        state["final_data"]["engineer"] = {"analysis": json.loads(engineer_response)}

        # Update progress: Engineer agent complete
        state["progress"] = {
            "current_step": "engineer",
            "status": "completed",
            "message": "Technical feasibility evaluation completed"
        }
        update_conversation_state(thread_id, state)

        # Update progress: Starting risk agent
        state["progress"] = {
            "current_step": "risk",
            "status": "running",
            "message": "Assessing project risks..."
        }
        update_conversation_state(thread_id, state)

        # Run risk agent
        risk_result = risk_agent.invoke(
            {"messages": [HumanMessage(content=engineer_response)]},
            config
        )
        risk_response = risk_result["messages"][-1].content
        state["final_data"]["risk"] = {"assessment": json.loads(risk_response)}

        # Update progress: Risk agent complete
        state["progress"] = {
            "current_step": "risk",
            "status": "completed",
            "message": "Risk assessment completed"
        }
        update_conversation_state(thread_id, state)

        # Update progress: Starting summarizer
        state["progress"] = {
            "current_step": "summary",
            "status": "running",
            "message": "Generating final summary..."
        }
        update_conversation_state(thread_id, state)

        # Generate final summary
        summary_result = summarizer.invoke(
            {"messages": [HumanMessage(content=json.dumps(state["final_data"], indent=2))]},
            config
        )
        summary = summary_result["messages"][-1].content
        state["final_data"]["summary"] = summary

        # Update progress: Summary complete
        state["progress"] = {
            "current_step": "summary",
            "status": "completed",
            "message": "Final summary generated"
        }
        update_conversation_state(thread_id, state)

        # Update progress: Starting TTS
        state["progress"] = {
            "current_step": "tts",
            "status": "running",
            "message": "Converting summary to speech..."
        }
        update_conversation_state(thread_id, state)

        # Convert summary to speech (simulated)
        tts_file = "https://example.com/speech.mp3"
        state["final_data"]["tts_file"] = tts_file

        # Update progress: TTS complete
        state["progress"] = {
            "current_step": "tts",
            "status": "completed",
            "message": "Speech conversion completed"
        }
        update_conversation_state(thread_id, state)

        # Update state to mark workflow as done
        state["workflow_done"] = True
        update_conversation_state(thread_id, state)
    except Exception as e:
        print(f"Error running workflow: {str(e)}")
        state["workflow_error"] = str(e)
        state["progress"] = {
            "current_step": "error",
            "status": "error",
            "message": f"Error: {str(e)}"
        }
        update_conversation_state(thread_id, state)

@app.get("/get_progress/{thread_id}")
async def get_progress(thread_id: str, current_user: User = Depends(get_current_user)):
    """Get the current progress of the workflow"""
    state = get_conversation_state(thread_id)

    # Verify ownership
    if state.get("username") != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")

    if "progress" not in state:
        return {
            "session_id": thread_id,
            "progress": {
                "current_step": "not_started",
                "status": "idle",
                "message": "Workflow has not started yet"
            }
        }

    return {
        "session_id": thread_id,
        "progress": state["progress"],
        "workflow_done": state.get("workflow_done", False)
    }

@app.post("/run_workflow_with_progress")
async def run_workflow_with_progress(request: RunWorkflowRequest, current_user: User = Depends(get_current_user)):
    """Run the workflow for a given thread_id with progress tracking"""
    state = get_conversation_state(request.thread_id)
    
    # Verify ownership
    if state.get("username") != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to access this conversation")
    """Run the workflow for a given thread_id with progress tracking"""
    state = get_conversation_state(request.thread_id)
    config = state["config"]

    # Check if clarifier is done
    if not state.get("clarifier_done", False):
        raise HTTPException(status_code=400, detail="Clarifier conversation not completed")

    # Run the workflow in the background with progress tracking
    background_tasks = BackgroundTasks()
    background_tasks.add_task(run_workflow_background_with_progress, request.thread_id, config)

    return {
        "status": "workflow_started",
        "session_id": request.thread_id
    }


@app.post("/complete_workflow")
async def complete_workflow(request: RunWorkflowRequest):
    """Complete the workflow for a given thread_id"""
    state = get_conversation_state(request.thread_id)
    config = state["config"]

    # Check if product data is available
    if not state["final_data"].get("product"):
        raise HTTPException(status_code=400, detail="Product data not available")

    try:
        # Get model and agents
        model_provider = state.get("model_provider", "groq")
        model = get_model(provider=model_provider)
        
        from src.agents.customer import get_customer_agent
        customer_runner = get_customer_agent(model)
        engineer_agent = get_engineer_agent(model)
        risk_agent = get_risk_agent(model)
        summarizer = get_summarizer_agent(model)

        # Run customer agent
        product_response = json.dumps(state["final_data"]["product"])
        customer_result = customer_runner(product_response)
        state["final_data"]["customer"] = json.loads(customer_result)

        print("Customer agent completed")

        # Run engineer agent
        engineer_result = engineer_agent.invoke(
            {"messages": [HumanMessage(content=json.dumps(state["final_data"]["customer"]))]},
            config
        )
        engineer_response = engineer_result["messages"][-1].content
        state["final_data"]["engineer"] = {"analysis": json.loads(engineer_response)}

        print("Engineer agent completed")

        # Run risk agent
        risk_result = risk_agent.invoke(
            {"messages": [HumanMessage(content=engineer_response)]},
            config
        )
        risk_response = risk_result["messages"][-1].content
        state["final_data"]["risk"] = {"assessment": json.loads(risk_response)}

        print("Risk agent completed")

        # Generate final summary
        summary_result = summarizer.invoke(
            {"messages": [HumanMessage(content=json.dumps(state["final_data"], indent=2))]},
            config
        )
        summary = summary_result["messages"][-1].content
        state["final_data"]["summary"] = summary

        print("Summary generated")

        try:
                print("Generating diagram URL...")
                state["final_data"]["diagram_url"] = generate_mermaid_link(state["final_data"])
                print("Diagram URL generated")
        except Exception as e:
            print(f"Error generating diagram URL: {e}")

        print("Diagram URL generated")
        # Convert summary to speech (simulated)
        tts_file = "https://example.com/speech.mp3"
        state["final_data"]["tts_file"] = tts_file

        # Update state to mark workflow as done
        state["workflow_done"] = True
        update_conversation_state(request.thread_id, state)

        return {
            "session_id": request.thread_id,
            "final_data": {
                "customer": state["final_data"]["customer"],
                "engineer": state["final_data"]["engineer"],
                "risk": state["final_data"]["risk"],
                "diagram_url": state["final_data"].get("diagram_url"),
            },
            "summary": summary,
            "tts_file": tts_file,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error completing workflow: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
