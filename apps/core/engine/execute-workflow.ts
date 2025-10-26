import {
  findDestinationNode,
  findStartNode,
  getNextNode,
  INode,
  Workflow,
} from "@weezy/workflow";
import { executeNode } from "./execute-node";
import { ExecutionResult } from "./types";

/**
 * Step to execute workflow:
 * 1. Start with root node
 * 2. Execute node
 * 3. Find the next connected node for the current node
 * 4. Execute the next node
 * 5. Repeat until no more connected nodes (i.e., next node id is null) or destination reached
 * 6. If any node fails, stop execution and mark workflow as failed
 * 7. If all nodes execute successfully, mark workflow as success
 */

export function executeWorkflow(
  workflow: Workflow,
  startNode?: INode,
  destinationNode?: INode,
): ExecutionResult {
  workflow.setStatus("running");
  if (!startNode) {
    startNode = findStartNode(workflow.nodes, workflow.connections);
  }

  if (!destinationNode) {
    destinationNode = findDestinationNode(workflow.nodes, workflow.connections);
  }

  let currentNode = startNode;
  while (currentNode) {
    try {
      const result = executeNode(currentNode);

      // TODO: Execution result handling
      if (result.status === "failed") {
        workflow.setStatus("error");
        return {
          status: "error",
          errors: result.error,
        };
      }
    } catch (err) {
      workflow.setStatus("crashed");
      return {
        status: "crashed",
        errors: (err as Error).message,
      };
    }

    if (destinationNode && currentNode.id === destinationNode.id) {
      break;
    }

    const nextNodeId = getNextNode(currentNode.id, workflow.connections);
    if (nextNodeId === null) {
      break;
    }

    const nextNode = workflow.nodes.find((node) => node.id === nextNodeId);
    if (!nextNode) {
      break;
    }

    currentNode = nextNode;
  }

  workflow.setStatus("success");
  return {
    status: "success",
  };
}
