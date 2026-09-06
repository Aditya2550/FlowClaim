import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export default function RiskScoreTrendChart({ data = [] }) {
  const chartData = data.map((item) => ({
    month: item.month,
    low: Number(item.low || 0),
    medium: Number(item.medium || 0),
    high: Number(item.high || 0),
  }));

  return (
    <div className="ethereal-card">
      <h3 className="font-manrope font-bold text-base text-forest-900 mb-1">
        Risk Score Trend
      </h3>
      <p className="text-xs text-surface-500 mb-6">
        Risk level distribution over time
      </p>

      {chartData.length === 0 ? (
        <p className="text-sm text-surface-500">No trend data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eff1f0" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#999", fontFamily: "Inter" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#999", fontFamily: "Inter" }} />
            <Tooltip
              contentStyle={{
                background: "white", border: "none", borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(26, 77, 46, 0.1)", padding: "10px 14px",
                fontSize: "13px", fontFamily: "Inter",
              }}
            />
            <Line type="monotone" dataKey="low" stroke="#00FF66" strokeWidth={2.5} dot={{ fill: "#00FF66", r: 4 }} name="Low Risk" />
            <Line type="monotone" dataKey="medium" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} name="Medium Risk" />
            <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 3 }} name="High Risk" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}