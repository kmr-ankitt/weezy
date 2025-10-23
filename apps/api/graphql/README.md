# **Weezy GraphQL API Documentation**

Base URL: `http://localhost:8000/graphql`

This API provides a GraphQL interface for Weezy.  
All operations are performed via queries and mutations using the GraphQL standard.

---

<details>
<summary><strong>Workflow Module</strong></summary>
</details>

This module allows managing workflows.

### **Inputs**

#### **CreateWorkflowInput**

| Field        | Type   | Required |
| ------------ | ------ | -------- |
| `name`       | String | ✅       |
| `definition` | JSON   | ✅       |

#### **UpdateWorkflowInput**

| Field        | Type   | Required |
| ------------ | ------ | -------- |
| `id`         | String | ✅       |
| `name`       | String | ❌       |
| `definition` | JSON   | ❌       |

#### **DeleteWorkflowInput**

| Field | Type   | Required |
| ----- | ------ | -------- |
| `id`  | String | ✅       |

---

### **Response Types**

#### **Workflow**

| Field        | Type    |
| ------------ | ------- |
| `id`         | String! |
| `name`       | String  |
| `definition` | JSON    |
| `createdAt`  | Date!   |
| `updatedAt`  | Date!   |

#### **CreateWorkflowResult / UpdateWorkflowResult / DeleteWorkflowResult**

| Field     | Type     |
| --------- | -------- |
| `success` | Boolean! |
| `id`      | String   |
| `error`   | String   |

---

### **Queries**

#### **workflow**

Fetch all workflows.

```graphql
query {
  workflow {
    id
    name
    definition
    createdAt
    updatedAt
  }
}
````

---

### **Mutations**

#### **createWorkflow**

Create a new workflow.

```graphql
mutation CreateWorkflow($input: CreateWorkflowInput!) {
  createWorkflow(input: $input) {
    success
    id
    error
  }
}
```

#### **updateWorkflow**

Update an existing workflow.

```graphql
mutation UpdateWorkflow($input: UpdateWorkflowInput!) {
  updateWorkflow(input: $input) {
    success
    id
    error
  }
}
```

#### **deleteWorkflow**

Delete a workflow by ID.

```graphql
mutation DeleteWorkflow($id: String!) {
  deleteWorkflow(id: $id) {
    success
    id
    error
  }
}
```

---

### **Example Variables for Mutations**

```json
{
  "input": {
    "name": "My First Workflow",
    "definition": {
      "steps": [
        {"id": "1", "action": "start", "next": "2"},
        {"id": "2", "action": "process", "next": "3"},
        {"id": "3", "action": "end"}
      ]
    }
  }
}
```

</details>

---
