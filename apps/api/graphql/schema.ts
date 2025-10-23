import { buildSchema } from "graphql";

const schema = buildSchema(`
  scalar  Date 
  scalar  JSON

  type Query {
    workflow: [Workflow]!
  }

  type Workflow {
    id:   String!
    name: String
    definition: JSON
    createdAt: Date!
    updatedAt: Date!
  }
`);

export default schema;
