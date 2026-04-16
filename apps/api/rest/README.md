# **Weezy's REST API**

Base URL: `http://localhost:8000/api`

The **Weezy REST API** provides an Express-based interface for managing and executing workflows.

---

## **Endpoints**

### **Workflows**

#### **List All Workflows**

- **GET** `/workflows`
- **Description**: Retrieves a list of all workflow definitions in the system.

#### **Execute Workflow**

- **POST** `/workflows/:id/execute`
- **Description**: Triggers a synchronous execution of a workflow.
- **Request Body**:
  ```json
  {
    "context": {
      "key": "value"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "status": "success",
    "result": {
      "node-1": { ... },
      "node-2": { ... }
    }
  }
  ```

---

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
