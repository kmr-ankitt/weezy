import { prisma } from "@weezy/prisma";
import { WorkflowType } from "../../../types/workflow.types";

export default async function getWorkflow(): Promise<WorkflowType[]> {
  try {
    const workflow = await prisma.workflow.findMany({
      include: {
        executions: {
          orderBy: { startedAt: "desc" },
          take: 10,
        },
      },
    });
    return workflow as WorkflowType[];
  } catch (error) {
    console.error("Failed to fetch workflows:", error);
    throw new Error("Failed to fetch workflows");
  }
}
