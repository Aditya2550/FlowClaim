import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ANALYTICS_APPROVAL_RATE } from "../../../utils/mockData.js";

export default function ApprovalRateChart() {
  return (
    <div className="ethereal-card">
      <h3 className="font-manrope font-bold text-base text-forest-900 mb-1">
        Approval Rate
      </h3>
      <p className="text-xs text-surface-500 mb-6">
        Monthly approved vs rejected expenses
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={ANALYTICS_APPROVAL_RATE} barGap={4}>
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
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", fontFamily: "Inter" }}
          />
          <Bar
            dataKey="approved"
            fill="#00FF66"
            radius={[6, 6, 0, 0]}
            name="Approved"
          />
          <Bar
            dataKey="rejected"
            fill="#f87171"
            radius={[6, 6, 0, 0]}
            name="Rejected"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
