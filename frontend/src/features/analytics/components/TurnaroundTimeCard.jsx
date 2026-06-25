import { TrendingDown, Clock } from "lucide-react";
import { ANALYTICS_TURNAROUND } from "../../../utils/mockData.js";

export default function TurnaroundTimeCard() {
  const { averageDays, trend, trendLabel } = ANALYTICS_TURNAROUND;

  return (
    <div className="ethereal-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-manrope font-bold text-base text-forest-900 mb-1">
            Avg. Turnaround Time
          </h3>
          <p className="text-xs text-surface-500">
            Average time from submission to final approval
          </p>
        </div>
        <div className="p-2 rounded-xl bg-surface-100">
          <Clock className="w-5 h-5 text-forest-500" />
        </div>
      </div>

      <div className="flex items-end gap-4 mt-6">
        <div>
          <p className="font-manrope font-bold text-5xl text-forest-900 tracking-tight">
            {averageDays}
          </p>
          <p className="text-sm text-surface-500 mt-1">days</p>
        </div>

        <div className="flex items-center gap-1.5 mb-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-semibold">{Math.abs(trend)} days</span>
        </div>
      </div>

      <p className="text-xs text-emerald-600 mt-3">{trendLabel}</p>

      {/* Mini bar */}
      <div className="mt-6 bg-surface-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon to-forest-500 rounded-full transition-all duration-1000"
          style={{ width: `${(1 - averageDays / 7) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-surface-400">0 days</span>
        <span className="text-[10px] text-surface-400">7 days</span>
      </div>
    </div>
  );
}
