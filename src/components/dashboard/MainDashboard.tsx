import React from "react";
import { useHR } from "../../context/HRContext";
import { KPICardsGrid } from "./KPICardsGrid";
import { CommandCenterSection } from "./CommandCenterSection";
import { AIInsightsBanner } from "./AIInsightsBanner";
import { ChartsSection } from "./ChartsSection";
import { Calendar, Sparkles, UserPlus } from "lucide-react";

export const MainDashboard: React.FC = () => {
  const { currentUser, setActiveTab } = useHR();

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Workforce Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Real-time operational metrics, talent distribution, and action queues.
          </p>
        </div>

        {/* Right date & Quick Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{todayStr}</span>
          </div>

          <button
            onClick={() => setActiveTab("ai")}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold border border-slate-700 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>NEXA AI Brief</span>
          </button>
        </div>
      </div>

      {/* 1. Top 8 KPI Metric Cards Grid */}
      <KPICardsGrid />

      {/* 2. HR Command Center (Triage Feed) */}
      <CommandCenterSection />

      {/* 3. AI Generated Insights Banner */}
      <AIInsightsBanner />

      {/* 4. Interactive Visualizations & Live Queues */}
      <ChartsSection />
    </div>
  );
};
