import express from 'express'
import * as dotenv from 'dotenv'
import { PORT } from './constants'
import cors from "cors"
import router from './rest/router';
import { ruruHTML } from 'ruru/server';
import schema from './graphql/schema';
import { createHandler } from 'graphql-http/lib/use/express';
import { rootResolver } from './graphql/resolvers';


dotenv.config();

const app = express()
app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use("/graphql", createHandler({
  schema,
  rootValue: rootResolver,
}));

app.get("/", (req, res) => {
  res.send("Welcome to the Weezy API");
});

// Development playground for testing GraphQL queries
app.get("/playground", (_req, res) => {
  res.type("text/html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(PORT, err => {
  if (err) {
    console.error("Failed Starting API server:", err)
  }
  console.log(`API server is running on port ${PORT}`)
})

export default app