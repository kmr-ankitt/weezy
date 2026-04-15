import {
  executeHttpNode,
  executeDiscordNode,
  executeTelegramNode,
  executeNotionNode,
  executeOpenAINode,
} from "./action";
import {
  executeLogNode,
  executeStartNode,
  executeDelayNode,
  executeConditionNode,
  executeSwitchNode,
  executeCronNode,
} from "./core";
import { NodeExecutor } from "./types";

export const nodeRegistry: Record<string, NodeExecutor> = {
  // --- Core ---
  startNode: executeStartNode,
  log: executeLogNode,
  delay: executeDelayNode,
  condition: executeConditionNode,
  switch: executeSwitchNode,
  cron: executeCronNode,

  // --- Integrations ---
  http: executeHttpNode,
  discord: executeDiscordNode,
  telegram: executeTelegramNode,
  notion: executeNotionNode,
  openai: executeOpenAINode,
};

export function getNodeExecutor(type: string): NodeExecutor {
  const executor = nodeRegistry[type];
  if (!executor) {
    throw new Error(`Node type ${type} not registered.`);
  }

  return executor;
}
