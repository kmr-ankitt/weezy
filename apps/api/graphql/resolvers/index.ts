import { CreateWorkflowResult, NewWorkflowInput, WorkflowType, UpdateWorkflowInput, UpdateWorkflowResult, DeleteWorkflowResult, GetWorkflowByIdResult } from "../../types/workflow.types";
import createWorkflow from "./workflow/create-workflow";
import deleteWorkflow from "./workflow/delete-workflow";
import getWorkflow from "./workflow/get-workflow";
import getWorkflowById from "./workflow/get-workflow-by-id";
import updateWorkflow from "./workflow/update-workflow";

export const rootResolver = {
  workflow: async (): Promise<WorkflowType[]> => {
    const workflow = await getWorkflow();
    return workflow;
  },

  createWorkflow: async ({ input }: { input: NewWorkflowInput }): Promise<CreateWorkflowResult> => {
    return await createWorkflow(input);
  },
  
  updateWorkflow: async ({ input }: { input: UpdateWorkflowInput }): Promise<UpdateWorkflowResult> => {
    return await updateWorkflow(input);
  },
  
  deleteWorkflow: async ({ id }: { id: string }): Promise<DeleteWorkflowResult> => {
    return await deleteWorkflow(id);
  },
  
  workflowById: async ({ id }: { id: string }): Promise<GetWorkflowByIdResult> => {
    const workflow = await getWorkflowById(id);
    return workflow;
  }
}
