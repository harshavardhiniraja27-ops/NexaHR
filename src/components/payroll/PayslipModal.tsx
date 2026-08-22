import React from "react";
import { PayrollRecord } from "../../types";
import {
  Building2,
  Printer,
  Download,
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Calendar,
} from "lucide-react";

interface PayslipModalProps {
  record: PayrollRecord;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ record, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Convert numbers to formatted currency string
  const formatCur = (val: number) => `$${val.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-bold tracking-tight">Official Salary Slip Document</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payslip Printable Body */}
        <div id="printable-payslip" className="p-8 overflow-y-auto space-y-6 flex-1 bg-white text-slate-800">
          {/* Company Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 text-white font-black text-xl rounded-xl flex items-center justify-center">
                N
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">NEXA HR GLOBAL SYSTEMS</h1>
                <p className="text-xs text-slate-500">100 Innovation Boulevard, Suite 400 • San Francisco, CA 94105</p>
                <p className="text-[11px] text-slate-400 font-mono">Tax ID: US-EIN-94-3829104 • support@nexahr.com</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-900 text-xs font-black rounded-lg border border-slate-200">
                PAYSLIP: {record.month?.toUpperCase() || "AUGUST 2026"}
              </span>
              <p className="text-xs text-slate-500 mt-1">Disbursal Date: {record.paymentDate || "2026-08-31"}</p>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center sm:justify-end gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Status: Verified & Disbursed
              </p>
            </div>
          </div>

          {/* Employee & Payment Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Employee Name</span>
              <p className="font-bold text-slate-900 mt-0.5">{record.employeeName}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Employee ID</span>
              <p className="font-bold text-slate-900 font-mono mt-0.5">{record.employeeCode || "EMP-1002"}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Department</span>
              <p className="font-bold text-slate-900 mt-0.5">{record.department}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Designation</span>
              <p className="font-bold text-slate-900 mt-0.5">{record.designation}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Method</span>
              <p className="font-semibold text-slate-800 mt-0.5">{record.paymentMethod || "Direct Deposit (ACH)"}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Bank Account</span>
              <p className="font-mono text-slate-800 mt-0.5">•••• •••• 8492</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Days Worked</span>
              <p className="font-semibold text-slate-800 mt-0.5">22 Days (Full Cycle)</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pay Currency</span>
              <p className="font-semibold text-slate-800 mt-0.5">USD ($)</p>
            </div>
          </div>

          {/* Dual Columns: Earnings vs Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Earnings Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-900 uppercase tracking-wider flex justify-between border-b border-slate-200">
                <span>Earnings Breakdown</span>
                <span>Amount ($)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-mono font-semibold">{formatCur(record.basicSalary)}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold">{formatCur(record.allowances?.housing || 0)}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Transport & Commute Allowance</span>
                  <span className="font-mono font-semibold">{formatCur(record.allowances?.transport || 0)}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Medical Allowance</span>
                  <span className="font-mono font-semibold">{formatCur(record.allowances?.medical || 0)}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Special Performance Bonus</span>
                  <span className="font-mono font-semibold">{formatCur(record.allowances?.specialBonus || 0)}</span>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 font-bold text-xs text-slate-900 flex justify-between border-t border-slate-200">
                <span>Total Gross Earnings (A)</span>
                <span className="font-mono text-sm text-slate-900">{formatCur(record.grossSalary)}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-900 uppercase tracking-wider flex justify-between border-b border-slate-200">
                <span>Statutory Deductions</span>
                <span>Amount ($)</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Federal & State Income Tax</span>
                  <span className="font-mono font-semibold text-rose-600">-{formatCur(record.deductions?.tax || 0)}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Provident Fund (PF / 401k)</span>
                  <span className="font-mono font-semibold text-rose-600">-{formatCur(record.deductions?.providentFund || 0)}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Healthcare Premium</span>
                  <span className="font-mono font-semibold text-rose-600">-{formatCur(record.deductions?.healthInsurance || 0)}</span>
                </div>
                <div className="px-4 py-2.5 flex justify-between">
                  <span className="text-slate-600">Unpaid Leave / Other Deductions</span>
                  <span className="font-mono font-semibold text-rose-600">-{formatCur(record.deductions?.other || 0)}</span>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 font-bold text-xs text-slate-900 flex justify-between border-t border-slate-200">
                <span>Total Deductions (B)</span>
                <span className="font-mono text-sm text-rose-700">-{formatCur(record.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Final Net Pay Block */}
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-600/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
                Net Disbursed Take-Home Salary (A - B)
              </span>
              <p className="text-xs text-emerald-700 mt-0.5 italic">
                Transferred via ACH direct deposit on {record.paymentDate || "August 31, 2026"}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-3xl font-black font-mono text-emerald-900">{formatCur(record.netSalary)}</span>
            </div>
          </div>

          {/* Authorized Signoff & Verification */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">NEXA HR Automated Payroll System</p>
              <p className="text-[11px] text-slate-400">This document is system-generated and certified cryptographically.</p>
            </div>

            <div className="text-left sm:text-right">
              <div className="w-36 border-b border-slate-400 mb-1" />
              <p className="font-bold text-slate-800">Sarah Jenkins</p>
              <p className="text-[11px] text-slate-400">VP of People & Culture / Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
