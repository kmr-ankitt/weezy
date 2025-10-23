import { prisma } from "@weezy/prisma";
import {
  UpdateWorkflowInput,
  UpdateWorkflowResult,
} from "../../../types/workflow.types";

export default async function updateWorkflow(
  input: UpdateWorkflowInput,
): Promise<UpdateWorkflowResult> {
  try {
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: input.id },
      data: {
        name: input.name,
        definition: input.definition,
      },
    });

    return {
      success: true,
      id: updatedWorkflow.id,
    };
  } catch (error) {
    console.error("Failed to update workflow", error);
    return {
      success: false,
      error: "Failed to update workflow",
    };
  }
}
