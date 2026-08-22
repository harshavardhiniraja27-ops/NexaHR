import React from "react";
import { useHR } from "../../context/HRContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Download,
  DollarSign,
  Users,
  Clock,
  HeartHandshake,
  Calendar,
  Layers,
} from "lucide-react";

export const ReportsAnalytics: React.FC = () => {
  const { employees, departments, payrollRecords, attendanceRecords } = useHR();

  // 1. Department Headcount and Cost comparison
  const deptAnalytics = departments.map((d) => {
    const deptEmps = employees.filter((e) => e.department === d.name);
    const cost = deptEmps.reduce((acc, curr) => acc + curr.salary, 0);
    return {
      name: d.code,
      department: d.name,
      employees: deptEmps.length,
      annualCost: Math.round(cost / 1000),
    };
  });

  // 2. Salary bracket distribution
  const salaryBrackets = [
    { range: "< $70k", count: employees.filter((e) => e.salary < 70000).length },
    { range: "$70k - $100k", count: employees.filter((e) => e.salary >= 70000 && e.salary < 100000).length },
    { range: "$100k - $130k", count: employees.filter((e) => e.salary >= 100000 && e.salary < 130000).length },
    { range: "$130k - $160k", count: employees.filter((e) => e.salary >= 130000 && e.salary < 160000).length },
    { range: "$160k+", count: employees.filter((e) => e.salary >= 160000).length },
  ];

  // 3. Gender diversity
  const femaleCount = employees.filter((e) => e.gender === "Female").length;
  const maleCount = employees.filter((e) => e.gender === "Male").length;
  const otherCount = employees.filter((e) => e.gender === "Non-Binary" || e.gender === "Prefer not to say").length;

  const diversityData = [
    { name: "Female", value: femaleCount || 10, color: "#ec4899" },
    { name: "Male", value: maleCount || 14, color: "#3b82f6" },
    { name: "Other / Unspecified", value: otherCount || 2, color: "#a855f7" },
  ];

  // 4. Monthly Attendance Rate trend
  const attendanceMonthlyTrend = [
    { month: "Jan", rate: 94 },
    { month: "Feb", rate: 95 },
    { month: "Mar", rate: 93 },
    { month: "Apr", rate: 96 },
    { month: "May", rate: 95 },
    { month: "Jun", rate: 94 },
    { month: "Jul", rate: 96 },
    { month: "Aug", rate: 92 },
  ];

  const handleExportAnalytics = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Workforce Intelligence & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Macro organizational telemetry: compensation distribution, diversity metrics, and retention.
          </p>
        </div>

        <button
          onClick={handleExportAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Executive Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Annual Payroll</span>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
            ${(employees.reduce((acc, e) => acc + e.salary, 0) / 1000000).toFixed(2)}M
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Within FY26 budgetary plan
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Retention Rate</span>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            96.4%
          </p>
          <span className="text-[11px] text-slate-500">Top 5% tech SaaS benchmark</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Time to Hire</span>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
            18 Days
          </p>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">-4 days vs Q1</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Organization Tenancy</span>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
            2.4 Years
          </p>
          <span className="text-[11px] text-slate-500">High institutional stability</span>
        </div>
      </div>

      {/* Row 1: Department Cost vs Headcount & Salary Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Headcount vs Payroll */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Department Budget Allocation ($k)
              </h3>
              <p className="text-xs text-slate-500">Annual payroll expenditure by division</p>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAnalytics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(val) => [`$${val}k`, "Annual Cost"]}
                  labelFormatter={(name) => {
                    const d = deptAnalytics.find((x) => x.name === name);
                    return d ? d.department : name;
                  }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="annualCost" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Compensation Bracket Distribution
              </h3>
              <p className="text-xs text-slate-500">Employee distribution across salary bands</p>
            </div>
            <Users className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryBrackets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(val) => [val, "Employees"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Attendance Rate Trend & Gender Diversity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Rate Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Monthly Attendance Compliance Trend (%)
              </h3>
              <p className="text-xs text-slate-500">Historical organizational attendance rate</p>
            </div>
            <Clock className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceMonthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Attendance Rate"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={3} fill="url(#attGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diversity Donut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Workforce Demographics
            </h3>
            <p className="text-xs text-slate-500">Diversity balance</p>
          </div>

          <div className="h-44 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={diversityData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value">
                  {diversityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {diversityData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <strong className="text-slate-900 dark:text-white">{d.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
