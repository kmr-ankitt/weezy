import { Workflow } from "@weezy/workflow";
import { buildGraph } from "./graph";
import { executeNode } from "./execute-node";

/**
 * Executes a workflow by processing its nodes and connections.
 * Performs topological sort as a batch instead of a single node to allow for parallel execution of independent nodes.
 * @param workflow - The workflow to be executed, containing nodes and connections.
 **/
export async function executeWorkflow(workflow: Workflow) {
  const { nodes, connections } = workflow;
  const { inDegree, adj, nodeMap } = buildGraph(nodes, connections);

  const queue: string[] = [];

  for (const [nodeId, deg] of inDegree) {
    if (deg === 0) {
      queue.push(nodeId);
    }
  }

  workflow.setStatus("running");

  while (queue.length > 0) {
    const batch = [...queue];
    queue.length = 0;

    await Promise.all(
      batch.map(async (nodeId) => {
        const node = nodeMap.get(nodeId);
        if (!node) {
          return;
        }

        const res = await executeNode(node);

        if (res.status === "failed") {
          workflow.setStatus("error");
          throw new Error(`Node ${nodeId} execution failed.`);
        }

        for (const neighbor of adj.get(nodeId) || []) {
          inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
          if (inDegree.get(neighbor) === 0) {
            queue.push(neighbor);
          }
        }
      }),
    );
  }

  workflow.setStatus("success");
}
