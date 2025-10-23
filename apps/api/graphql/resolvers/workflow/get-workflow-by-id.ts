import { prisma } from "@weezy/prisma";
import { GetWorkflowByIdResult } from "../../../types/workflow.types";

export default async function getWorkflowById(id: string) : Promise<GetWorkflowByIdResult>{
  try{
    const workflow = await prisma.workflow.findUnique({
      where: {
        id
      }
    });
    
    if(!workflow){
      return {
        success: false,
        error: "No workflow found"
      }
    }
    
    return {
      success: true,
      workflow
    }
  } catch(error){
    console.log("Failed to fetch workflow", error);
    return {
      success: false,
      error: "Failed to fetch workflow"
    }
  }
}