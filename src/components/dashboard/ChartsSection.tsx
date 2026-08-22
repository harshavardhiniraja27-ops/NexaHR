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
  Users,
  Clock,
  Building2,
  CalendarCheck2,
  DollarSign,
  Check,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export const ChartsSection: React.FC = () => {
  const {
    employees,
    departments,
    attendanceRecords,
    leaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    openEmployee360,
    setActiveTab,
  } = useHR();

  // 1. Workforce Growth Trend Data
  const growthData = [
    { month: "Jan 2026", employees: 22, hires: 4, departures: 0 },
    { month: "Feb 2026", employees: 25, hires: 3, departures: 0 },
    { month: "Mar 2026", employees: 28, hires: 4, departures: 1 },
    { month: "Apr 2026", employees: 30, hires: 2, departures: 0 },
    { month: "May 2026", employees: 32, hires: 3, departures: 1 },
    { month: "Jun 2026", employees: 34, hires: 2, departures: 0 },
    { month: "Jul 2026", employees: 35, hires: 2, departures: 1 },
    { month: "Aug 2026", employees: employees.length, hires: 3, departures: 0 },
  ];

  // 2. Attendance Status Data
  const present = attendanceRecords.filter((a) => a.status === "Present").length;
  const late = attendanceRecords.filter((a) => a.status === "Late").length;
  const onLeave = attendanceRecords.filter((a) => a.status === "Leave").length;
  const absent = attendanceRecords.filter((a) => a.status === "Absent").length;

  const attendanceData = [
    { name: "Present", value: present, color: "#10b981" },
    { name: "Late", value: late, color: "#f59e0b" },
    { name: "On Leave", value: onLeave, color: "#3b82f6" },
    { name: "Absent", value: absent, color: "#f43f5e" },
  ];

  // 3. Department Headcount Data
  const deptData = departments.map((d) => ({
    name: d.name.length > 12 ? `${d.code}` : d.name,
    fullName: d.name,
    employees: d.employeeCount,
    budget: Math.round(d.payrollCost / 1000),
  }));

  // 4. Payroll Monthly Trend Data
  const payrollTrendData = [
    { month: "Mar", payroll: 215, budget: 230 },
    { month: "Apr", payroll: 224, budget: 235 },
    { month: "May", payroll: 232, budget: 245 },
    { month: "Jun", payroll: 240, budget: 250 },
    { month: "Jul", payroll: 244, budget: 250 },
    { month: "Aug", payroll: 248.5, budget: 255 },
  ];

  // Pending leaves
  const pendingLeaves = leaveRequests.slice(0, 4);

  // Recent employees
  const recentEmployees = employees.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top 2 charts: Workforce Growth & Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workforce Overview (Area Chart) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Workforce Growth Overview
                </h3>
                <p className="text-xs text-slate-500">Cumulative headcount & talent expansion</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("analytics")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[15, "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="employees"
                  name="Total Employees"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#growthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Breakdown (Donut Chart) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Today&apos;s Attendance
                </h3>
                <p className="text-xs text-slate-500">Live roster distribution</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("attendance")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Details
            </button>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {Math.round((present / (employees.length || 1)) * 100)}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium">On-Time</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}:</span>
                <strong className="text-slate-900 dark:text-white ml-auto">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle row: Department Distribution & Payroll Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Department Distribution
                </h3>
                <p className="text-xs text-slate-500">Personnel headcount by organizational unit</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("departments")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              All Departments
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(val, name) => [val, name === "employees" ? "Headcount" : "Budget ($k)"]}
                  labelFormatter={(name) => {
                    const found = deptData.find((d) => d.name === name);
                    return found ? found.fullName : name;
                  }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="employees" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Payroll Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Monthly Payroll Trend
                </h3>
                <p className="text-xs text-slate-500">Actual payroll expenditure vs projected budget ($k)</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("payroll")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Payroll Hub
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payrollTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[180, 280]} />
                <Tooltip
                  formatter={(val, name) => [`$${val}k`, name === "payroll" ? "Disbursed" : "Budget Target"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                <Area type="monotone" dataKey="payroll" name="Actual Payroll ($k)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2.5} />
                <Area type="monotone" dataKey="budget" name="Approved Budget ($k)" stroke="#94a3b8" strokeDasharray="4 4" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row: Recent Leave Requests (Interactive) & Recent Team Additions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leave Requests with Interactive Quick Actions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Recent Leave Requests
                </h3>
                <p className="text-xs text-slate-500">Live review queue with 1-click approvals</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("leave")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              All Requests ({leaveRequests.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Employee</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingLeaves.map((lev) => (
                  <tr key={lev.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={lev.employeeAvatar}
                          alt={lev.employeeName}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{lev.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{lev.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {lev.leaveType}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <span>{lev.startDate}</span>
                      <span className="text-[11px] text-slate-400 block">({lev.days} days)</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          lev.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : lev.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {lev.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {lev.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveLeaveRequest(lev.id)}
                            title="Approve Leave"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => rejectLeaveRequest(lev.id)}
                            title="Reject Leave"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Employees List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Team Directory
                  </h3>
                  <p className="text-xs text-slate-500">Key personnel roster</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("employees")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => openEmployee360(emp.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={emp.avatar}
                      alt={emp.fullName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {emp.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {emp.designation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                      {emp.department}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => setActiveTab("employees", "add-new")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Onboard New Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
