import { CreateWorkflowResult, NewWorkflowInput, WorkflowType } from "../../types/workflow.types";
import createWorkflow from "./workflow/create-workflow";
import getWorkflow from "./workflow/get-workflow";

export const rootResolver = {
  workflow: async () : Promise<WorkflowType[]> => {
    const workflow = await getWorkflow();
    return workflow;
  },

  createWorkflow: async ({input}: {input: NewWorkflowInput}) : Promise<CreateWorkflowResult> => {
    return await createWorkflow(input);
  }
};
