import { Router } from "express";
import getWorkflowController from "../controller/workflow/get-workflow";

const router = Router();

router.get("/", getWorkflowController);
// router.post("/", );
// router.delete("/:id", );
// router.put("/:id", );

export default router;