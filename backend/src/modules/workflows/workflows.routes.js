import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";
import { upsertRules } from "./workflows.controller.js";

const router = Router();
router.use(authenticate);
router.put("/rules", authorizeRole("ADMIN"), upsertRules);

export default router;
