import { InputJsonValue, JsonValue } from "@weezy/prisma/generated/prisma/internal/prismaNamespace";

export type WorkflowType = {
  id: string;
  name: string;
  definition: JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

export type NewWorkflowInput = {
  name: string;
  definition: InputJsonValue;
};

export type CreateWorkflowResult = {
  success: boolean;
  id?: string;
  error?: string;
};

export type UpdateWorkflowInput = {
  id: string;
  name?: string;
  definition?: InputJsonValue;
};

export type UpdateWorkflowResult = {
  success: boolean;
  id?: string;
  error?: string;
};

export type DeleteWorkflowResult = {
  success: boolean;
  id?: string;
  error?: string;
};

export type GetWorkflowByIdResult = {
  success: boolean;
  workflow?: WorkflowType;
  error?: string;
};
