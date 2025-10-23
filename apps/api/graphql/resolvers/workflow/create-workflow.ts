import { prisma } from "@weezy/prisma";
import {
  CreateWorkflowResult,
  NewWorkflowInput,
} from "../../../types/workflow.types";

export default async function createWorkflow(
  input: NewWorkflowInput,
): Promise<CreateWorkflowResult> {
  try {
    const newWorkflow = await prisma.workflow.create({
      data: {
        name: input.name,
        definition: input.definition,
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      id: newWorkflow.id,
    };
  } catch (error) {
    console.error("Failed creating workflow:", error);
    return {
      success: false,
      error: "Failed to create workflow",
    };
  }
}
