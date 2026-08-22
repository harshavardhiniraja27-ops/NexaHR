import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import {
  Settings,
  Building,
  Clock,
  DollarSign,
  Calendar,
  Shield,
  Save,
  RotateCcw,
  Check,
  Bell,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { addToast } = useHR();

  const [saved, setSaved] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"company" | "policies" | "shifts" | "roles">("company");

  const [settings, setSettings] = useState({
    companyName: "NEXA HR Global Technologies Inc.",
    companyDomain: "nexahr.io",
    currency: "USD ($)",
    timezone: "America/Los_Angeles (PST)",
    workWeek: "Monday - Friday",
    checkInTime: "09:00 AM",
    checkOutTime: "05:30 PM",
    gracePeriodMins: 15,
    casualLeaveQuota: 12,
    sickLeaveQuota: 10,
    earnedLeaveQuota: 18,
    emergencyQuota: 5,
    defaultTaxPercent: 16,
    pfPercent: 6,
    payrollCycleDay: 28,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    addToast("Settings Updated", "Settings successfully saved and synchronized.", "success");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDemo = () => {
    if (confirm("Reset all HR records back to initial hackathon demo seed state?")) {
      localStorage.removeItem("nexa_hr_state_v1");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Enterprise System Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure company policies, shift timings, leave quotas, payroll tax brackets, and RBAC matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Seed Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto scrollbar-none">
        {[
          { id: "company", label: "Company Profile", icon: Building },
          { id: "shifts", label: "Shifts & Work Hours", icon: Clock },
          { id: "policies", label: "Leave & Payroll Policies", icon: DollarSign },
          { id: "roles", label: "RBAC Role Matrix", icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-6">
        {/* 1. COMPANY PROFILE */}
        {activeSubTab === "company" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Corporate Entity & Localization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Legal Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Corporate Web Domain
                </label>
                <input
                  type="text"
                  value={settings.companyDomain}
                  onChange={(e) => setSettings({ ...settings, companyDomain: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Currency Base
                </label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Headquarters Timezone
                </label>
                <input
                  type="text"
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. SHIFTS & WORK HOURS */}
        {activeSubTab === "shifts" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Shift Timings & Grace Period Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Standard Check-in Time
                </label>
                <input
                  type="text"
                  value={settings.checkInTime}
                  onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Standard Check-out Time
                </label>
                <input
                  type="text"
                  value={settings.checkOutTime}
                  onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Grace Period (Minutes before marked Late)
                </label>
                <input
                  type="number"
                  value={settings.gracePeriodMins}
                  onChange={(e) => setSettings({ ...settings, gracePeriodMins: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. LEAVE & PAYROLL POLICIES */}
        {activeSubTab === "policies" && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                Annual Leave Quotas (Days per Employee)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Casual Leave (Vacation)
                  </label>
                  <input
                    type="number"
                    value={settings.casualLeaveQuota}
                    onChange={(e) => setSettings({ ...settings, casualLeaveQuota: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Sick Leave (Medical)
                  </label>
                  <input
                    type="number"
                    value={settings.sickLeaveQuota}
                    onChange={(e) => setSettings({ ...settings, sickLeaveQuota: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Earned Leave (Privilege)
                  </label>
                  <input
                    type="number"
                    value={settings.earnedLeaveQuota}
                    onChange={(e) => setSettings({ ...settings, earnedLeaveQuota: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Emergency Leave
                  </label>
                  <input
                    type="number"
                    value={settings.emergencyQuota}
                    onChange={(e) => setSettings({ ...settings, emergencyQuota: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                Payroll & Withholding Calculations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Income Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={settings.defaultTaxPercent}
                    onChange={(e) => setSettings({ ...settings, defaultTaxPercent: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    PF / 401(k) Contribution (%)
                  </label>
                  <input
                    type="number"
                    value={settings.pfPercent}
                    onChange={(e) => setSettings({ ...settings, pfPercent: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Monthly Disbursal Day
                  </label>
                  <input
                    type="number"
                    value={settings.payrollCycleDay}
                    onChange={(e) => setSettings({ ...settings, payrollCycleDay: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. RBAC MATRIX */}
        {activeSubTab === "roles" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Role-Based Access Control (RBAC) Permissions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">System Module</th>
                    <th className="py-2.5 px-3">Admin</th>
                    <th className="py-2.5 px-3">HR Manager</th>
                    <th className="py-2.5 px-3">Department Head</th>
                    <th className="py-2.5 px-3">Employee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { mod: "Employee Management", admin: "Full Access", hr: "Full Access", head: "View & Review", emp: "View Self" },
                    { mod: "Attendance & Punch Logs", admin: "Full Access", hr: "Full Access", head: "Team Approvals", emp: "Self Clock In" },
                    { mod: "Leave Approvals", admin: "Full Access", hr: "Full Access", head: "Team Approvals", emp: "Self Apply" },
                    { mod: "Payroll & Compensation", admin: "Full Access", hr: "Full Access", head: "No Access", emp: "View Payslip" },
                    { mod: "Recruitment & ATS", admin: "Full Access", hr: "Full Access", head: "Interview Evaluation", emp: "No Access" },
                    { mod: "Performance Appraisals", admin: "Full Access", hr: "Full Access", head: "Conduct Reviews", emp: "View Self OKR" },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{row.mod}</td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">{row.admin}</td>
                      <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-medium">{row.hr}</td>
                      <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400 font-medium">{row.head}</td>
                      <td className="py-2.5 px-3 text-slate-500">{row.emp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Saved & Synced" : "Save Configurations"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
