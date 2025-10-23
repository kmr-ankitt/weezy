import { Router } from "express";
import workflow from "./workflow";

const router = Router();

router.use("/workflow", workflow)

export default router;