import { Router } from "express";
import getWorkflowController from "../controller/workflow/get-workflow";
import executeWorkflowController from "../controller/workflow/execute-workflow";

const router = Router();

router.get("/", getWorkflowController);
router.post("/:id/execute", executeWorkflowController);
// router.delete("/:id", );
// router.put("/:id", );

export default router;
