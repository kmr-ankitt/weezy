import { prisma } from "@weezy/prisma";
import { Request, Response } from "express";

export default async function createWorkflowController(
  req: Request,
  res: Response,
) {
  const { name, definition } = req.body;

  if (!name || !definition) {
    return res.status(400).json({ error: "Name and definition are required" });
  }

  try {
    const workflow = await prisma.workflow.create({
      data: {
        name,
        definition,
      },
    });

    res.status(201).json({
      success: true,
      data: workflow,
    });
  } catch (error: any) {
    console.error("Failed to create workflow:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
