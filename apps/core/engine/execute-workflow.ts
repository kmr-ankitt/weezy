import { Workflow } from "@weezy/workflow";
import { buildGraph } from "./graph";
import { executeNode } from "./execute-node";
import { ExecutionContext } from "./types";

/**
 * Executes a workflow by processing its nodes and connections.
 * Performs topological sort as a batch instead of a single node to allow for parallel execution of independent nodes.
 * @param workflow - The workflow to be executed, containing nodes and connections.
 **/
export async function executeWorkflow(workflow: Workflow) {
  const { nodes, connections } = workflow;
  const { inDegree, adj, nodeMap } = buildGraph(nodes, connections);

  const queue: string[] = [];
  let context: ExecutionContext = {};

  for (const [nodeId, deg] of inDegree) {
    if (deg === 0) {
      queue.push(nodeId);
    }
  }

  workflow.setStatus("running");

  let processedCount = 0;

  while (queue.length > 0) {
    const batch = [...queue];
    queue.length = 0;

    const results = await Promise.all(
      batch.map(async (nodeId) => {
        const node = nodeMap.get(nodeId);
        if (!node) {
          return null;
        }

        const res = await executeNode(node, context);
        console.log(res);

        if (res.status === "failed") {
          throw new Error(`Node ${nodeId} execution failed.`);
        }

        return {
          nodeId,
          data: res.data,
        };
      }),
    );

    for (const result of results) {
      if (!result) continue;
      context[result.nodeId] = result.data;
    }

    for (const nodeId of batch) {
      processedCount++;

      for (const neighbor of adj.get(nodeId) || []) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }
  }

  if (processedCount !== nodes.length) {
    workflow.setStatus("error");
    throw new Error("Cycle detected in workflow graph.");
  }

  workflow.setStatus("success");
  console.log("Final context: ", context);
}
