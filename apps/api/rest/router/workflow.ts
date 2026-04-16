import { Router } from "express";
import getWorkflowController from "../controller/workflow/get-workflow";
import createWorkflowController from "../controller/workflow/create-workflow";
import executeWorkflowController from "../controller/workflow/execute-workflow";

const router = Router();

router.get("/", getWorkflowController);
router.post("/", createWorkflowController);
router.post("/:id/execute", executeWorkflowController);
// router.delete("/:id", );
// router.put("/:id", );

export default router;
