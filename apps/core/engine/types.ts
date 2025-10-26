import { ExecutionStatus } from "@weezy/workflow";

export type ExecutionResult = {
  status: ExecutionStatus;
  errors?: string;
};
