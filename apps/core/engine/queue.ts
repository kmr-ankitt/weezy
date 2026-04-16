import { Queue, ConnectionOptions } from "bullmq";
import Redis from "ioredis";
import * as dotenv from "dotenv";
// Load env from prisma if possible
dotenv.config({ path: "../../prisma/.env" });

const redisOptions: ConnectionOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

export const connection = new Redis({
  ...redisOptions,
  maxRetriesPerRequest: null,
});

export const workflowQueue = new Queue("workflow-queue", {
  connection,
});

export interface WorkflowJobData {
  workflowId: string;
  executionId: string;
  context?: any;
}
