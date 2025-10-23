import { prisma } from "@weezy/prisma";
import { DeleteWorkflowResult } from "../../../types/workflow.types";

export default async function deleteWorkflow(
  id: string,
): Promise<DeleteWorkflowResult> {
  try {
    const res = await prisma.workflow.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      id: res.id,
    };
  } catch (error) {
    console.error("Failed to delete workflow", error);
    return {
      success: false,
      error: "Failed to delete workflow",
    };
  }
}
