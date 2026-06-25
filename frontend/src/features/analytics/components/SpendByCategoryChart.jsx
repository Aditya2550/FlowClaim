import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ANALYTICS_CATEGORY_SPEND } from "../../../utils/mockData.js";

export default function SpendByCategoryChart() {
  return (
    <div className="ethereal-card">
      <h3 className="font-manrope font-bold text-base text-forest-900 mb-1">
        Spend by Category
      </h3>
      <p className="text-xs text-surface-500 mb-6">
        Aggregated expenses by category this quarter
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={ANALYTICS_CATEGORY_SPEND}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {ANALYTICS_CATEGORY_SPEND.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "white",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(26, 77, 46, 0.1)",
              padding: "10px 14px",
              fontSize: "13px",
              fontFamily: "Inter",
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, "Spend"]}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: "12px",
              fontFamily: "Inter",
              color: "#666",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
