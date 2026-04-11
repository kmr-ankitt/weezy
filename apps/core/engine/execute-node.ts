import { INode } from "@weezy/workflow";

// TODO: Implement actual node execution logic
export async function executeNode(
  node: INode,
): Promise<{ status: "success" | "failed"; error?: string }> {
  try {
    await new Promise((r) => setTimeout(r, 300));

    return { status: "success" };
  } catch (err) {
    return {
      status: "failed",
      error: (err as Error).message,
    };
  }
}
