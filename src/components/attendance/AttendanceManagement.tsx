import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import { AttendanceRecord, AttendanceStatus } from "../../types";
import {
  Clock,
  UserCheck,
  UserX,
  CalendarDays,
  CheckCircle2,
  Download,
  Search,
  Filter,
  Edit2,
  Plus,
  X,
  Play,
  Square,
} from "lucide-react";

export const AttendanceManagement: React.FC = () => {
  const {
    attendanceRecords,
    employees,
    departments,
    markAttendance,
    updateAttendanceStatus,
    currentUser,
    activeFilterParam,
  } = useHR();

  const [selectedDate, setSelectedDate] = useState("2026-08-21");
  const [selectedDept, setSelectedDept] = useState<string>(activeFilterParam || "All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<AttendanceRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || "",
    date: selectedDate,
    status: "Present" as AttendanceStatus,
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    workingHours: 8.5,
    breakTimeMinutes: 45,
    overtimeHours: 0,
    notes: "",
  });

  // Filter records for chosen date
  const recordsForDate = attendanceRecords.filter((rec) => rec.date === selectedDate);

  // Cross-reference with all employees to ensure complete roster
  const fullRoster = employees.map((emp) => {
    const existing = recordsForDate.find((r) => r.employeeId === emp.id);
    if (existing) return existing;
    return {
      id: `att-generated-${emp.id}-${selectedDate}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      employeeAvatar: emp.avatar,
      department: emp.department,
      date: selectedDate,
      checkIn: "—",
      checkOut: "—",
      status: "Absent" as AttendanceStatus,
      workingHours: 0,
      breakTimeMinutes: 0,
      overtimeHours: 0,
      notes: "Not yet checked in",
    };
  });

  const filteredRoster = fullRoster.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || rec.department === selectedDept;
    const matchesStatus = selectedStatus === "All" || rec.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculations
  const totalEmployees = fullRoster.length;
  const presentCount = fullRoster.filter((r) => r.status === "Present").length;
  const lateCount = fullRoster.filter((r) => r.status === "Late").length;
  const onLeaveCount = fullRoster.filter((r) => r.status === "Leave").length;
  const absentCount = fullRoster.filter((r) => r.status === "Absent").length;
  const attendanceRate = Math.round(((presentCount + lateCount) / (totalEmployees || 1)) * 100);

  const handleOpenEdit = (record: AttendanceRecord) => {
    setRecordToEdit(record);
    setFormData({
      employeeId: record.employeeId,
      date: record.date,
      status: record.status,
      checkIn: record.checkIn !== "—" ? record.checkIn : "09:00 AM",
      checkOut: record.checkOut !== "—" ? record.checkOut : "05:30 PM",
      workingHours: record.workingHours || 8.5,
      breakTimeMinutes: 45,
      overtimeHours: 0,
      notes: record.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === formData.employeeId) || employees[0];
    if (recordToEdit) {
      updateAttendanceStatus(recordToEdit.id, formData.status, formData.notes);
    } else if (emp) {
      markAttendance({
        employeeId: emp.id,
        employeeName: emp.fullName,
        employeeAvatar: emp.avatar,
        department: emp.department,
        date: formData.date,
        status: formData.status,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        workingHours: Number(formData.workingHours),
        notes: formData.notes,
      });
    }
    setIsEditModalOpen(false);
  };

  // Quick punch for logged in user
  const handleQuickPunchIn = () => {
    const emp = employees.find((e) => e.email === currentUser.email) || employees[0];
    if (emp) {
      markAttendance({
        employeeId: emp.id,
        employeeName: emp.fullName,
        employeeAvatar: emp.avatar,
        department: emp.department,
        date: selectedDate,
        status: "Present",
        checkIn: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
        checkOut: "—",
        workingHours: 8.0,
        notes: "Self-service quick check-in",
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ["Employee Name", "Department", "Date", "Check In", "Check Out", "Hours", "Status", "Notes"];
    const rows = filteredRoster.map((r) => [
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.date,
      r.checkIn,
      r.checkOut,
      r.workingHours,
      r.status,
      `"${r.notes || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Attendance & Time Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor daily roster compliance, punch logs, overtime hours, and attendance discrepancies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
          />

          <button
            onClick={handleQuickPunchIn}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Clock In Now</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400">Total Roster</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalEmployees}</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Present</span>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{presentCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">Late</span>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{lateCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">On Leave</span>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{onLeaveCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40">
          <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">Absent</span>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{absentCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/40">
          <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-400">Attendance Rate</span>
          <p className="text-2xl font-bold text-violet-700 dark:text-violet-300 mt-1">{attendanceRate}%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee or department..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-3 py-2"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-3 py-2"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
            <option value="Half Day">Half Day</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>

      {/* Daily Attendance Roster Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Working Hours</th>
                <th className="py-3 px-4">Break Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRoster.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rec.employeeAvatar}
                        alt={rec.employeeName}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{rec.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{rec.department}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {rec.checkIn}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {rec.checkOut}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {rec.workingHours > 0 ? `${rec.workingHours} hrs` : "—"}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {rec.workingHours > 0 ? "45 mins" : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === "Present"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : rec.status === "Late"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : rec.status === "Leave"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[150px]">
                    {rec.notes || "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(rec as AttendanceRecord)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Override Attendance"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Override Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Attendance Record
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceStatus })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Check In Time
                  </label>
                  <input
                    type="text"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    placeholder="09:00 AM"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Check Out Time
                  </label>
                  <input
                    type="text"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    placeholder="05:30 PM"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Working Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Break (mins)
                  </label>
                  <input
                    type="number"
                    value={formData.breakTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, breakTimeMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Overtime (hrs)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.overtimeHours}
                    onChange={(e) => setFormData({ ...formData, overtimeHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Manager Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Approved remote sprint day"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
                >
                  Save Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
