import { prisma } from "@weezy/prisma";

export default async function getExecutionById(id: string) {
  try {
    const execution = await prisma.execution.findUnique({
      where: { id },
      include: {
        executionNodes: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!execution) {
      return {
        success: false,
        error: "Execution not found",
      };
    }

    return {
      success: true,
      execution,
    };
  } catch (error: any) {
    console.error("Failed to fetch execution details", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
