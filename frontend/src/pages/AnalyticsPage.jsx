import { useEffect, useMemo, useState } from "react";
import SpendByCategoryChart from "../features/analytics/components/SpendByCategoryChart.jsx";
import ApprovalRateChart from "../features/analytics/components/ApprovalRateChart.jsx";
import RiskScoreTrendChart from "../features/analytics/components/RiskScoreTrendChart.jsx";
import TurnaroundTimeCard from "../features/analytics/components/TurnaroundTimeCard.jsx";
import MonthlyVelocityChart from "../features/analytics/components/MonthlyVelocityChart.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import { getAnalytics } from "../api/analyticsService.js";
import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    byCategory: [],
    byUser: [],
    risk: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getAnalytics()
      .then((data) => {
        if (!active) return;
        setAnalytics({
          byCategory: data?.byCategory || [],
          byUser: data?.byUser || [],
          risk: data?.risk || [],
        });
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load analytics",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totals = useMemo(() => {
    const totalSpend = analytics.byCategory.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0,
    );
    const totalUsers = analytics.byUser.length;
    const totalEntries = analytics.byUser.reduce(
      (sum, item) => sum + Number(item.count || 0),
      0,
    );
    const approvedRisk = analytics.risk.find(
      (item) => item.risk_level === "LOW",
    );
    const approvalRate = totalEntries
      ? ((Number(approvedRisk?.count || 0) / totalEntries) * 100).toFixed(1)
      : "0.0";

    return {
      totalSpend,
      totalUsers,
      totalEntries,
      approvalRate,
    };
  }, [analytics]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-manrope font-bold text-2xl text-forest-900">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Comprehensive spending and approval insights
        </p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Spend"
          value={`$${totals.totalSpend.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          trend={0}
          icon={DollarSign}
        />
        <StatCard
          title="Active Employees"
          value={String(totals.totalUsers)}
          trend={0}
          icon={Users}
        />
        <StatCard
          title="Low-Risk Share"
          value={`${totals.approvalRate}%`}
          trend={0}
          icon={TrendingUp}
        />
        <StatCard
          title="Processed Claims"
          value={String(totals.totalEntries)}
          trend={0}
          icon={Activity}
        />
      </div>

      {loading && (
        <div className="ethereal-card text-sm text-surface-500">
          Loading analytics...
        </div>
      )}

      {!loading && error && (
        <div className="ethereal-card text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && analytics.byCategory.length === 0 && (
        <div className="ethereal-card text-sm text-surface-500">
          No analytics data yet. Submit and review a few expenses to populate
          charts.
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendByCategoryChart />
        <ApprovalRateChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskScoreTrendChart />
        <TurnaroundTimeCard />
      </div>

      <MonthlyVelocityChart />
    </div>
  );
}
