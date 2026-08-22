import React, { useState, useMemo } from "react";
import { useHR } from "../../context/HRContext";
import {
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
  FileSpreadsheet,
  Users,
  Clock,
  CalendarCheck2,
  DollarSign,
  UserPlus,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Building2,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

type ReportTab = "all" | "workforce" | "attendance" | "leave" | "payroll" | "recruitment";
type DateFilterOption = "all" | "this_month" | "last_month" | "q3_2026" | "ytd_2026" | "custom";

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#ef4444"];

export const ReportsManagement: React.FC = () => {
  const {
    employees,
    departments,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    jobOpenings,
    candidateApplications,
    refreshAllData,
  } = useHR();

  // Filters State
  const [activeReportTab, setActiveReportTab] = useState<ReportTab>("all");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("2026-08-01");
  const [customEndDate, setCustomEndDate] = useState<string>("2026-08-31");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manual Refresh Handler
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setErrorMessage(null);
      await refreshAllData();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to synchronize real-time HR report data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // ----------------------------------------------------
  // Date Filtering Logic based on actual records' dates
  // ----------------------------------------------------
  const isDateInRange = (dateStr?: string): boolean => {
    if (!dateStr || dateFilter === "all") return true;

    if (dateFilter === "this_month") {
      // August 2026
      return dateStr.startsWith("2026-08") || dateStr.toLowerCase().includes("august 2026");
    }
    if (dateFilter === "last_month") {
      // July 2026
      return dateStr.startsWith("2026-07") || dateStr.toLowerCase().includes("july 2026");
    }
    if (dateFilter === "q3_2026") {
      // Jul, Aug, Sep 2026
      return (
        dateStr.startsWith("2026-07") ||
        dateStr.startsWith("2026-08") ||
        dateStr.startsWith("2026-09") ||
        dateStr.toLowerCase().includes("july 2026") ||
        dateStr.toLowerCase().includes("august 2026") ||
        dateStr.toLowerCase().includes("september 2026")
      );
    }
    if (dateFilter === "ytd_2026") {
      return dateStr.startsWith("2026") || dateStr.includes("2026");
    }
    if (dateFilter === "custom") {
      if (!customStartDate && !customEndDate) return true;
      const d = dateStr.slice(0, 10);
      if (customStartDate && d < customStartDate) return false;
      if (customEndDate && d > customEndDate) return false;
      return true;
    }
    return true;
  };

  // ----------------------------------------------------
  // 1. WORKFORCE REPORT METRICS (Filtered)
  // ----------------------------------------------------
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchDept = selectedDept === "All" || emp.department.toLowerCase() === selectedDept.toLowerCase();
      const matchDate = isDateInRange(emp.joiningDate);
      const matchSearch =
        !searchQuery ||
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchDate && matchSearch;
    });
  }, [employees, selectedDept, dateFilter, customStartDate, customEndDate, searchQuery]);

  const totalEmployeesCount = filteredEmployees.length;
  const activeEmployeesCount = filteredEmployees.filter((e) => e.status === "Active").length;
  const onLeaveEmployeesCount = filteredEmployees.filter((e) => e.status === "On Leave").length;
  const probationEmployeesCount = filteredEmployees.filter((e) => e.status === "Probation").length;

  // Employees by department
  const employeesByDepartment = useMemo(() => {
    const map: { [deptName: string]: { count: number; active: number; totalSalary: number } } = {};

    departments.forEach((d) => {
      if (selectedDept === "All" || d.name.toLowerCase() === selectedDept.toLowerCase()) {
        map[d.name] = { count: 0, active: 0, totalSalary: 0 };
      }
    });

    filteredEmployees.forEach((emp) => {
      if (!map[emp.department]) {
        map[emp.department] = { count: 0, active: 0, totalSalary: 0 };
      }
      map[emp.department].count += 1;
      if (emp.status === "Active") map[emp.department].active += 1;
      map[emp.department].totalSalary += emp.salary || 0;
    });

    return Object.entries(map).map(([name, data]) => ({
      name,
      count: data.count,
      active: data.active,
      avgSalary: data.count > 0 ? Math.round(data.totalSalary / data.count) : 0,
      totalSalary: data.totalSalary,
    }));
  }, [departments, filteredEmployees, selectedDept]);

  // ----------------------------------------------------
  // 2. ATTENDANCE REPORT METRICS (Filtered)
  // ----------------------------------------------------
  const filteredAttendance = useMemo(() => {
    return attendanceRecords.filter((rec) => {
      const matchDept = selectedDept === "All" || rec.department.toLowerCase() === selectedDept.toLowerCase();
      const matchDate = isDateInRange(rec.date);
      const matchSearch =
        !searchQuery ||
        rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.status.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchDate && matchSearch;
    });
  }, [attendanceRecords, selectedDept, dateFilter, customStartDate, customEndDate, searchQuery]);

  const presentCount = filteredAttendance.filter((r) => r.status === "Present").length;
  const lateCount = filteredAttendance.filter((r) => r.status === "Late").length;
  const absentCount = filteredAttendance.filter((r) => r.status === "Absent").length;
  const leaveAttendanceCount = filteredAttendance.filter((r) => r.status === "Leave").length;
  const totalAttendanceRecords = filteredAttendance.length;

  const attendancePercentage =
    totalAttendanceRecords > 0
      ? Math.round(((presentCount + lateCount) / totalAttendanceRecords) * 100)
      : 0;

  const attendanceStatusChartData = [
    { name: "Present", value: presentCount, color: "#10b981" },
    { name: "Late", value: lateCount, color: "#f59e0b" },
    { name: "On Leave", value: leaveAttendanceCount, color: "#3b82f6" },
    { name: "Absent", value: absentCount, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  // ----------------------------------------------------
  // 3. LEAVE REPORT METRICS (Filtered)
  // ----------------------------------------------------
  const filteredLeaves = useMemo(() => {
    return leaveRequests.filter((leave) => {
      const matchDept = selectedDept === "All" || leave.department.toLowerCase() === selectedDept.toLowerCase();
      const matchDate = isDateInRange(leave.appliedDate) || isDateInRange(leave.startDate);
      const matchSearch =
        !searchQuery ||
        leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.status.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchDate && matchSearch;
    });
  }, [leaveRequests, selectedDept, dateFilter, customStartDate, customEndDate, searchQuery]);

  const pendingLeavesCount = filteredLeaves.filter((l) => l.status === "Pending").length;
  const approvedLeavesCount = filteredLeaves.filter((l) => l.status === "Approved").length;
  const rejectedLeavesCount = filteredLeaves.filter((l) => l.status === "Rejected").length;
  const totalLeaveDaysCount = filteredLeaves.reduce((acc, curr) => acc + (curr.days || 0), 0);

  const leaveTypeDistribution = useMemo(() => {
    const typesMap: { [key: string]: { count: number; totalDays: number } } = {
      "Casual Leave": { count: 0, totalDays: 0 },
      "Sick Leave": { count: 0, totalDays: 0 },
      "Earned Leave": { count: 0, totalDays: 0 },
      "Emergency Leave": { count: 0, totalDays: 0 },
    };

    filteredLeaves.forEach((l) => {
      if (!typesMap[l.leaveType]) {
        typesMap[l.leaveType] = { count: 0, totalDays: 0 };
      }
      typesMap[l.leaveType].count += 1;
      typesMap[l.leaveType].totalDays += l.days || 1;
    });

    return Object.entries(typesMap).map(([type, d]) => ({
      name: type,
      requests: d.count,
      days: d.totalDays,
    }));
  }, [filteredLeaves]);

  // ----------------------------------------------------
  // 4. PAYROLL REPORT METRICS (Filtered)
  // ----------------------------------------------------
  const filteredPayroll = useMemo(() => {
    return payrollRecords.filter((p) => {
      const matchDept = selectedDept === "All" || p.department.toLowerCase() === selectedDept.toLowerCase();
      const matchMonth =
        dateFilter === "all"
          ? true
          : isDateInRange(p.month) || (p.paymentDate && isDateInRange(p.paymentDate));
      const matchSearch =
        !searchQuery ||
        p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.status.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchMonth && matchSearch;
    });
  }, [payrollRecords, selectedDept, dateFilter, customStartDate, customEndDate, searchQuery]);

  const totalPayrollNet = filteredPayroll.reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalPayrollGross = filteredPayroll.reduce((acc, curr) => acc + curr.grossSalary, 0);
  const totalPayrollDeductions = filteredPayroll.reduce((acc, curr) => acc + curr.totalDeductions, 0);
  const totalPayrollTax = filteredPayroll.reduce((acc, curr) => acc + (curr.deductions?.tax || 0), 0);

  const payrollByDepartment = useMemo(() => {
    const map: { [key: string]: { totalNet: number; totalGross: number; count: number } } = {};

    filteredPayroll.forEach((p) => {
      if (!map[p.department]) {
        map[p.department] = { totalNet: 0, totalGross: 0, count: 0 };
      }
      map[p.department].totalNet += p.netSalary;
      map[p.department].totalGross += p.grossSalary;
      map[p.department].count += 1;
    });

    return Object.entries(map).map(([dept, d]) => ({
      name: dept,
      totalNet: d.totalNet,
      totalGross: d.totalGross,
      avgNet: d.count > 0 ? Math.round(d.totalNet / d.count) : 0,
      employees: d.count,
    }));
  }, [filteredPayroll]);

  // ----------------------------------------------------
  // 5. RECRUITMENT REPORT METRICS (Filtered)
  // ----------------------------------------------------
  const filteredJobs = useMemo(() => {
    return jobOpenings.filter((job) => {
      const matchDept = selectedDept === "All" || job.department.toLowerCase() === selectedDept.toLowerCase();
      const matchDate = isDateInRange(job.postedDate);
      const matchSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchDate && matchSearch;
    });
  }, [jobOpenings, selectedDept, dateFilter, customStartDate, customEndDate, searchQuery]);

  const filteredCandidates = useMemo(() => {
    return candidateApplications.filter((cand) => {
      const matchDate = isDateInRange(cand.appliedDate);
      const matchSearch =
        !searchQuery ||
        cand.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cand.stage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDate && matchSearch;
    });
  }, [candidateApplications, dateFilter, customStartDate, customEndDate, searchQuery]);

  const openPositionsCount = filteredJobs.filter((j) => j.status === "Active").length;
  const totalCandidatesCount = filteredCandidates.length;

  const candidatesByStage = useMemo(() => {
    const stages = ["Applied", "Screening", "Interview", "Shortlisted", "Selected", "Rejected"];
    return stages.map((st) => ({
      stage: st,
      count: filteredCandidates.filter((c) => c.stage === st).length,
    }));
  }, [filteredCandidates]);

  // ----------------------------------------------------
  // Export Handler (CSV or Printable View)
  // ----------------------------------------------------
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (activeReportTab === "workforce" || activeReportTab === "all") {
      csvContent += "=== WORKFORCE REPORT ===\n";
      csvContent += "Employee ID,Full Name,Department,Designation,Status,Employment Type,Salary,Joining Date\n";
      filteredEmployees.forEach((e) => {
        csvContent += `"${e.employeeId}","${e.fullName}","${e.department}","${e.designation}","${e.status}","${e.employmentType}",${e.salary},"${e.joiningDate}"\n`;
      });
      csvContent += "\n";
    }

    if (activeReportTab === "attendance" || activeReportTab === "all") {
      csvContent += "=== ATTENDANCE REPORT ===\n";
      csvContent += "Date,Employee Name,Department,Status,Check In,Check Out,Working Hours\n";
      filteredAttendance.forEach((a) => {
        csvContent += `"${a.date}","${a.employeeName}","${a.department}","${a.status}","${a.checkIn}","${a.checkOut}",${a.workingHours}\n`;
      });
      csvContent += "\n";
    }

    if (activeReportTab === "leave" || activeReportTab === "all") {
      csvContent += "=== LEAVE REPORT ===\n";
      csvContent += "Employee Name,Department,Leave Type,Start Date,End Date,Days,Status,Reason\n";
      filteredLeaves.forEach((l) => {
        csvContent += `"${l.employeeName}","${l.department}","${l.leaveType}","${l.startDate}","${l.endDate}",${l.days},"${l.status}","${l.reason.replace(/"/g, '""')}"\n`;
      });
      csvContent += "\n";
    }

    if (activeReportTab === "payroll" || activeReportTab === "all") {
      csvContent += "=== PAYROLL REPORT ===\n";
      csvContent += "Employee Code,Employee Name,Department,Month,Basic Salary,Gross Salary,Deductions,Net Salary,Status\n";
      filteredPayroll.forEach((p) => {
        csvContent += `"${p.employeeCode}","${p.employeeName}","${p.department}","${p.month}",${p.basicSalary},${p.grossSalary},${p.totalDeductions},${p.netSalary},"${p.status}"\n`;
      });
      csvContent += "\n";
    }

    if (activeReportTab === "recruitment" || activeReportTab === "all") {
      csvContent += "=== RECRUITMENT REPORT ===\n";
      csvContent += "Candidate Name,Job Title,Stage,Experience (Yrs),Rating,Applied Date,Current Company\n";
      filteredCandidates.forEach((c) => {
        csvContent += `"${c.candidateName}","${c.jobTitle}","${c.stage}",${c.experienceYears},${c.rating},"${c.appliedDate}","${c.currentCompany}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NEXA_HR_Report_${activeReportTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Check if all data is empty in filtered view
  const hasNoData =
    filteredEmployees.length === 0 &&
    filteredAttendance.length === 0 &&
    filteredLeaves.length === 0 &&
    filteredPayroll.length === 0 &&
    filteredJobs.length === 0;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn" id="hr-reports-page">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Enterprise HR Reports & Telemetry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time organizational audits: workforce demographics, attendance compliance, leave liability, payroll disbursal, and talent acquisition.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="Synchronize Live Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-500" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh Data"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Error State Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center justify-between gap-3 text-red-700 dark:text-red-300 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg text-xs font-bold hover:bg-red-200 transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Interactive Filters Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Report Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: "all", label: "Executive Summary", icon: Layers },
              { id: "workforce", label: "Workforce", icon: Users },
              { id: "attendance", label: "Attendance", icon: Clock },
              { id: "leave", label: "Leave", icon: CalendarCheck2 },
              { id: "payroll", label: "Payroll", icon: DollarSign },
              { id: "recruitment", label: "Recruitment", icon: UserPlus },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeReportTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReportTab(tab.id as ReportTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search bar inside reports */}
          <div className="relative w-full lg:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter report entities..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Secondary Filter Row: Date Period & Department Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5" /> Department:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Period Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" /> Period:
            </span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilterOption)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Historical Records</option>
              <option value="this_month">This Month (August 2026)</option>
              <option value="last_month">Last Month (July 2026)</option>
              <option value="q3_2026">Q3 2026</option>
              <option value="ytd_2026">YTD 2026</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Custom Date Pickers */}
          {dateFilter === "custom" && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-[11px]"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-[11px]"
              />
            </div>
          )}

          {/* Reset Filters CTA */}
          {(selectedDept !== "All" || dateFilter !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDept("All");
                setDateFilter("all");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Empty State Fallback (If filter returns 0 records) */}
      {hasNoData ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No report data is available for the selected period.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              No active records matched your current department (&ldquo;{selectedDept}&rdquo;) or date scope. Try adjusting or clearing your filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedDept("All");
              setDateFilter("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Clear Filter Constraints
          </button>
        </div>
      ) : (
        <>
          {/* 4. Top Executive Metric Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Workforce Stat */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Headcount</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1.5">
                {totalEmployeesCount}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Active: {activeEmployeesCount}</span>
                <span className="text-emerald-500 font-semibold">{Math.round((activeEmployeesCount / (totalEmployeesCount || 1)) * 100)}%</span>
              </div>
            </div>

            {/* 2. Attendance Stat */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Attendance Rate</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1.5">
                {attendancePercentage}%
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Present: {presentCount}</span>
                <span>Late: {lateCount}</span>
              </div>
            </div>

            {/* 3. Leave Stat */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Leave Liability</span>
                <CalendarCheck2 className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1.5">
                {totalLeaveDaysCount} <span className="text-xs font-normal">Days</span>
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Pending: {pendingLeavesCount}</span>
                <span>Approved: {approvedLeavesCount}</span>
              </div>
            </div>

            {/* 4. Payroll Stat */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Payroll Outflow</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1.5">
                ${(totalPayrollNet / 1000).toFixed(1)}k
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Gross: ${(totalPayrollGross / 1000).toFixed(1)}k</span>
                <span className="text-rose-500">Tax: ${(totalPayrollTax / 1000).toFixed(1)}k</span>
              </div>
            </div>

            {/* 5. Recruitment Stat */}
            <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Talent Pipeline</span>
                <UserPlus className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1.5">
                {openPositionsCount} <span className="text-xs font-normal text-slate-400">Roles</span>
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span>Candidates: {totalCandidatesCount}</span>
                <span className="text-purple-500 font-semibold">{filteredCandidates.filter(c => c.stage === "Interview").length} in Interview</span>
              </div>
            </div>
          </div>

          {/* 5. Section 1: WORKFORCE REPORT */}
          {(activeReportTab === "all" || activeReportTab === "workforce") && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>1. Workforce & Headcount Report</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Department headcount, status breakdown, and compensation averages from active roster.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {totalEmployeesCount} Total Personnel
                </span>
              </div>

              {/* Chart & Summary Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Bar Chart: Department Headcount */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Headcount by Department
                  </h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={employeesByDepartment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(val) => val.split(" ")[0]} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="count" name="Employees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table: Department Metrics */}
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-center">Total Staff</th>
                        <th className="p-3 text-center">Active</th>
                        <th className="p-3 text-right">Avg Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      {employeesByDepartment.map((d) => (
                        <tr key={d.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            {d.name}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                            {d.count}
                          </td>
                          <td className="p-3 text-center font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                            {d.active}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                            ${d.avgSalary.toLocaleString()}/yr
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. Section 2: ATTENDANCE REPORT */}
          {(activeReportTab === "all" || activeReportTab === "attendance") && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>2. Attendance & On-Time Compliance Report</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Punctuality metrics: present, late arrivals, absences, and overall operational compliance.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{attendancePercentage}% Attendance Compliance</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Donut Chart: Status distribution */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Status Distribution
                  </h3>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceStatusChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={58}
                        >
                          {attendanceStatusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Present: <strong>{presentCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Late: <strong>{lateCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>Leave: <strong>{leaveAttendanceCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>Absent: <strong>{absentCount}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Table of Latest Attendance Logs */}
                <div className="lg:col-span-2 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Employee</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Check In</th>
                        <th className="p-3">Check Out</th>
                        <th className="p-3 text-right">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      {filteredAttendance.slice(0, 5).map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <img
                              src={att.employeeAvatar}
                              alt={att.employeeName}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div>
                              <span>{att.employeeName}</span>
                              <span className="block text-[10px] text-slate-400 font-normal">{att.department}</span>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{att.date}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                att.status === "Present"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : att.status === "Late"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                                  : att.status === "Leave"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                              }`}
                            >
                              {att.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px]">{att.checkIn}</td>
                          <td className="p-3 font-mono text-[11px]">{att.checkOut}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {att.workingHours}h
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 7. Section 3: LEAVE REPORT */}
          {(activeReportTab === "all" || activeReportTab === "leave") && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarCheck2 className="w-4 h-4 text-amber-500" />
                    <span>3. Leave Request & Absence Liability Report</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Status audit of paid time off: pending, approved, and rejected allocations by leave category.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{pendingLeavesCount} Pending</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{approvedLeavesCount} Approved</span>
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">{rejectedLeavesCount} Rejected</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Leave type breakdown chart */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Leave Usage by Type (Days)
                  </h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leaveTypeDistribution} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#94a3b8" }} width={80} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="days" name="Total Days" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table of Leave Applications */}
                <div className="lg:col-span-2 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Employee</th>
                        <th className="p-3">Leave Type</th>
                        <th className="p-3">Dates</th>
                        <th className="p-3 text-center">Days</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      {filteredLeaves.slice(0, 5).map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            <div>{l.employeeName}</div>
                            <span className="text-[10px] text-slate-400 font-normal">{l.department}</span>
                          </td>
                          <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{l.leaveType}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">
                            {l.startDate} → {l.endDate}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                            {l.days}d
                          </td>
                          <td className="p-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                l.status === "Approved"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : l.status === "Pending"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                              }`}
                            >
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 8. Section 4: PAYROLL REPORT */}
          {(activeReportTab === "all" || activeReportTab === "payroll") && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>4. Payroll Expenditure & Compensation Summary</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gross-to-net breakdown: basic wages, allowances, statutory deductions, and departmental budget consumption.
                  </p>
                </div>
                <div className="font-mono text-sm font-black text-slate-900 dark:text-white">
                  Total Disbursed: <span className="text-emerald-600 dark:text-emerald-400">${totalPayrollNet.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Bar chart of Payroll by Department */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Payroll Outflow by Department ($)
                  </h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={payrollByDepartment} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(v) => v.split(" ")[0]} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                        <Tooltip
                          formatter={(val) => [`$${Number(val).toLocaleString()}`, "Net Payroll"]}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="totalNet" name="Net Payroll" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table of Department Payroll Breakdowns */}
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-center">Beneficiaries</th>
                        <th className="p-3 text-right">Gross Total</th>
                        <th className="p-3 text-right">Net Disbursed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      {payrollByDepartment.map((p) => (
                        <tr key={p.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            {p.name}
                          </td>
                          <td className="p-3 text-center font-mono font-bold">{p.employees}</td>
                          <td className="p-3 text-right font-mono text-slate-500">
                            ${p.totalGross.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${p.totalNet.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 9. Section 5: RECRUITMENT REPORT */}
          {(activeReportTab === "all" || activeReportTab === "recruitment") && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-purple-500" />
                    <span>5. Talent Acquisition & Pipeline Report</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Open requisitions, applicant conversion stages, and candidate throughput.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                  <span>{openPositionsCount} Active Requisitions</span>
                  <span>•</span>
                  <span>{totalCandidatesCount} Candidates</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Pipeline Funnel Bar Chart */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Candidates by Pipeline Stage
                  </h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={candidatesByStage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                        <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="count" name="Candidates" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table of Open Job Requisitions */}
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3">Job Title</th>
                        <th className="p-3">Department</th>
                        <th className="p-3 text-center">Applicants</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      {filteredJobs.slice(0, 5).map((j) => (
                        <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            <div>{j.title}</div>
                            <span className="text-[10px] text-slate-400 font-normal">{j.location}</span>
                          </td>
                          <td className="p-3 font-medium text-slate-600 dark:text-slate-300">{j.department}</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                            {j.applicationsCount || filteredCandidates.filter(c => c.jobId === j.id).length}
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                              {j.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
