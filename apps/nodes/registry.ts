import { executeHttpNode } from "./action";
import { executeStartNode } from "./core";
import { NodeExecutor } from "./types";

export const nodeRegistry: Record<string, NodeExecutor> = {
  startNode: executeStartNode,
  http: executeHttpNode,
};

export function getNodeExecutor(type: string): NodeExecutor {
  const executor = nodeRegistry[type];
  if (!executor) {
    throw new Error(`Node type ${type} not registered.`);
  }

  return executor;
}
