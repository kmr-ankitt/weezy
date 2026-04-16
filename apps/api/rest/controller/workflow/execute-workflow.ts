import { prisma } from "@weezy/prisma";
import { workflowQueue } from "@weezy/core";
import { Request, Response } from "express";

export default async function executeWorkflowController(
  req: Request,
  res: Response,
) {
  const { id } = req.params;
  const { context = {} } = req.body;

  try {
    const workflowData = await prisma.workflow.findUnique({
      where: { id: id as string },
    });

    if (!workflowData) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    // Create an execution record in 'pending' state
    const execution = await prisma.execution.create({
      data: {
        workflowId: workflowData.id,
        status: "pending",
      },
    });

    // Add job to BullMQ queue
    await workflowQueue.add(`execution-${execution.id}`, {
      workflowId: workflowData.id,
      executionId: execution.id,
      context,
    });

    res.status(202).json({
      success: true,
      executionId: execution.id,
      status: "queued",
      message: "Workflow execution has been queued",
    });
  } catch (error: any) {
    console.error("Failed to queue workflow:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
