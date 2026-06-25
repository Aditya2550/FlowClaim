import { Router } from "express";
import { bootstrapCompanyAndAdmin } from "./companies.controller.js";

const router = Router();
router.post("/bootstrap", bootstrapCompanyAndAdmin);

export default router;
