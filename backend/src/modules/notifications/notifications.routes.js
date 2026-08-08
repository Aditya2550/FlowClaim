import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import {
  myNotifications,
  markNotificationRead,
} from "./notifications.controller.js";

const router = Router();
router.use(authenticate);
router.get("/me", myNotifications);
router.patch("/:id/read", markNotificationRead);

export default router;
