import { executeHttpNode, executeDiscordNode } from "./action";
import {
  executeLogNode,
  executeStartNode,
  executeDelayNode,
  executeConditionNode,
  executeSwitchNode,
} from "./core";
import { NodeExecutor } from "./types";

export const nodeRegistry: Record<string, NodeExecutor> = {
  startNode: executeStartNode,
  http: executeHttpNode,
  log: executeLogNode,
  delay: executeDelayNode,
  condition: executeConditionNode,
  switch: executeSwitchNode,
  discord: executeDiscordNode,
};

export function getNodeExecutor(type: string): NodeExecutor {
  const executor = nodeRegistry[type];
  if (!executor) {
    throw new Error(`Node type ${type} not registered.`);
  }

  return executor;
}
