import { NodeInterface } from "@weezy/workflow";

export type NodeExecutor = (
  node: NodeInterface,
  inputData?: any,
) => Promise<any>;

export type NodeExecutionResult = {
  id: NodeInterface["id"];
  timestamp: string;
  data: NodeInterface["parameters"];
};

export type HttpNodeExecutionResult = NodeExecutionResult & {
  status: number;
};
