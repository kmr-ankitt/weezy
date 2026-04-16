import { prisma } from "@weezy/prisma";

export default async function getExecutions(workflowId: string) {
  try {
    return await prisma.execution.findMany({
      where: { workflowId },
      orderBy: { startedAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error("Failed to fetch executions", error);
    return [];
  }
}
