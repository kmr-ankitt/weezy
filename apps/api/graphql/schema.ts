import { buildSchema } from "graphql";

const schema = buildSchema(`
  scalar  Date
  scalar  JSON

  type Query {
    workflow: [Workflow]!
    workflowById(id: String!): WorkflowByIdResult!
    executions(workflowId: String!): [Execution]!
    executionById(id: String!): ExecutionByIdResult!
  }

  enum ExecutionStatus {
    pending
    running
    success
    failed
  }

  type Execution {
    id: String!
    workflowId: String!
    status: ExecutionStatus!
    startedAt: Date
    endedAt: Date
    result: JSON
    executionNodes: [ExecutionNode]
  }

  type ExecutionNode {
    id: String!
    executionId: String!
    nodeId: String!
    status: String!
    input: JSON
    output: JSON
    error: String
    createdAt: Date!
  }

  type ExecutionByIdResult {
    success: Boolean!
    execution: Execution
    error: String
  }

  type Mutation{
    createWorkflow(input: CreateWorkflowInput!): CreateWorkflowResult!
    updateWorkflow(input: UpdateWorkflowInput!): UpdateWorkflowResult!
    deleteWorkflow(id: String!): DeleteWorkflowResult!
  }

  type Workflow {
    id:   String!
    name: String
    definition: JSON
    createdAt: Date!
    updatedAt: Date!
    executions: [Execution]
  }

  input CreateWorkflowInput {
    name: String!
    definition: JSON!
  }

  type CreateWorkflowResult {
    success: Boolean!
    id: String
    error: String
  }

  input UpdateWorkflowInput {
    id: String!,
    name: String
    definition: JSON
  }

  type UpdateWorkflowResult {
    success: Boolean!
    id: String
    error: String
  }

  input DeleteWorkflowInput {
    id: String!
  }

  type DeleteWorkflowResult {
    success: Boolean!
    id: String
    error: String
  }

  type WorkflowByIdResult {
    success: Boolean!
    workflow: Workflow
    error: String
  }

`);

export default schema;
