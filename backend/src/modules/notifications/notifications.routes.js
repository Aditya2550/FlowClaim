import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { myNotifications } from "./notifications.controller.js";

const router = Router();
router.use(authenticate);
router.get("/me", myNotifications);

export default router;
