import React from "react";
import { useHR } from "../../context/HRContext";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, ArrowRight, ShieldAlert } from "lucide-react";

export const CommandCenterSection: React.FC = () => {
  const { commandAlerts, setActiveTab } = useHR();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            HR Command Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational triage & bottleneck intelligence for immediate HR action.
          </p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          Live Feed
        </span>
      </div>

      {/* Grid of Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {commandAlerts.map((alert) => {
          const isCritical = alert.severity === "critical";
          const isAction = alert.severity === "action";
          const isMonitor = alert.severity === "monitor";

          return (
            <div
              key={alert.id}
              onClick={() => setActiveTab(alert.targetModule, alert.filterParam)}
              className={`p-4 border-l-4 rounded-r-lg transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                isCritical
                  ? "bg-red-50/60 dark:bg-red-950/20 border-red-500"
                  : isAction
                  ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-500"
                  : isMonitor
                  ? "bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-500"
                  : "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isCritical
                        ? "text-red-700 dark:text-red-400"
                        : isAction
                        ? "text-amber-700 dark:text-amber-400"
                        : isMonitor
                        ? "text-indigo-700 dark:text-indigo-400"
                        : "text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {alert.metric}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {alert.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {alert.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-semibold">
                <span
                  className={`${
                    isCritical
                      ? "text-red-700 dark:text-red-400"
                      : isAction
                      ? "text-amber-700 dark:text-amber-400"
                      : isMonitor
                      ? "text-indigo-700 dark:text-indigo-400"
                      : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {alert.actionText}
                </span>
                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
