export function scoreExpenseRisk(expense) {
  let score = 10;
  if (Number(expense.amount_company || 0) > 50000) score += 45;
  if (expense.category === "Other") score += 10;
  if (!expense.receipt_url) score += 20;
  return { score, label: score >= 60 ? "HIGH" : score >= 30 ? "MEDIUM" : "LOW" };
}
