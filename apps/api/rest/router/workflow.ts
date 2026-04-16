import { Router } from "express";
import getWorkflowController from "../controller/workflow/get-workflow";
import createWorkflowController from "../controller/workflow/create-workflow";
import executeWorkflowController from "../controller/workflow/execute-workflow";
import getExecutionController from "../controller/workflow/get-execution";

const router = Router();

router.get("/", getWorkflowController);
router.post("/", createWorkflowController);
router.post("/:id/execute", executeWorkflowController);
router.get("/executions/:id", getExecutionController);
// router.delete("/:id", );
// router.put("/:id", );

export default router;
