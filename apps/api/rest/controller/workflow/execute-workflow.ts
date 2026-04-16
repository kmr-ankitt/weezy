import { prisma } from "@weezy/prisma";
import { Workflow } from "@weezy/workflow";
import { executeWorkflow } from "@weezy/core";
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

    const definition = workflowData.definition as any;

    const workflow = new Workflow({
      id: workflowData.id,
      name: workflowData.name,
      nodes: definition.nodes || [],
      connections: definition.connections || [],
      settings: definition.settings || { active: true },
    });

    // Execute workflow using the core engine
    // Pass the prisma client for execution tracking
    const result = await executeWorkflow(workflow, context, prisma);

    res.status(200).json({
      success: true,
      status: workflow.status,
      result,
    });
  } catch (error: any) {
    console.error("Workflow execution failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
