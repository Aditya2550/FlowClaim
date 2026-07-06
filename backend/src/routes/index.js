import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import companyRoutes from "../modules/companies/companies.routes.js";
import expenseRoutes from "../modules/expenses/expenses.routes.js";
import approvalRoutes from "../modules/approvals/approvals.routes.js";
import workflowRoutes from "../modules/workflows/workflows.routes.js";
import analyticsRoutes from "../modules/analytics/analytics.routes.js";
import notificationRoutes from "../modules/notifications/notifications.routes.js";

//these are routes

const router = Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/companies", companyRoutes);
router.use("/expenses", expenseRoutes);
router.use("/approvals", approvalRoutes);
router.use("/workflows", workflowRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/notifications", notificationRoutes);

export default router;
