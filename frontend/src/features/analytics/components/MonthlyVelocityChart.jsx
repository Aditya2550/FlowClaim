import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function MonthlyVelocityChart({ data = [], mini = false }) {
  const chartData = data.map((item) => ({
    day: item.day,
    amount: Number(item.amount || 0),
  }));

  if (mini) {
    return (
      <ResponsiveContainer width="100%" height={60}>
        <BarChart data={chartData} barSize={16}>
          <Bar dataKey="amount" fill="rgba(255,255,255,0.4)" radius={[4, 4, 0, 0]} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: "rgba(255,255,255,0.5)", fontFamily: "Manrope" }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="ethereal-card">
      <h3 className="font-manrope font-bold text-base text-forest-900 mb-1">
        Monthly Velocity
      </h3>
      <p className="text-xs text-surface-500 mb-6">
        Daily spending velocity, last 30 days
      </p>

      {chartData.length === 0 ? (
        <p className="text-sm text-surface-500">No recent activity.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barSize={32}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#999", fontFamily: "Inter" }} />
            <Tooltip
              contentStyle={{
                background: "white", border: "none", borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(26, 77, 46, 0.1)", padding: "10px 14px",
                fontSize: "13px", fontFamily: "Inter",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, "Spend"]}
            />
            <Bar dataKey="amount" fill="#1A4D2E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}