import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  UserCheck,
  TrendingUp,
  Clock,
  CalendarDays,
  Award,
  CheckCircle2,
  FileText,
  Star,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";

interface Employee360ModalProps {
  employeeId: string | null;
  onClose: () => void;
}

export const Employee360Modal: React.FC<Employee360ModalProps> = ({ employeeId, onClose }) => {
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    performanceReviews,
    departments,
  } = useHR();

  const [activeTab, setActiveTab] = useState<
    "overview" | "attendance" | "leave" | "payroll" | "performance" | "skills" | "activity"
  >("overview");

  if (!employeeId) return null;

  const employee = employees.find((e) => e.id === employeeId);
  if (!employee) return null;

  // Filter records for this employee
  const employeeAttendance = attendanceRecords.filter((a) => a.employeeId === employee.id);
  const employeeLeaves = leaveRequests.filter((l) => l.employeeId === employee.id);
  const employeePayroll = payrollRecords.filter((p) => p.employeeId === employee.id);
  const employeeReviews = performanceReviews.filter((r) => r.employeeId === employee.id);

  // Latest review or fallback
  const latestReview = employeeReviews[0];

  // Attendance breakdown
  const presentDays = employeeAttendance.filter((a) => a.status === "Present").length;
  const lateDays = employeeAttendance.filter((a) => a.status === "Late").length;
  const leaveDays = employeeAttendance.filter((a) => a.status === "Leave").length;
  const absentDays = employeeAttendance.filter((a) => a.status === "Absent").length;

  const monthlyGross = Math.round(employee.salary / 12);
  const estimatedTax = Math.round(monthlyGross * 0.16);
  const estimatedNet = monthlyGross - estimatedTax - 350;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Profile Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white relative shrink-0 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={employee.avatar}
                alt={employee.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-blue-500/40 shadow-xl"
              />
              <span
                className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-slate-900 ${
                  employee.status === "Active"
                    ? "bg-emerald-500"
                    : employee.status === "On Leave"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                title={`Status: ${employee.status}`}
              />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                  {employee.fullName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {employee.employeeId}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    employee.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {employee.status}
                </span>
              </div>

              <p className="text-sm text-slate-300 font-medium">
                {employee.designation} • <span className="text-blue-400">{employee.department}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined {employee.joiningDate}
                </span>
              </div>
            </div>

            {/* Quick KPI stats badge */}
            <div className="hidden lg:flex items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/60 shrink-0">
              <div className="text-center px-2">
                <p className="text-xs text-slate-400">Attendance</p>
                <p className="text-lg font-bold text-emerald-400">{employee.attendanceRate}%</p>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center px-2">
                <p className="text-xs text-slate-400">Performance</p>
                <p className="text-lg font-bold text-blue-400">{employee.performanceScore} / 5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "attendance", label: "Attendance", icon: Clock },
            { id: "leave", label: "Leave", icon: CalendarDays },
            { id: "payroll", label: "Payroll", icon: DollarSign },
            { id: "performance", label: "Performance", icon: TrendingUp },
            { id: "skills", label: "Skills", icon: Award },
            { id: "activity", label: "Activity Log", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              {/* Personal Information */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-500" /> Personal & Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Full Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Gender</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Birth</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.address}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block mb-1">Emergency Contact</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {employee.emergencyContact.name} ({employee.emergencyContact.relationship}) —{" "}
                      {employee.emergencyContact.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job & Organization */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-500" /> Employment & Org Structure
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Department</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Designation</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.designation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Reporting Manager</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.manager}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Employment Type</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.employmentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Annual Base Compensation</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      ${employee.salary.toLocaleString()} / year
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tenure</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Since {employee.joiningDate}</span>
                  </div>
                </div>
              </div>

              {/* Skills preview in Overview */}
              <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Core Competencies & Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ATTENDANCE TAB */}
          {activeTab === "attendance" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Attendance KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Present</p>
                  <p className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1">{presentDays || 18}</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">On-time check-ins</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Late</p>
                  <p className="text-2xl font-extrabold text-amber-800 dark:text-amber-200 mt-1">{lateDays || 1}</p>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">Past 09:15 AM</span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Leave</p>
                  <p className="text-2xl font-extrabold text-blue-800 dark:text-blue-200 mt-1">{leaveDays || 1}</p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">Approved leaves</span>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
                  <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">Absent</p>
                  <p className="text-2xl font-extrabold text-rose-800 dark:text-rose-200 mt-1">{absentDays || 0}</p>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400">Unexcused</span>
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Recent Attendance Logs</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2">Date</th>
                        <th className="py-2">Check In</th>
                        <th className="py-2">Check Out</th>
                        <th className="py-2">Hours</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                      {employeeAttendance.length > 0 ? (
                        employeeAttendance.map((rec) => (
                          <tr key={rec.id}>
                            <td className="py-2.5 font-medium">{rec.date}</td>
                            <td className="py-2.5">{rec.checkIn}</td>
                            <td className="py-2.5">{rec.checkOut}</td>
                            <td className="py-2.5 font-mono">{rec.workingHours}h</td>
                            <td className="py-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  rec.status === "Present"
                                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : rec.status === "Late"
                                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                    : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {rec.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-slate-400 text-[11px]">{rec.notes || "—"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-2.5 font-medium">2026-08-21</td>
                          <td className="py-2.5">08:45 AM</td>
                          <td className="py-2.5">05:30 PM</td>
                          <td className="py-2.5 font-mono">8.75h</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                              Present
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-400 text-[11px]">Regular Shift</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. LEAVE TAB */}
          {activeTab === "leave" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Balances */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Casual Leave</p>
                  <p className="text-2xl font-extrabold text-blue-800 dark:text-blue-200 mt-1">
                    {employee.leaveBalance.casual} Days
                  </p>
                  <span className="text-[10px] text-blue-500">Available balance</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Sick Leave</p>
                  <p className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1">
                    {employee.leaveBalance.sick} Days
                  </p>
                  <span className="text-[10px] text-emerald-500">Medical quota</span>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">Earned Leave</p>
                  <p className="text-2xl font-extrabold text-indigo-800 dark:text-indigo-200 mt-1">
                    {employee.leaveBalance.earned} Days
                  </p>
                  <span className="text-[10px] text-indigo-500">Paid vacation</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Emergency</p>
                  <p className="text-2xl font-extrabold text-amber-800 dark:text-amber-200 mt-1">
                    {employee.leaveBalance.emergency} Days
                  </p>
                  <span className="text-[10px] text-amber-500">Compassionate</span>
                </div>
              </div>

              {/* Leave History List */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Leave Application History</h4>
                {employeeLeaves.length > 0 ? (
                  <div className="space-y-3">
                    {employeeLeaves.map((lev) => (
                      <div
                        key={lev.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white">
                              {lev.leaveType} ({lev.days} days)
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                lev.status === "Approved"
                                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                  : lev.status === "Pending"
                                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                  : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {lev.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {lev.startDate} to {lev.endDate} • Reason: &ldquo;{lev.reason}&rdquo;
                          </p>
                        </div>
                        {lev.reviewedBy && (
                          <div className="text-right text-[11px] text-slate-400 shrink-0">
                            <span>Reviewed by {lev.reviewedBy}</span>
                            <span className="block text-[10px]">{lev.reviewedAt}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No past leave applications recorded.</p>
                )}
              </div>
            </div>
          )}

          {/* 4. PAYROLL TAB */}
          {activeTab === "payroll" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Compensation Summary Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                      Current Monthly Compensation
                    </span>
                    <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">
                      ${monthlyGross.toLocaleString()} / mo
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Annual Total: ${employee.salary.toLocaleString()} USD
                    </p>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-1">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Estimated Net Pay:</span>
                      <strong className="text-emerald-400 font-mono">${estimatedNet.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Total Deductions:</span>
                      <strong className="text-rose-400 font-mono">${(estimatedTax + 350).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Payslips History */}
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Disbursed Payslips</h4>
                <div className="space-y-2">
                  {employeePayroll.length > 0 ? (
                    employeePayroll.map((pay) => (
                      <div
                        key={pay.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{pay.month}</p>
                            <p className="text-[11px] text-slate-500">
                              Gross: ${pay.grossSalary.toLocaleString()} | Deductions: ${pay.totalDeductions.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${pay.netSalary.toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                            {pay.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">August 2026</p>
                          <p className="text-[11px] text-slate-500">Gross: ${monthlyGross.toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        Paid (Direct Deposit)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 5. PERFORMANCE TAB */}
          {activeTab === "performance" && (
            <div className="space-y-6 animate-fadeIn">
              {latestReview ? (
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold">{latestReview.reviewPeriod} Evaluation</span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Reviewer: {latestReview.reviewerName}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-sm">
                      <Star className="w-4 h-4 fill-white" />
                      <span>{latestReview.overallRating} / 5.0</span>
                    </div>
                  </div>

                  {/* Strategic Goals with progress bars */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Key Strategic Goals</h5>
                    <div className="space-y-2.5">
                      {latestReview.goals.map((goal) => (
                        <div key={goal.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{goal.title}</span>
                            <span className="text-slate-500 font-mono">{goal.achievedScore}% / {goal.targetScore}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                goal.achievedScore >= 100 ? "bg-emerald-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${Math.min(100, (goal.achievedScore / goal.targetScore) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Key Strengths</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        {latestReview.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Growth Opportunities</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        {latestReview.areasForImprovement.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Reviewer Feedback */}
                  <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-xs">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">Executive Feedback</span>
                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">&ldquo;{latestReview.feedback}&rdquo;</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Star className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Overall Rating: {employee.performanceScore} / 5.0</p>
                  <p className="mt-1">Scheduled for formal Q3 2026 manager appraisal review.</p>
                </div>
              )}
            </div>
          )}

          {/* 6. SKILLS TAB */}
          {activeTab === "skills" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Technical & Domain Competencies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {employee.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-900 dark:text-white">{skill}</span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. ACTIVITY LOG TAB */}
          {activeTab === "activity" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Profile Updated</p>
                  <p className="text-xs text-slate-500">Contact information verified during annual audit.</p>
                  <span className="text-[10px] text-slate-400">August 20, 2026</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Payroll Disbursed</p>
                  <p className="text-xs text-slate-500">August 2026 salary credited via Direct Deposit.</p>
                  <span className="text-[10px] text-slate-400">August 20, 2026</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Performance Review Completed</p>
                  <p className="text-xs text-slate-500">Achieved 4.7 / 5.0 score with promotion recommendation.</p>
                  <span className="text-[10px] text-slate-400">July 15, 2026</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-400">NEXA HR 360° Employee Intelligence Dossier</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
