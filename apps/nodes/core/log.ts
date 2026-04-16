import { NodeInterface } from "@weezy/workflow";

export async function executeLogNode(
  node: NodeInterface,
  context: Record<string, any>,
) {
  const level = node.parameters.level || "info";
  console.log(
    `📝 LOG [${level.toUpperCase()}]: ${node.parameters.message || `Node ${node.id} executed`}`,
  );

  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    level,
    message: "Logged successfully",
  };
}
