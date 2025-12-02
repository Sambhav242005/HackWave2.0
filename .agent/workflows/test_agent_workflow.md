---
description: How to test the agent workflow API
---

# Test Agent Workflow API

This workflow describes how to test all the agent workflow API endpoints.

## Prerequisites

1. Ensure the API server is running:

   ```bash
   python run.py api
   ```

2. The API should be accessible at `http://localhost:8000`

## Running the Tests

// turbo

### Run all workflow tests

```bash
python verify_agent_workflow.py
```

This will execute a comprehensive test suite that validates:

- **Complete Workflow**: Tests the full agent workflow from start to finish
- **Progress Tracking**: Tests real-time progress monitoring
- **Streaming Workflow**: Tests streaming endpoint for live updates
- **Error Scenarios**: Tests error handling and edge cases

## What Gets Tested

### 1. Complete Workflow Test

- Creates a new user and authenticates
- Starts a conversation with the clarifier agent
- Answers clarifier questions until complete
- Generates product specifications
- Runs all agents (customer, engineer, risk, summarizer)
- Retrieves final results

### 2. Progress Tracking Test

- Starts a workflow with progress tracking enabled
- Polls the progress endpoint to monitor workflow status
- Validates progress updates for each agent step
- Confirms workflow completion

### 3. Streaming Workflow Test

- Runs the entire workflow in streaming mode
- Receives real-time updates as each agent completes
- Validates all workflow steps are streamed correctly

### 4. Error Scenario Tests

- Tests accessing non-existent threads (404)
- Tests running workflow without completing clarifier (400)
- Tests unauthorized access (401)
- Tests cross-user access prevention (403)

## Expected Output

The test script will display:

- Progress for each test section
- Step-by-step validation results
- Success (✓) or failure (✗) indicators
- Final summary with pass/fail counts

Example:

```
============================================================
  AGENT WORKFLOW API TEST SUITE
============================================================
  Target: http://localhost:8000
  Time: 2025-11-22 19:04:31
============================================================

============================================================
  AGENT WORKFLOW API TESTING
============================================================

[Step 1] Setup: Create and login test user
------------------------------------------------------------
✓ User 'workflow_test_1234567890' created successfully
✓ Logged in successfully

[Step 2] Start conversation with clarifier
------------------------------------------------------------
✓ Conversation started, thread_id: abc-123-def
  Received 5 clarifier questions

...

============================================================
  TEST SUMMARY
============================================================
  Complete Workflow         ✓ PASSED
  Progress Tracking         ✓ PASSED
  Streaming Workflow        ✓ PASSED
  Error Scenarios           ✓ PASSED

  Total: 4/4 tests passed

  🎉 All tests passed!
```

## Troubleshooting

### Connection Refused

**Problem**: `Failed to connect to API: Connection refused`

**Solution**: Make sure the API server is running:

```bash
python run.py api
```

### Authentication Errors

**Problem**: Tests fail with 401 Unauthorized errors

**Solution**: Check that the authentication system is working:

```bash
python verify_api_auth.py
```

### Timeout Errors

**Problem**: Tests timeout waiting for workflow completion

**Solution**:

- Check API server logs for errors
- Verify model provider (Groq) API key is configured in `.env`
- Increase timeout values in the test script if needed

### Agent Errors

**Problem**: Workflow fails during specific agent execution

**Solution**:

- Check API server logs for detailed error messages
- Verify all required environment variables are set
- Test individual agents separately using the API

## API Endpoints Tested

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/signup` | POST | Create new user account |
| `/token` | POST | Login and get access token |
| `/start_conversation` | POST | Start clarifier conversation |
| `/continue_clarifier` | POST | Continue clarifier with answers |
| `/generate_product` | POST | Generate product specifications |
| `/complete_workflow` | POST | Run complete agent workflow |
| `/run_workflow_with_progress` | POST | Run workflow with progress tracking |
| `/get_progress/{thread_id}` | GET | Get current workflow progress |
| `/run_workflow_stream` | POST | Run workflow with streaming updates |
| `/get_state/{thread_id}` | GET | Get conversation state |
| `/get_result/{thread_id}` | GET | Get final workflow results |

## Notes

- Each test creates its own test user to avoid conflicts
- Tests are designed to be idempotent and can be run multiple times
- The streaming test may take longer due to the full workflow execution
- All tests include proper cleanup and error handling
