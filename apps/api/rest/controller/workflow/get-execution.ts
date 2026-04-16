import { prisma } from "@weezy/prisma";
import { Request, Response } from "express";

export default async function getExecutionController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  try {
    const execution = await prisma.execution.findUnique({
      where: { id: id as string },
      include: {
        executionNodes: true,
      },
    });

    if (!execution) {
      return res.status(404).json({ error: "Execution result not found" });
    }

    res.status(200).json({
      success: true,
      data: execution,
    });
  } catch (error: any) {
    console.error("Failed to fetch execution:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
