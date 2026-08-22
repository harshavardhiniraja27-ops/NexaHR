import React, { useState, useEffect } from "react";
import { useHR } from "../../context/HRContext";
import {
  Clock,
  CalendarDays,
  DollarSign,
  CalendarCheck2,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  User,
  Plus,
} from "lucide-react";
import { PayslipModal } from "../payroll/PayslipModal";

interface EmployeeDashboardProps {
  onApplyLeaveClick?: () => void;
  onOpenPayslip?: (record: any) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onApplyLeaveClick,
}) => {
  const {
    currentUser,
    employees,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    checkIn,
    checkOut,
    setActiveTab,
    submitLeaveRequest,
    addToast,
  } = useHR();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Leave Form
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "Casual Leave" as any,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    reason: "",
  });

  // Keep clock live
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Find matching employee profile in database
  const myEmployee =
    employees.find((e) => e.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    employees.find((e) => e.id === currentUser.id) ||
    employees[1] ||
    employees[0];

  const todayStr = "2026-08-21";
  const myTodayAttendance = attendanceRecords.find(
    (r) => r.employeeId === myEmployee?.id && (r.date === todayStr || r.date === new Date().toISOString().split("T")[0])
  );

  const isCheckedIn = Boolean(myTodayAttendance && myTodayAttendance.checkIn && myTodayAttendance.checkIn !== "—" && myTodayAttendance.checkIn !== "-");
  const isCheckedOut = Boolean(myTodayAttendance && myTodayAttendance.checkOut && myTodayAttendance.checkOut !== "—" && myTodayAttendance.checkOut !== "-");

  const myLeaves = leaveRequests.filter((l) => l.employeeId === myEmployee?.id);
  const myPayroll = payrollRecords.filter((p) => p.employeeId === myEmployee?.id);
  const latestPayslip = myPayroll[0] || payrollRecords[0];

  const handlePunchIn = () => {
    if (myEmployee) {
      checkIn(myEmployee.id, todayStr);
    }
  };

  const handlePunchOut = () => {
    if (myEmployee) {
      checkOut(myEmployee.id, todayStr);
    }
  };

  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myEmployee) return;

    // Calculate days
    const diff = Math.abs(new Date(leaveForm.endDate).getTime() - new Date(leaveForm.startDate).getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;

    submitLeaveRequest({
      employeeId: myEmployee.id,
      employeeName: myEmployee.fullName,
      employeeAvatar: myEmployee.avatar,
      designation: myEmployee.designation,
      department: myEmployee.department,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days,
      reason: leaveForm.reason || "Personal leave request",
    });

    setIsApplyModalOpen(false);
    setLeaveForm({
      leaveType: "Casual Leave",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      reason: "",
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={myEmployee?.avatar}
              alt={myEmployee?.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight">{myEmployee?.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {myEmployee?.employeeId || "EMP-1002"}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {myEmployee?.designation} • {myEmployee?.department}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-[11px] text-slate-400">
                <span>Manager: <strong className="text-slate-200">{myEmployee?.manager}</strong></span>
                <span>Joined: <strong className="text-slate-200">{myEmployee?.joiningDate}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Date / Time Widget */}
          <div className="bg-slate-800/80 backdrop-blur-xs px-5 py-3.5 rounded-xl border border-slate-700/60 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Official Shift Clock
            </span>
            <p className="text-xl font-black font-mono text-white mt-0.5">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <span className="text-[11px] text-blue-400 font-medium">
              {currentTime.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Attendance & Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Punch Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Attendance Punch
                </h2>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  isCheckedIn
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {isCheckedOut ? "Shift Completed" : isCheckedIn ? "Checked In (Active)" : "Not Checked In"}
              </span>
            </div>

            {/* Punch Details */}
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Punch In</span>
                <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
                  {myTodayAttendance?.checkIn || "—"}
                </p>
                <span className="text-[10px] text-slate-500">Scheduled: 09:00 AM</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Punch Out</span>
                <p className="text-base font-black font-mono text-slate-900 dark:text-white mt-1">
                  {myTodayAttendance?.checkOut || "—"}
                </p>
                <span className="text-[10px] text-slate-500">Scheduled: 05:30 PM</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-6 bg-blue-50/60 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <span>Today's Total Work Time:</span>
              <span className="font-bold text-blue-700 dark:text-blue-300 font-mono">
                {isCheckedOut ? "8.5 hrs (Full Day)" : isCheckedIn ? "Working (~4.2 hrs)" : "0.0 hrs"}
              </span>
            </div>
          </div>

          {/* Interactive Punch Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handlePunchIn}
              disabled={isCheckedIn}
              className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isCheckedIn
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isCheckedIn ? "Checked In" : "Check In Now"}</span>
            </button>

            <button
              onClick={handlePunchOut}
              disabled={!isCheckedIn || isCheckedOut}
              className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                !isCheckedIn || isCheckedOut
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20"
              }`}
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{isCheckedOut ? "Completed" : "Check Out"}</span>
            </button>
          </div>
        </div>

        {/* Leave Quotas & Balances */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                My Leave Entitlements
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Annual allocated time-off balance and available quotas for calendar year 2026.
              </p>
            </div>

            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Request Leave</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Casual / Paid</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {myEmployee?.leaveBalance?.casual || 12}
                <span className="text-xs text-slate-400 font-normal"> / 20</span>
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${((myEmployee?.leaveBalance?.casual || 12) / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sick Leave</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {myEmployee?.leaveBalance?.sick || 8}
                <span className="text-xs text-slate-400 font-normal"> / 10</span>
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${((myEmployee?.leaveBalance?.sick || 8) / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Earned / Vacation</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {myEmployee?.leaveBalance?.earned || 15}
                <span className="text-xs text-slate-400 font-normal"> / 15</span>
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${((myEmployee?.leaveBalance?.earned || 15) / 15) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {myEmployee?.leaveBalance?.emergency || 3}
                <span className="text-xs text-slate-400 font-normal"> / 3</span>
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${((myEmployee?.leaveBalance?.emergency || 3) / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Leave History preview */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Recent Leave Submissions
            </span>
            {myLeaves.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No recent leave applications on file.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {myLeaves.slice(0, 2).map((leave) => (
                  <div key={leave.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{leave.leaveType}</span>
                      <span className="text-slate-400 ml-2">
                        ({leave.startDate} to {leave.endDate} • {leave.days} days)
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        leave.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : leave.status === "Pending"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 text-rose-600"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Latest Payslip & AI Assistance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Payslip Preview */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Latest Compensation Disbursal
                </h2>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Disbursed (ACH)
              </span>
            </div>

            <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Net Salary ({latestPayslip?.month || "August 2026"})
                </span>
                <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                  ${latestPayslip ? latestPayslip.netSalary.toLocaleString() : "5,850"}
                </p>
                <span className="text-xs text-slate-500">
                  Gross: ${latestPayslip?.grossSalary?.toLocaleString() || "7,200"} • Deductions: -$
                  {latestPayslip?.totalDeductions?.toLocaleString() || "1,350"}
                </span>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedPayslip(latestPayslip)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View & Download Official Payslip</span>
          </button>
        </div>

        {/* Ask NEXA AI Self-Service Widget */}
        <div className="bg-gradient-to-br from-indigo-900/10 via-white dark:via-slate-900 to-blue-900/10 p-6 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/40 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-4 border-b border-indigo-100 dark:border-indigo-900/40">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                NEXA AI Self-Service Assistant
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              Have questions about company leave policy, benefits, holidays, or your personal attendance records? Ask
              NEXA AI anytime for instant verified answers.
            </p>

            {/* Prompt suggestions */}
            <div className="space-y-2 my-4">
              <button
                onClick={() => setActiveTab("ai")}
                className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>"What is the company policy for medical emergency leave?"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab("ai")}
                className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>"Show my attendance summary and on-time rate for this month."</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("ai")}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open NEXA AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <PayslipModal record={selectedPayslip} onClose={() => setSelectedPayslip(null)} />
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Apply for Leave</h2>
            <p className="text-xs text-slate-500 mt-1">Submit your time-off request for manager approval.</p>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reason / Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the reason for your time-off request..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
