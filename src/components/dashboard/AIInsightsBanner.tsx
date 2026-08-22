import React from "react";
import { useHR } from "../../context/HRContext";
import { Sparkles, ArrowRight, UserCheck, CalendarDays, Briefcase, DollarSign } from "lucide-react";

export const AIInsightsBanner: React.FC = () => {
  const { setActiveTab } = useHR();

  const insights = [
    {
      id: "ai-ins-1",
      category: "Attendance Insight",
      text: "Engineering attendance experienced a 4.2% dip during the active release sprint.",
      icon: UserCheck,
      color: "amber",
      action: "Review Attendance",
      tab: "attendance",
      filter: "Engineering",
    },
    {
      id: "ai-ins-2",
      category: "Leave Insight",
      text: "50% of pending leave requests are concentrated in the Engineering team.",
      icon: CalendarDays,
      color: "blue",
      action: "Review Leaves",
      tab: "leave",
      filter: "Pending",
    },
    {
      id: "ai-ins-3",
      category: "Recruitment Insight",
      text: "AI / ML Platform Engineer role has accumulated 24 applicants with high technical match.",
      icon: Briefcase,
      color: "indigo",
      action: "View Pipeline",
      tab: "recruitment",
    },
    {
      id: "ai-ins-4",
      category: "Payroll Insight",
      text: "Monthly payroll expenditure increased by +1.8% following two senior technical additions.",
      icon: DollarSign,
      color: "emerald",
      action: "Inspect Payroll",
      tab: "payroll",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 border border-blue-800/40 shadow-md relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                NEXA AI Executive Telemetry
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30">
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Autonomous workforce signals generated from live HR database records.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("ai")}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur transition-all cursor-pointer"
        >
          <span>Open AI Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 relative z-10">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.tab, item.filter)}
              className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 hover:border-blue-400/40 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 rounded bg-blue-500/20 text-blue-300">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-300 tracking-wide uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed group-hover:text-white">
                  {item.text}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-medium text-blue-400 group-hover:text-blue-300">
                <span>{item.action}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
