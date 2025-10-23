import { prisma } from "@weezy/prisma";
import { WorkflowType } from "../../../types/workflow.types";

export default async function getWorkflow(): Promise<WorkflowType[]> {
  try {
    const workflow = await prisma.workflow.findMany();
    return workflow;
  } catch (error) {
    console.error("Failed to fetch workflows:", error);
    throw new Error("Failed to fetch workflows");
  }
}
