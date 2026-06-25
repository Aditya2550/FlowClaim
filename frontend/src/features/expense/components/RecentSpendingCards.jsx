import { RECENT_EXPENSES, CATEGORIES } from "../../../utils/mockData.js";
import { ArrowRight } from "lucide-react";

const CATEGORY_COLORS = {
  dining: { bg: "bg-amber-50", tag: "bg-amber-100 text-amber-700" },
  travel: { bg: "bg-blue-50", tag: "bg-blue-100 text-blue-700" },
  supplies: { bg: "bg-purple-50", tag: "bg-purple-100 text-purple-700" },
  tech: { bg: "bg-cyan-50", tag: "bg-cyan-100 text-cyan-700" },
  operations: { bg: "bg-emerald-50", tag: "bg-emerald-100 text-emerald-700" },
  transport: { bg: "bg-pink-50", tag: "bg-pink-100 text-pink-700" },
};

export default function RecentSpendingCards() {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RECENT_EXPENSES.map((expense) => {
          const cat = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.tech;
          const categoryLabel = CATEGORIES.find((c) => c.id === expense.category)?.label || expense.category;

          return (
            <div
              key={expense.id}
              className="ethereal-card hover:scale-[1.02] cursor-pointer group"
            >
              {/* Category Image Area */}
              <div className={`${cat.bg} rounded-xl h-36 flex items-center justify-center mb-4 relative overflow-hidden`}>
                <div className="text-4xl opacity-30 group-hover:opacity-50 transition-opacity">
                  {expense.category === "dining" && "🍽️"}
                  {expense.category === "travel" && "✈️"}
                  {expense.category === "supplies" && "📦"}
                  {expense.category === "tech" && "💻"}
                  {expense.category === "operations" && "⚙️"}
                </div>
                <span className={`absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${cat.tag}`}>
                  {categoryLabel}
                </span>
              </div>

              {/* Details */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-manrope font-bold text-sm text-forest-900">
                    {expense.title}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {expense.description}
                  </p>
                </div>
                <p className="font-manrope font-bold text-base text-forest-900">
                  ${expense.amount.toFixed(2)}
                </p>
              </div>

              {/* Time badge */}
              <div className="mt-3 flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  expense.status === "APPROVED" ? "bg-neon" : "bg-amber-400"
                }`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                  {expense.timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
