import React from "react";
import { useHR } from "../../context/HRContext";
import {
  Users,
  UserCheck,
  CalendarDays,
  Briefcase,
  DollarSign,
  HeartHandshake,
  Clock,
  Inbox,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

export const KPICardsGrid: React.FC = () => {
  const {
    employees,
    departments,
    attendanceRecords,
    leaveRequests,
    jobOpenings,
    candidateApplications,
    payrollRecords,
    performanceReviews,
    setActiveTab,
  } = useHR();

  const totalEmployeesCount = employees.length;
  const presentTodayCount = attendanceRecords.filter((a) => a.status === "Present").length;
  const onLeaveTodayCount = attendanceRecords.filter((a) => a.status === "Leave").length;
  const lateTodayCount = attendanceRecords.filter((a) => a.status === "Late").length;
  const openPositionsCount = jobOpenings.filter((j) => j.status === "Active").length;
  const pendingRequestsCount = leaveRequests.filter((l) => l.status === "Pending").length;

  const totalPayrollAmount = payrollRecords.reduce((acc, curr) => acc + curr.netSalary, 0);
  const attendanceRate = Math.round(((presentTodayCount + lateTodayCount) / (totalEmployeesCount || 1)) * 100);

  const avgSatisfaction = performanceReviews.length > 0
    ? (performanceReviews.reduce((sum, r) => sum + r.overallRating, 0) / performanceReviews.length).toFixed(1)
    : (employees.reduce((sum, e) => sum + (e.performanceScore || 4.5), 0) / (employees.length || 1)).toFixed(1);

  const kpis = [
    {
      id: "total-employees",
      label: "Total Employees",
      value: totalEmployeesCount.toString(),
      subtext: `Across ${departments.length} departments`,
      trend: `${employees.filter(e => e.status === "Active").length} active`,
      isPositive: true,
      icon: Users,
      color: "blue",
      targetTab: "employees",
    },
    {
      id: "present-today",
      label: "Present Today",
      value: presentTodayCount.toString(),
      subtext: `${totalEmployeesCount - presentTodayCount - onLeaveTodayCount} late / absent`,
      trend: `${lateTodayCount} late entries`,
      isPositive: lateTodayCount === 0,
      icon: UserCheck,
      color: "emerald",
      targetTab: "attendance",
    },
    {
      id: "on-leave",
      label: "On Leave",
      value: onLeaveTodayCount.toString(),
      subtext: "Approved leave today",
      trend: `${pendingRequestsCount} pending approval`,
      isPositive: true,
      icon: CalendarDays,
      color: "amber",
      targetTab: "leave",
    },
    {
      id: "open-positions",
      label: "Open Positions",
      value: openPositionsCount.toString(),
      subtext: `${candidateApplications.length} candidates in funnel`,
      trend: `${candidateApplications.filter(c => c.stage === "Interview").length} in interviews`,
      isPositive: true,
      icon: Briefcase,
      color: "indigo",
      targetTab: "recruitment",
    },
    {
      id: "monthly-payroll",
      label: "Monthly Payroll",
      value: `$${totalPayrollAmount.toLocaleString()}`,
      subtext: `${payrollRecords[0]?.month || "Current Cycle"}`,
      trend: `${payrollRecords.length} payslips`,
      isPositive: true,
      icon: DollarSign,
      color: "cyan",
      targetTab: "payroll",
    },
    {
      id: "employee-satisfaction",
      label: "Satisfaction",
      value: `${avgSatisfaction} / 5.0`,
      subtext: `${performanceReviews.length} appraisals recorded`,
      trend: "+0.3 pt",
      isPositive: true,
      icon: HeartHandshake,
      color: "rose",
      targetTab: "performance",
    },
    {
      id: "attendance-rate",
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      subtext: "Target: 90%+",
      trend: attendanceRate >= 90 ? "On target" : "Below target",
      isPositive: attendanceRate >= 90,
      icon: Clock,
      color: "violet",
      targetTab: "attendance",
    },
    {
      id: "pending-requests",
      label: "Pending Requests",
      value: pendingRequestsCount.toString(),
      subtext: "Requires review",
      trend: pendingRequestsCount > 0 ? "Action needed" : "All cleared",
      isPositive: pendingRequestsCount === 0,
      icon: Inbox,
      color: "orange",
      targetTab: "leave",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            onClick={() => setActiveTab(kpi.targetTab)}
            className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div
                className={`p-2 rounded-lg ${
                  kpi.color === "blue"
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                    : kpi.color === "emerald"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                    : kpi.color === "amber"
                    ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                    : kpi.color === "indigo"
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                    : kpi.color === "cyan"
                    ? "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400"
                    : kpi.color === "rose"
                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                    : kpi.color === "violet"
                    ? "bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400"
                    : "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div
                className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  kpi.isPositive
                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50"
                    : "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50"
                }`}
              >
                {kpi.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{kpi.trend}</span>
              </div>
            </div>

            {/* Label and Value */}
            <div className="mt-4">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                {kpi.label}
              </span>
              <div className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900 dark:text-white tracking-tight">
                {kpi.value}
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 truncate">
                {kpi.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
