import { Clock } from "lucide-react";

export default function TurnaroundTimeCard({ avgDays = 0 }) {
  const days = Number(avgDays || 0);

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
            {days}
          </p>
          <p className="text-sm text-surface-500 mt-1">days</p>
        </div>
      </div>

      <div className="mt-6 bg-surface-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon to-forest-500 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min((1 - days / 7) * 100, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-surface-400">0 days</span>
        <span className="text-[10px] text-surface-400">7 days</span>
      </div>
    </div>
  );
}