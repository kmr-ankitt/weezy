import { prisma } from "@weezy/prisma";
import { Request, Response } from "express";

export default async function updateWorkflowController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;
  const { name, definition } = req.body;

  try {
    const workflow = await prisma.workflow.update({
      where: { id: id as string },
      data: {
        ...(name && { name }),
        ...(definition && { definition }),
      },
    });

    res.status(200).json({
      success: true,
      data: workflow,
    });
  } catch (error: any) {
    console.error("Failed to update workflow:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
