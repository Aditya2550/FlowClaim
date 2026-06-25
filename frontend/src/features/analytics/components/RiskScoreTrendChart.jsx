import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const RISK_DATA = [
  { month: "Jun", low: 35, medium: 8, high: 2 },
  { month: "Jul", low: 30, medium: 12, high: 4 },
  { month: "Aug", low: 42, medium: 6, high: 1 },
  { month: "Sep", low: 38, medium: 9, high: 3 },
  { month: "Oct", low: 50, medium: 7, high: 2 },
  { month: "Nov", low: 45, medium: 5, high: 1 },
];

export default function RiskScoreTrendChart() {
  return (
    <div className="ethereal-card">
      <h3 className="font-manrope font-bold text-base text-forest-900 mb-1">
        Risk Score Trend
      </h3>
      <p className="text-xs text-surface-500 mb-6">
        AI risk level distribution over time
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={RISK_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eff1f0" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#999", fontFamily: "Inter" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#999", fontFamily: "Inter" }}
          />
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
          />
          <Line
            type="monotone"
            dataKey="low"
            stroke="#00FF66"
            strokeWidth={2.5}
            dot={{ fill: "#00FF66", r: 4 }}
            name="Low Risk"
          />
          <Line
            type="monotone"
            dataKey="medium"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: "#F59E0B", r: 3 }}
            name="Medium Risk"
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ fill: "#EF4444", r: 3 }}
            name="High Risk"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
