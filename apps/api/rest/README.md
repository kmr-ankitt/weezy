# **Weezy's REST API**

Base URL: `http://localhost:8000/api`

The **Weezy REST API** provides an Express-based interface for managing and executing workflows.

---

## **Endpoints**

### **Workflows**

#### **Create Workflow**

- **POST** `/workflows`
- **Description**: Creates a new workflow definition in the system.
- **Request Body**:
  ```json
  {
    "name": "My New Workflow",
    "definition": {
      "nodes": [
        {
          "id": "n1",
          "type": "log",
          "parameters": { "message": "Starting workflow" }
        }
      ],
      "connections": [],
      "settings": { "active": true }
    }
  }
  ```
- **Response**: `201 Created` with the success status and the created workflow object.

#### **List All Workflows**

- **GET** `/workflows`
- **Description**: Retrieves a list of all workflow definitions in the system.

#### **Execute Workflow**

- **POST** `/workflows/:id/execute`
- **Description**: Triggers an asynchronous execution of a workflow. Returns an `executionId` immediately.
- **Response**:
  ```json
  {
    "success": true,
    "executionId": "...",
    "status": "queued"
  }
  ```

#### **Get Execution Status**

- **GET** `/workflows/executions/:id`
- **Description**: Retrieves the current status and results of a workflow execution. Use this for polling.
- **Example Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "...",
      "status": "success",
      "result": { ... },
      "startedAt": "...",
      "endedAt": "..."
    }
  }
  ```

---

## **Polling Strategy**

Since workflow execution is now asynchronous (processed via Redis), you should follow this pattern to get results:

1. **Trigger**: POST to `/workflows/:id/execute` to start the run. Store the returned `executionId`.
2. **Poll**: GET `/workflows/executions/:id` every 1-2 seconds.
3. **Check Status**:
   - If `status` is `pending`, `queued`, or `running`, continue polling.
   - If `status` is `success` or `failed`, stop polling and process the `result`.

**Example (Javascript)**:

```javascript
async function executeAndPoll(workflowId) {
  // 1. Trigger
  const triggerRes = await fetch(`/workflows/${workflowId}/execute`, {
    method: "POST",
  });
  const { executionId } = await triggerRes.json();

  // 2. Poll
  while (true) {
    const pollRes = await fetch(`/workflows/executions/${executionId}`);
    const { data } = await pollRes.json();

    if (data.status === "success" || data.status === "failed") {
      console.log("Final Result:", data.result);
      return data;
    }

    // Wait for 1 second before next poll
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
```

## **Workflow Expressions**

You can use dynamic expressions in your node parameters to reference data from previous nodes:

- **Syntax**: `{{ $node["node-id"].data.path.to.value }}`
- **Example**: `{{ $node["http-fetch"].data.user.name }}`

---

## **Execution Tracking**

Every execution via the API is tracked in the database:

- **Execution Records**: Stores start/end times, final context, and outcome.
- **Node Logs**: Detailed input/output logs for every single node execution within a run.

---

#### **Folder Structure**

```
rest/
├── controller/       # Contains request handlers (logic)
├── router/           # Route definitions grouped by feature
```
