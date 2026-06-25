import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorizeRole } from "../../middleware/authorizeRole.js";
import { listUsers, switchRole } from "./users.controller.js";

const router = Router();
router.use(authenticate);
router.get("/", authorizeRole("ADMIN"), listUsers);
router.patch("/:id/role", authorizeRole("ADMIN"), switchRole);

export default router;
