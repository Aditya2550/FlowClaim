import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#1A4D2E", "#00FF66", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"];

export default function SpendByCategoryChart({ data = [] }) {
  const chartData = data.map((item, index) => ({
    name: item.category,
    value: Number(item.total || 0),
    color: COLORS[index % COLORS.length],
  }));

  if (chartData.length === 0) {
    return (
      <div className="ethereal-card">
        <h3 className="font-manrope font-bold text-base text-forest-900 mb-1">
          Spend by Category
        </h3>
        <p className="text-xs text-surface-500">No category data yet.</p>
      </div>
    );
  }

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
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
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
            wrapperStyle={{ fontSize: "12px", fontFamily: "Inter", color: "#666" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}