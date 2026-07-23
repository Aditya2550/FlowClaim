import { Router } from "express";
import { login, logout, me, register } from "./auth.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
