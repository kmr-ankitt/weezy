import { INode } from "@weezy/workflow";

// TODO: Implement actual node execution logic
export function executeNode(node: INode): {
  status: "success" | "failed";
  error?: string;
} {
  const status = Math.random() > 0.2 ? "success" : "failed";
  return {
    status: status,
    error:
      status === "failed"
        ? "Node execution failed due to some error."
        : undefined,
  };
}
