import { Link } from "react-router-dom";
import StatCard from "../../../components/ui/StatCard.jsx";
import SpendByCategoryChart from "./SpendByCategoryChart.jsx";
import ApprovalRateChart from "./ApprovalRateChart.jsx";
import { BarChart3, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-manrope font-bold text-2xl text-forest-900">
          Admin Overview
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Company-wide expense management summary
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Employees"
          value="47"
          trend={5}
          icon={Users}
        />
        <StatCard
          title="Monthly Spend"
          value="$14,290"
          trend={12}
          icon={BarChart3}
          variant="neon"
        />
        <StatCard
          title="Efficiency"
          value="91.4%"
          trend={2.1}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendByCategoryChart />
        <ApprovalRateChart />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/analytics"
          className="ethereal-card flex items-center justify-between hover:scale-[1.01] transition-transform"
        >
          <div>
            <p className="font-manrope font-bold text-sm text-forest-900">
              Full Analytics Dashboard
            </p>
            <p className="text-xs text-surface-500 mt-0.5">
              Detailed charts and spending insights
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-surface-400" />
        </Link>
        <Link
          to="/admin"
          className="ethereal-card flex items-center justify-between hover:scale-[1.01] transition-transform"
        >
          <div>
            <p className="font-manrope font-bold text-sm text-forest-900">
              Approval Workflow Settings
            </p>
            <p className="text-xs text-surface-500 mt-0.5">
              Configure rules, thresholds, and approvers
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-surface-400" />
        </Link>
      </div>
    </div>
  );
}
