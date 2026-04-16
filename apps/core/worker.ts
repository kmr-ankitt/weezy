import { Worker } from "bullmq";
import { connection, WorkflowJobData } from "./engine/queue";
import { prisma } from "@weezy/prisma";
import { Workflow } from "@weezy/workflow";
import { executeWorkflow } from "./engine";
import * as dotenv from "dotenv";

dotenv.config({ path: "../prisma/.env" });

console.log("👷 Starting Workflow Worker...");

const worker = new Worker<WorkflowJobData>(
  "workflow-queue",
  async (job) => {
    const { workflowId, executionId, context } = job.data;
    console.log(
      `\n📦 [Job ${job.id}] Processing execution ${executionId} (Workflow: ${workflowId})`,
    );

    try {
      const workflowData = await prisma.workflow.findUnique({
        where: { id: workflowId },
      });

      if (!workflowData) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      const definition = workflowData.definition as any;

      const workflow = new Workflow({
        id: workflowData.id,
        name: workflowData.name,
        nodes: definition.nodes || [],
        connections: definition.connections || [],
        settings: definition.settings || { active: true },
      });

      // Execute workflow, passing the existing executionId
      await executeWorkflow(workflow, context, prisma, executionId);

      console.log(`✅ [Job ${job.id}] Completed successfully.`);
    } catch (error: any) {
      console.error(`❌ [Job ${job.id}] Failed:`, error.message);
      throw error;
    }
  },
  {
    connection,
    concurrency: 5, // Process up to 5 workflows in parallel
  },
);

worker.on("ready", () => {
  console.log("🚀 Workflow Worker is ready and listening for jobs!");
});

worker.on("failed", (job, err) => {
  console.error(`⚠️ Job ${job?.id} permanently failed: ${err.message}`);
});

process.on("SIGTERM", async () => {
  console.log("Stopping worker...");
  await worker.close();
  process.exit(0);
});
