import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";
import { summary } from "./analytics.controller.js";

const router = Router();
router.use(authenticate);
router.get("/summary", authorizeRole("ADMIN", "MANAGER"), summary);

export default router;
