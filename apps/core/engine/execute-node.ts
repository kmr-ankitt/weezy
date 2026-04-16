import { NodeInterface } from "@weezy/workflow";
import { getNodeExecutor } from "@weezy/nodes";
import { resolveExpressions } from "./expressions";
import { ExecutionContext } from "./types";

export async function executeNode(
  node: NodeInterface,
  context: ExecutionContext,
): Promise<{
  status: "success" | "failed";
  data?: any;
  error?: string;
}> {
  try {
    const executor = getNodeExecutor(node.type);

    // Resolve expressions in node parameters
    const resolvedParameters = resolveExpressions(node.parameters, context);
    const resolvedNode = { ...node, parameters: resolvedParameters };

    const res = await executor(resolvedNode, context);

    console.log(`Node ${node.id} (${node.type}) completed`);
    return { status: "success", data: res };
  } catch (err) {
    return {
      status: "failed",
      error: (err as Error).message,
    };
  }
}
