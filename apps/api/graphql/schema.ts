import { buildSchema } from "graphql";

const schema = buildSchema(`
  scalar  Date 
  scalar  JSON

  type Query {
    workflow: [Workflow]!
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
  
`);

export default schema;
