import * as dotenv from "dotenv";
import { prisma } from "./client";

dotenv.config();

// Start connection after a delay to sync databse startup
setTimeout(() => {
  prisma
    .$connect()
    .then(() => {
      console.log("Connected to the database successfully.");
    })
    .catch((error: any) => {
      console.error("Error connecting to the database:", error);
    });
}, 5000);
export { prisma, PrismaClient } from "./client";
