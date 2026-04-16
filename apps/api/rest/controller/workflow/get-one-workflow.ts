import { prisma } from "@weezy/prisma";
import { Request, Response } from "express";

export default async function getWorkflowByIdController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;

  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: id as string },
    });

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    res.status(200).json({
      success: true,
      data: workflow,
    });
  } catch (error: any) {
    console.error("Failed to fetch workflow:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
