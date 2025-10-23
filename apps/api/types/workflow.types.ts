import { InputJsonValue, JsonValue } from "@weezy/prisma/generated/prisma/internal/prismaNamespace";
export type NewWorkflowInput = {
  name: string;
  definition: InputJsonValue;
};
export type CreateWorkflowResult = {
  success: boolean;
  id?: string;
  error?: string;
};