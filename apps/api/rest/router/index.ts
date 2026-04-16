import { Router } from "express";
import workflow from "./workflow";

const router = Router();

router.use("/workflows", workflow);

export default router;
