import { DollarSign, TrendingUp, PieChart } from "lucide-react";
import StatCard from "../../../components/ui/StatCard.jsx";
import ApprovalQueue from "./ApprovalQueue.jsx";
import MonthlyVelocityChart from "../../analytics/components/MonthlyVelocityChart.jsx";
import EfficiencyDonut from "../../analytics/components/EfficiencyDonut.jsx";

export default function ManagerDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-manrope font-bold text-2xl text-forest-900">
          Manager Overview
        </h1>
        <p className="text-sm text-surface-500 mt-1 max-w-xl">
          Review and approve pending reimbursements for the Global Expansion team. Audit duplicate claims with AI insights.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Pending"
          value="$14,290"
          trend={12}
          trendLabel="+12% from last week"
          icon={DollarSign}
        />

        <StatCard
          title="Team Spending"
          variant="neon"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-manrope font-bold text-white">Monthly Velocity</span>
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Live Data
            </span>
          </div>
          <MonthlyVelocityChart mini />
        </StatCard>

        <div className="rounded-2xl bg-white p-6 flex flex-col items-center justify-center" style={{ boxShadow: "0 1px 3px rgba(26, 77, 46, 0.04)" }}>
          <EfficiencyDonut value={70} />
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mt-3">
            Efficiency
          </p>
          <p className="text-xs text-surface-400 mt-0.5">Approved vs Pending</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Pending Queue */}
        <div>
          <ApprovalQueue />
        </div>

        {/* Activity Insights Sidebar */}
        <div className="space-y-4">
          <div className="ethereal-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-neon/10">
                <TrendingUp className="w-4 h-4 text-forest-500" />
              </div>
              <h3 className="font-manrope font-bold text-sm text-forest-900">
                Activity Insights
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-6 bg-blue-500 rounded-full" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                    Global Travel
                  </p>
                </div>
                <p className="text-sm text-forest-900 pl-3">
                  Increased flight bookings for Q4 conferences
                </p>
              </div>

              <div className="bg-surface-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-neon/10">
                    <TrendingUp className="w-3.5 h-3.5 text-forest-500" />
                  </div>
                  <p className="text-xs font-bold text-forest-900">AI Assistant</p>
                </div>
                <p className="text-xs text-surface-500 leading-relaxed">
                  I've scanned the last 7 days of expenses. No duplicate claims found, but 2 meals exceed the regional cap.
                </p>
              </div>
            </div>
          </div>

          <button className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-forest-500 hover:text-neon-700 ethereal-card transition-colors">
            View Full Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}
