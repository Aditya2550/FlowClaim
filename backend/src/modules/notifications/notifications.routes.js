import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import {
  myNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./notifications.controller.js";

const router = Router();
router.use(authenticate);
router.get("/me", myNotifications);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", markNotificationRead);

export default router;
