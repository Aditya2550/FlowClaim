import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import {
    approveExpense,
    createExpense,
    getExpenseApprovalStatus,
    listExpenses,
    listPendingForApprover,
    parseReceipt,
    rejectExpense
} from "./expenses.controller.js";

const router = Router();
router.use(authenticate);

router.post("/", authorize("employee"), createExpense);
router.get("/", authorize("employee", "manager", "admin"), listExpenses);
router.get("/pending", authorize("manager", "admin"), listPendingForApprover);
router.get("/:id/approval-status", authorize("employee", "manager", "admin"), getExpenseApprovalStatus);
router.patch("/:id/approve", authorize("manager", "admin"), approveExpense);
router.patch("/:id/reject", authorize("manager", "admin"), rejectExpense);
router.post("/ocr", parseReceipt);

export default router;
