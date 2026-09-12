import { z } from "zod";

const ALLOWED_CATEGORIES = ["Travel", "Food", "Office", "Other"];

const confidenceSchema = z.object({
  vendor: z.number().min(0).max(1),
  amount: z.number().min(0).max(1),
  currency: z.number().min(0).max(1),
  date: z.number().min(0).max(1),
  category: z.number().min(0).max(1),
});

export const ocrResponseSchema = z.object({
  vendor: z.string().nullable(),
  amount: z.number().positive().nullable(),
  currency: z.string().length(3).nullable(),
  date: z.string().nullable(),
  category: z.enum(ALLOWED_CATEGORIES).nullable(),
  gst: z.number().nullable(),
  invoiceNumber: z.string().nullable(),
  paymentMethod: z.string().nullable(),
  confidence: confidenceSchema,
});

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().min(3).max(3),
    category: z.enum(ALLOWED_CATEGORIES),
    vendor: z.string().optional(),
    description: z.string().optional(),
    receipt_url: z.string().url().nullable().optional(),
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
