import { z } from "zod";

const ALLOWED_CATEGORIES = ["Travel", "Food", "Office", "Other"];

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().min(3).max(3),
    category: z.enum(ALLOWED_CATEGORIES),
    vendor: z.string().optional(),
    description: z.string().optional(),
    receipt_url: z.string().url().optional(),
  }),
});

export const approveRejectSchema = z.object({
  body: z.object({
    comment: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const listExpensesQuerySchema = z.object({
  query: z.object({
    status: z.enum(["pending", "approved", "rejected"]).optional(),
  }),
});
