import { useEffect, useState } from "react";
import { getExpenses } from "../../../api/expenseService.js";
import { ArrowRight } from "lucide-react";

const CATEGORY_STYLE = {
  Travel: { bg: "bg-blue-50", tag: "bg-blue-100 text-blue-700", emoji: "✈️" },
  Food: { bg: "bg-amber-50", tag: "bg-amber-100 text-amber-700", emoji: "🍽️" },
  Office: { bg: "bg-purple-50", tag: "bg-purple-100 text-purple-700", emoji: "📦" },
  Other: { bg: "bg-cyan-50", tag: "bg-cyan-100 text-cyan-700", emoji: "💼" },
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function RecentSpendingCards() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getExpenses()
      .then((rows) => {
        if (!active) return;
        setExpenses((Array.isArray(rows) ? rows : []).slice(0, 3));
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-manrope font-bold text-lg text-forest-900">
            Recent Spending
          </h2>
          <p className="text-sm text-surface-500 mt-0.5">
            Review your latest submitted claims
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm text-forest-600 font-semibold hover:text-neon-700 transition-colors">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading && <p className="text-sm text-surface-500">Loading...</p>}
      {!loading && expenses.length === 0 && (
        <p className="text-sm text-surface-500">No expenses submitted yet.</p>
      )}

      {!loading && expenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {expenses.map((expense) => {
            const cat = CATEGORY_STYLE[expense.category] || CATEGORY_STYLE.Other;
            const amount = Number(expense.converted_amount || expense.amount || 0);
            const currency = expense.base_currency || expense.currency || "USD";

            return (
              <div key={expense.id} className="ethereal-card hover:scale-[1.02] cursor-pointer group">
                <div className={`${cat.bg} rounded-xl h-36 flex items-center justify-center mb-4 relative overflow-hidden`}>
                  <div className="text-4xl opacity-30 group-hover:opacity-50 transition-opacity">
                    {cat.emoji}
                  </div>
                  <span className={`absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${cat.tag}`}>
                    {expense.category}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-manrope font-bold text-sm text-forest-900">
                      {expense.vendor || "Expense"}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {expense.description || "-"}
                    </p>
                  </div>
                  <p className="font-manrope font-bold text-base text-forest-900">
                    {currency} {amount.toFixed(2)}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${
                    expense.status === "approved" ? "bg-neon" : "bg-amber-400"
                  }`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                    {timeAgo(expense.submitted_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}