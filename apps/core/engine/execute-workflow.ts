import { Workflow } from "@weezy/workflow";
import { buildGraph } from "./graph";
import { executeNode } from "./execute-node";
import { ExecutionContext } from "./types";
import { PrismaClient } from "@weezy/prisma";

/**
 * Executes a workflow by processing its nodes and connections.
 * Performs topological sort as a batch instead of a single node to allow for parallel execution of independent nodes.
 * @param workflow - The workflow to be executed, containing nodes and connections.
 * @param initialContext - The context to start with.
 * @param db - Optional PrismaClient for execution tracking.
 **/
export async function executeWorkflow(
  workflow: Workflow,
  initialContext: ExecutionContext = {},
  db?: PrismaClient,
) {
  const { nodes, connections } = workflow;
  const { inDegree, adj, nodeMap } = buildGraph(nodes, connections);

  const queue: string[] = [];
  let context: ExecutionContext = { ...initialContext };

  for (const [nodeId, deg] of inDegree) {
    if (deg === 0) {
      queue.push(nodeId);
    }
  }

  workflow.setStatus("running");

  let executionId: string | undefined;
  if (db) {
    const execution = await db.execution.create({
      data: {
        workflowId: workflow.id,
        status: "running",
        startedAt: new Date(),
      },
    });
    executionId = execution.id;
  }

  let processedCount = 0;

  try {
    while (queue.length > 0) {
      const batch = [...queue];
      queue.length = 0;

      const results = await Promise.all(
        batch.map(async (nodeId) => {
          const node = nodeMap.get(nodeId);
          if (!node) {
            return null;
          }

          const input = { ...context };
          const res = await executeNode(node, context);
          console.log(`Node ${nodeId} result:`, res);

          if (db && executionId) {
            await db.executionNode.create({
              data: {
                executionId: executionId,
                nodeId,
                status: res.status,
                input: input as any,
                output: res.data as any,
                error: res.error,
              },
            });
          }

          if (res.status === "failed") {
            throw new Error(`Node ${nodeId} execution failed: ${res.error}`);
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
      throw new Error("Cycle detected in workflow graph.");
    }

    workflow.setStatus("success");

    if (db && executionId) {
      await db.execution.update({
        where: { id: executionId },
        data: {
          status: "success",
          endedAt: new Date(),
          result: context as any,
        },
      });
    }

    console.log("Final context: ", context);
  } catch (error: any) {
    workflow.setStatus("failed");

    if (db && executionId) {
      await db.execution.update({
        where: { id: executionId },
        data: {
          status: "failed",
          endedAt: new Date(),
          result: { error: error.message, context } as any,
        },
      });
    }

    throw error;
  }
}
