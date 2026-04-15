import { NodeInterface } from "@weezy/workflow";
import { getNodeExecutor } from "@weezy/nodes";
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
    const res = await executor(node, context);

    console.log(`Node ${node.id} (${node.type}) completed`);
    return { status: "success", data: res };
  } catch (err) {
    return {
      status: "failed",
      error: (err as Error).message,
    };
  }
}
