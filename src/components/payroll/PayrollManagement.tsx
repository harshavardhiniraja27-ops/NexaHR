import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import { PayrollRecord } from "../../types";
import {
  DollarSign,
  FileText,
  CheckCircle2,
  Printer,
  Sparkles,
  Search,
  X,
  CreditCard,
  Building,
  TrendingUp,
} from "lucide-react";

export const PayrollManagement: React.FC = () => {
  const {
    payrollRecords,
    departments,
    generatePayrollCycle,
    updatePayrollStatus,
  } = useHR();

  const [selectedMonth, setSelectedMonth] = useState("August 2026");
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(null);

  const filteredPayroll = payrollRecords.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || p.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const totalDisbursed = payrollRecords.reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalDeductions = payrollRecords.reduce((acc, curr) => acc + curr.totalDeductions, 0);
  const avgSalary = Math.round(totalDisbursed / (payrollRecords.length || 1));
  const paidCount = payrollRecords.filter((p) => p.status === "Paid").length;

  const handleRunPayroll = () => {
    generatePayrollCycle(selectedMonth);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payroll & Compensation Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated salary calculations, statutory deductions, tax withholdings, and payslip generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
          </select>

          <button
            onClick={handleRunPayroll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Process & Disburse Payroll</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Monthly Outflow</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            ${totalDisbursed.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            100% scheduled on-time
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Withholdings</span>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            ${totalDeductions.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Tax, PF & Healthcare</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Average Net Pay</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            ${avgSalary.toLocaleString()}
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Per employee / month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Disbursal Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {paidCount} / {payrollRecords.length} Paid
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Direct deposit via ACH
          </span>
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
            placeholder="Search employee, department..."
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
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 font-mono">Base Salary</th>
                <th className="py-3 px-4 font-mono">Allowances</th>
                <th className="py-3 px-4 font-mono">Deductions</th>
                <th className="py-3 px-4 font-mono">Net Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayroll.map((pay) => {
                const totalAllowances =
                  pay.allowances.housing +
                  pay.allowances.transport +
                  pay.allowances.medical +
                  pay.allowances.specialBonus;

                return (
                  <tr key={pay.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {pay.employeeName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{pay.department}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      ${pay.basicSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                      +${totalAllowances.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-600 dark:text-rose-400">
                      -${pay.totalDeductions.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ${pay.netSalary.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          updatePayrollStatus(pay.id, pay.status === "Paid" ? "Pending" : "Paid")
                        }
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          pay.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {pay.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActivePayslip(pay)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-semibold transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Payslip</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Payslip Modal */}
      {activePayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
            {/* Payslip Header */}
            <div className="p-6 bg-gradient-to-r from-blue-950 to-slate-900 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-black tracking-wider uppercase text-blue-300">
                    NEXA HR Global Technologies Inc.
                  </span>
                </div>
                <h2 className="text-xl font-black">Official Monthly Payslip</h2>
                <p className="text-xs text-slate-300 mt-0.5">Pay Period: {activePayslip.month} {activePayslip.year}</p>
              </div>

              <button
                onClick={() => setActivePayslip(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payslip Details Body */}
            <div className="p-6 space-y-6 text-xs">
              {/* Employee Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Employee Name</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{activePayslip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Department</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{activePayslip.department}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Designation</span>
                  <strong className="font-mono text-slate-900 dark:text-white">{activePayslip.designation}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Method</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{activePayslip.paymentMethod}</strong>
                </div>
              </div>

              {/* Earnings vs Deductions 2-Column Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2.5">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[11px] pb-1 border-b border-emerald-200 dark:border-emerald-800">
                    Earnings (Gross)
                  </h4>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Base Basic Pay</span>
                    <span className="font-mono">${activePayslip.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Housing Allowance</span>
                    <span className="font-mono">${activePayslip.allowances.housing.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Transport Allowance</span>
                    <span className="font-mono">${activePayslip.allowances.transport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Medical & Wellness</span>
                    <span className="font-mono">${activePayslip.allowances.medical.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Performance Bonus</span>
                    <span className="font-mono">${activePayslip.allowances.specialBonus.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 flex justify-between font-bold text-emerald-800 dark:text-emerald-300">
                    <span>Total Gross Earnings</span>
                    <span className="font-mono">${activePayslip.grossSalary.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-2.5">
                  <h4 className="font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider text-[11px] pb-1 border-b border-rose-200 dark:border-rose-800">
                    Withholdings & Deductions
                  </h4>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Income Tax (TDS / PAYE)</span>
                    <span className="font-mono">${activePayslip.deductions.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Provident Fund / 401(k)</span>
                    <span className="font-mono">${activePayslip.deductions.providentFund.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Health Insurance</span>
                    <span className="font-mono">${activePayslip.deductions.healthInsurance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Other Withholdings</span>
                    <span className="font-mono">${activePayslip.deductions.other.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-rose-200 dark:border-rose-800 flex justify-between font-bold text-rose-800 dark:text-rose-300">
                    <span>Total Deductions</span>
                    <span className="font-mono">${activePayslip.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight Card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Net Take-Home Pay</span>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                    ${activePayslip.netSalary.toLocaleString()} USD
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setActivePayslip(null)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
