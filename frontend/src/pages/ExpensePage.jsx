import { useState } from "react";
import ExpenseForm from "../features/expense/components/ExpenseForm.jsx";
import ExpenseList from "../features/expense/components/ExpenseList.jsx";

export default function ExpensePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-manrope font-bold text-2xl text-forest-900">
          Submit Expense
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Create a new reimbursement claim
        </p>
      </div>

      <div className="ethereal-card">
        <ExpenseForm onSubmitted={() => setRefreshKey((prev) => prev + 1)} />
      </div>

      <ExpenseList refreshKey={refreshKey} />
    </div>
  );
}
