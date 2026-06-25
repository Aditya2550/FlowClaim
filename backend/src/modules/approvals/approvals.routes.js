import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";
import { managerQueue, takeAction, breadcrumb } from "./approvals.controller.js";

const router = Router();
router.use(authenticate);
router.get("/queue", authorizeRole("MANAGER", "ADMIN"), managerQueue);
router.post("/:expenseId/action", authorizeRole("MANAGER", "ADMIN"), takeAction);
router.get("/:expenseId/breadcrumbs", breadcrumb);

export default router;
