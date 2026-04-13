import { NodeInterface } from "@weezy/workflow";
import { getNodeExecutor } from "@weezy/nodes";

export async function executeNode(node: NodeInterface): Promise<{
  status: "success" | "failed";
  data?: any;
  error?: string;
}> {
  try {
    const executor = getNodeExecutor(node.type);
    const res = await executor(node);

    console.log(`Node ${node.id} (${node.type}) completed`);
    return { status: "success", data: res };
  } catch (err) {
    return {
      status: "failed",
      error: (err as Error).message,
    };
  }
}
