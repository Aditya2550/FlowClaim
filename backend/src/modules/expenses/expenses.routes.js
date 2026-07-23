import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  createExpenseSchema,
  approveRejectSchema,
  listExpensesQuerySchema,
} from "./expenses.validator.js";
import {
  approveExpense,
  createExpense,
  getExpenseApprovalStatus,
  listExpenses,
  listPendingForApprover,
  parseReceipt,
  rejectExpense,
} from "./expenses.controller.js";

const router = Router();
router.use(authenticate);

router.post(
  "/",
  authorize("employee"),
  validateRequest(createExpenseSchema),
  createExpense,
);
router.get(
  "/",
  authorize("employee", "manager", "admin", "director", "finance"),
  validateRequest(listExpensesQuerySchema),
  listExpenses,
);
router.get(
  "/pending",
  authorize("manager", "admin", "director", "finance"),
  listPendingForApprover,
);
router.get(
  "/:id/approval-status",
  authorize("employee", "manager", "admin", "director", "finance"),
  getExpenseApprovalStatus,
);
router.patch(
  "/:id/approve",
  authorize("manager", "finance", "director", "admin"),
  validateRequest(approveRejectSchema),
  approveExpense,
);
router.patch(
  "/:id/reject",
  authorize("manager", "finance", "director", "admin"),
  validateRequest(approveRejectSchema),
  rejectExpense,
);
router.post("/ocr", parseReceipt);

export default router;
