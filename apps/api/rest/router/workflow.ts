import { Router } from "express";
import getWorkflowController from "../controller/workflow/get-workflow";
import createWorkflowController from "../controller/workflow/create-workflow";
import executeWorkflowController from "../controller/workflow/execute-workflow";
import getExecutionController from "../controller/workflow/get-execution";

import getOneWorkflowController from "../controller/workflow/get-one-workflow";
import updateWorkflowController from "../controller/workflow/update-workflow";

const router = Router();

router.get("/", getWorkflowController);
router.get("/:id", getOneWorkflowController);
router.post("/", createWorkflowController);
router.put("/:id", updateWorkflowController);
router.post("/:id/execute", executeWorkflowController);
router.get("/executions/:id", getExecutionController);

export default router;
