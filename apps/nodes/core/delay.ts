import { NodeInterface } from "@weezy/workflow";

export async function executeDelayNode(
  node: NodeInterface,
  _context: Record<string, any>,
) {
  const ms = parseInt(node.parameters.ms as string, 10) || 1000;

  await new Promise((resolve) => setTimeout(resolve, ms));

  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    delayedMs: ms,
    message: `Delayed for ${ms}ms`,
  };
}
