import { pool } from "../../config/db.js";
import { notificationsModel } from "../notifications/notifications.model.js";
import { notifyUser } from "../../services/notification.service.js";
import {
  getApprovalTimeline,
  getCurrentPendingApprover,
  getPendingApprovers,
  initializeApprovalSteps,
  processApproval,
} from "../../services/approvalEngine.js";
import { expensesModel } from "./expenses.model.js";

function fail(res, status, error) {
  return res.status(status).json({ success: false, error });
}

function ok(res, status, data) {
  return res.status(status).json({ success: true, data });
}

async function convertUsingExchangeRateApi(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: Number(amount), rate: 1 };
  }

  const source = String(fromCurrency).toUpperCase();
  const target = String(toCurrency).toUpperCase();
  const res = await fetch(`https://open.er-api.com/v6/latest/${source}`);
  const data = await res.json();

  if (!res.ok || data?.result !== "success" || !data?.rates?.[target]) {
    throw new Error("Currency conversion unavailable");
  }

  const rate = Number(data.rates[target]);
  return {
    rate,
    convertedAmount: Number((Number(amount) * rate).toFixed(2)),
  };
}

export async function createExpense(req, res) {
  try {
    if (String(req.user.role).toLowerCase() !== "employee") {
      return fail(res, 403, "Only employees can submit expenses");
    }

    const { amount, currency, category, vendor, description, receipt_url } =
      req.body;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const submitter = await expensesModel.findUserById(
        req.user.userId,
        client,
      );
      if (!submitter || submitter.company_id !== req.user.companyId) {
        await client.query("ROLLBACK");
        return fail(res, 403, "User does not belong to this company");
      }

      const company = await expensesModel.findCompanyBaseCurrency(
        req.user.companyId,
        client,
      );
      if (!company) {
        await client.query("ROLLBACK");
        return fail(res, 404, "Company not found");
      }

      const conversion = await convertUsingExchangeRateApi(
        amount,
        currency,
        company.currency,
      );

      const expense = await expensesModel.insertExpense(
        {
          userId: req.user.userId,
          companyId: req.user.companyId,
          amount: Number(amount),
          currency: String(currency).toUpperCase(),
          convertedAmount: conversion.convertedAmount,
          baseCurrency: String(company.currency).toUpperCase(),
          category,
          vendor: vendor || null,
          description: description || null,
          receiptUrl: receipt_url || null,
        },
        client,
      );

      await initializeApprovalSteps(expense.id, req.user.companyId, client);

      await client.query("COMMIT");

      const created = await expensesModel.getExpenseWithSteps(expense.id);
      return ok(res, 201, created);
    } catch (error) {
      await client.query("ROLLBACK");
      return fail(res, 500, error.message || "Failed to create expense");
    } finally {
      client.release();
    }
  } catch (error) {
    return fail(res, 500, error.message || "Failed to create expense");
  }
}

export async function listExpenses(req, res) {
  try {
    const role = String(req.user.role || "").toLowerCase();
    if (
      !["employee", "manager", "admin", "director", "finance"].includes(role)
    ) {
      return fail(res, 403, "Not allowed");
    }

    const status = req.query.status
      ? String(req.query.status).toLowerCase()
      : undefined;
    if (status && !["pending", "approved", "rejected"].includes(status)) {
      return fail(res, 400, "Invalid status filter");
    }

    const rows = await expensesModel.listExpenses({
      userId: req.user.userId,
      companyId: req.user.companyId,
      role,
      status,
    });

    return ok(res, 200, rows);
  } catch (error) {
    return fail(res, 500, error.message || "Failed to fetch expenses");
  }
}

export async function listPendingForApprover(req, res) {
  try {
    const role = String(req.user.role || "").toLowerCase();
    if (!["manager", "admin", "director", "finance"].includes(role)) {
      return fail(
        res,
        403,
        "Only director/finance/admin/manager can view pending approvals",
      );
    }

    const rows = await expensesModel.listPendingForApprover({
      userId: req.user.userId,
      companyId: req.user.companyId,
    });

    return ok(res, 200, rows);
  } catch (error) {
    return fail(res, 500, error.message || "Failed to fetch pending approvals");
  }
}

export async function approveExpense(req, res) {
  try {
    const role = String(req.user.role || "").toLowerCase();
    if (!["manager", "admin", "director", "finance"].includes(role)) {
      return fail(
        res,
        403,
        "Only director/finance/admin/manager can approve expenses",
      );
    }

    const { id } = req.params;
    const { comment } = req.body;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const expense = await expensesModel.findExpenseForCompany(
        id,
        req.user.companyId,
        client,
      );
      if (!expense) {
        await client.query("ROLLBACK");
        return fail(res, 404, "Expense not found");
      }

      const engineResult = await processApproval(
        id,
        req.user.userId,
        "approved",
        comment,
        client,
      );

      await client.query("COMMIT");

      const nextApprover = await getCurrentPendingApprover(id, pool);
      if (nextApprover) {
        const note = await notificationsModel.create({
          userId: nextApprover.id,
          title: "Expense pending your approval",
          body: `An expense from your queue needs review.`,
        });
        notifyUser(nextApprover.id, note.rows[0]);
      } else {
        const note = await notificationsModel.create({
          userId: expense.user_id,
          title: "Expense approved",
          body: `Your expense has been fully approved.`,
        });
        notifyUser(expense.user_id, note.rows[0]);
      }

      const updated = await expensesModel.getExpenseWithSteps(id);
      const currentPendingApprover = await getCurrentPendingApprover(id, pool);
      const timeline = await getApprovalTimeline(id, pool);
      return ok(res, 200, {
        ...updated,
        engine: engineResult,
        currentPendingApprover,
        timeline,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.message === "Expense not found")
        return fail(res, 404, error.message);
      if (error.message === "Not your turn to approve")
        return fail(res, 403, error.message);
      if (error.message === "Expense already finalized")
        return fail(res, 400, error.message);
      return fail(res, 500, error.message || "Failed to approve expense");
    } finally {
      client.release();
    }
  } catch (error) {
    return fail(res, 500, error.message || "Failed to approve expense");
  }
}

export async function rejectExpense(req, res) {
  try {
    const role = String(req.user.role || "").toLowerCase();
    if (!["manager", "admin", "director", "finance"].includes(role)) {
      return fail(
        res,
        403,
        "Only director/finance/admin/manager can reject expenses",
      );
    }

    const { id } = req.params;
    const { comment } = req.body;
    if (!comment || !String(comment).trim()) {
      return fail(res, 400, "comment is required");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const expense = await expensesModel.findExpenseForCompany(
        id,
        req.user.companyId,
        client,
      );
      if (!expense) {
        await client.query("ROLLBACK");
        return fail(res, 404, "Expense not found");
      }

      const engineResult = await processApproval(
        id,
        req.user.userId,
        "rejected",
        String(comment).trim(),
        client,
      );

      await client.query("COMMIT");
      const note = await notificationsModel.create({
        userId: expense.user_id,
        title: "Expense rejected",
        body: `Your expense was rejected: ${String(comment).trim()}`,
      });
      notifyUser(expense.user_id, note.rows[0]);
      const updated = await expensesModel.getExpenseWithSteps(id);
      const currentPendingApprover = await getCurrentPendingApprover(id, pool);
      const timeline = await getApprovalTimeline(id, pool);
      return ok(res, 200, {
        ...updated,
        engine: engineResult,
        currentPendingApprover,
        timeline,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.message === "Expense not found")
        return fail(res, 404, error.message);
      if (error.message === "Not your turn to approve")
        return fail(res, 403, error.message);
      if (error.message === "Expense already finalized")
        return fail(res, 400, error.message);
      if (error.message === "Rejection comment is required")
        return fail(res, 400, error.message);
      return fail(res, 500, error.message || "Failed to reject expense");
    } finally {
      client.release();
    }
  } catch (error) {
    return fail(res, 500, error.message || "Failed to reject expense");
  }
}

export async function parseReceipt(req, res) {
  return fail(res, 501, "OCR feature not implemented");
}

export async function getExpenseApprovalStatus(req, res) {
  try {
    const { id } = req.params;
    const expense = await expensesModel.findExpenseForCompany(
      id,
      req.user.companyId,
      pool,
    );
    if (!expense) {
      return fail(res, 404, "Expense not found");
    }

    const timeline = await getApprovalTimeline(id, pool);
    const pendingApprovers = await getPendingApprovers(id, pool);
    const approvedCount = timeline.filter(
      (step) => step.status === "approved",
    ).length;
    const totalSteps = timeline.length;
    const currentStep = pendingApprovers[0]?.sequence || null;

    return ok(res, 200, {
      currentStep,
      totalSteps,
      approvedCount,
      pendingApprovers,
      timeline,
    });
  } catch (error) {
    return fail(res, 500, error.message || "Failed to fetch approval status");
  }
}
