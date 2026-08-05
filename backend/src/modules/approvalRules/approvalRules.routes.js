import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
  getCurrentRule,
  getRuleHistory,
  saveRule,
} from "./approvalRules.controller.js";

const router = Router();
router.use(authenticate);

router.get("/", authorize("admin"), getCurrentRule);
router.get("/history", authorize("admin"), getRuleHistory);
router.put("/", authorize("admin"), saveRule);

export default router;
