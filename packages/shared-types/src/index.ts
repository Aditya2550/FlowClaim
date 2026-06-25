export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface Expense {
  id: number;
  title: string;
  category: string;
  amountOriginal: number;
  currencyOriginal: string;
  amountCompany: number;
  currencyCompany: string;
  status: "IN_REVIEW" | "APPROVED" | "REJECTED";
}
