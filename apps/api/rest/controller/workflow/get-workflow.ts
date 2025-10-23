import { prisma } from "@weezy/prisma";
import { Request, Response } from "express";

export default async function getWorkflowController(
  _req: Request,
  res: Response,
) {
  try {
    const workflows = await prisma.workflow.findMany();
    res.status(200).json(workflows);
  } catch (error) {
    console.error("Failed to fetch workflows:", error);
    res.status(500).json({ error: "Failed to fetch workflows" });
  }
}
