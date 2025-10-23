import { CreateWorkflowResult, NewWorkflowInput, WorkflowType } from "../../types/workflow.types";
import createWorkflow from "./workflow/create-workflow";
import getWorkflow from "./workflow/get-workflow";

export const rootResolver = {
  workflow: () => {
    return [
      {
        id: "1",
        name: "Sample Workflow",
        definition: { steps: ["start", "process", "end"] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  },

  createWorkflow: async ({input}: {input: NewWorkflowInput}) : Promise<CreateWorkflowResult> => {
    return await createWorkflow(input);
  }
};
