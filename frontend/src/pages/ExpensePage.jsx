import { useState } from "react";
import ExpenseForm from "../features/expense/components/ExpenseForm.jsx";
import ExpenseList from "../features/expense/components/ExpenseList.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function ExpensePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { push } = useNotifications();

  function handleSubmitted() {
    setRefreshKey((prev) => prev + 1);
    push({
      title: "Expense submitted",
      body: "Your expense was submitted for approval.",
    });
  }

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
        <ExpenseForm onSubmitted={handleSubmitted} />
      </div>

      <ExpenseList refreshKey={refreshKey} />
    </div>
  );
}