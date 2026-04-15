import { NodeInterface } from "@weezy/workflow";

/**
Cron Trigger Node
Entry point for workflows triggered on a schedule.

Parameters:
  schedule: string (cron expression, e.g., "0 * * * *")
**/
export async function executeCronNode(
  node: NodeInterface,
  _context: Record<string, any>,
) {
  return {
    id: node.id,
    timestamp: new Date().toISOString(),
    schedule: node.parameters.schedule,
  };
}
