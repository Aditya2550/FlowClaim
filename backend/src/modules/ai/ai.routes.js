import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { score } from "./ai.controller.js";

const router = Router();
router.use(authenticate);
router.post("/risk-score", score);

export default router;
