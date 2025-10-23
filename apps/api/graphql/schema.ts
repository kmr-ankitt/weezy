import { buildSchema } from "graphql";

const schema = buildSchema(`
  scalar  Date 
  scalar  JSON

  type Query {
    workflow: [Workflow]!
  }

  type Mutation{
    createWorkflow(input: CreateWorkflowInput!): CreateWorkflowResult!
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
`);

export default schema;
