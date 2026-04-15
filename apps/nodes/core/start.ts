import { NodeInterface } from "@weezy/workflow";
import { NodeExecutionResult } from "../types";

export async function executeStartNode(
  node: NodeInterface,
  context: Record<string, any>,
): Promise<NodeExecutionResult> {
  console.log(`Starting workflow with node: ${node.id}`);

  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    data: node.parameters || { message: "Workflow started" },
  };
}
