import React, { useState, useEffect, useRef } from "react";
import { useHR } from "../../context/HRContext";
import { Search, Users, Building2, CalendarDays, Briefcase, Sparkles, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const SpotlightSearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, employees, departments, leaveRequests, jobOpenings, openEmployee360, setActiveTab } = useHR();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedEmployees = q
    ? employees.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
      ).slice(0, 5)
    : employees.slice(0, 3);

  const matchedDepartments = q
    ? departments.filter(
        (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.headName.toLowerCase().includes(q)
      ).slice(0, 3)
    : departments.slice(0, 2);

  const matchedLeaves = q
    ? leaveRequests.filter(
        (l) => l.employeeName.toLowerCase().includes(q) || l.leaveType.toLowerCase().includes(q) || l.status.toLowerCase().includes(q)
      ).slice(0, 3)
    : leaveRequests.filter((l) => l.status === "Pending").slice(0, 2);

  const matchedJobs = q
    ? jobOpenings.filter(
        (j) => j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.skills.some((s) => s.toLowerCase().includes(q))
      ).slice(0, 3)
    : jobOpenings.slice(0, 2);

  const handleSelectEmployee = (id: string) => {
    setSearchOpen(false);
    openEmployee360(id);
  };

  const handleSelectDepartment = (deptName: string) => {
    setSearchOpen(false);
    setActiveTab("departments", deptName);
  };

  const handleSelectLeave = () => {
    setSearchOpen(false);
    setActiveTab("leave");
  };

  const handleSelectJob = () => {
    setSearchOpen(false);
    setActiveTab("recruitment");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employees, departments, leave, open jobs, or type a command..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium text-slate-500 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {/* Quick action to ask NEXA AI */}
            {query && (
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setActiveTab("ai");
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 hover:border-blue-500/40 text-blue-700 dark:text-blue-300 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ask NEXA AI: &ldquo;{query}&rdquo;</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Generate instant HR analysis with Gemini</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Employees Section */}
            {matchedEmployees.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Employees
                </p>
                <div className="space-y-1">
                  {matchedEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleSelectEmployee(emp.id)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={emp.avatar}
                          alt={emp.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div className="truncate">
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                            {emp.fullName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {emp.designation} • {emp.department} • <span className="font-mono text-slate-400">{emp.employeeId}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 ml-2">
                        View 360° →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Departments Section */}
            {matchedDepartments.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Departments
                </p>
                <div className="space-y-1">
                  {matchedDepartments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => handleSelectDepartment(dept.name)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          {dept.code}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {dept.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Head: {dept.headName} • {dept.employeeCount} team members
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Leave Requests Section */}
            {matchedLeaves.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" /> Leave Requests
                </p>
                <div className="space-y-1">
                  {matchedLeaves.map((lev) => (
                    <button
                      key={lev.id}
                      onClick={handleSelectLeave}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {lev.employeeName} — {lev.leaveType} ({lev.days}d)
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {lev.startDate} to {lev.endDate} • Status: <span className="font-semibold text-amber-500">{lev.status}</span>
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Open Positions */}
            {matchedJobs.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Job Openings
                </p>
                <div className="space-y-1">
                  {matchedJobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={handleSelectJob}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {job.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {job.department} • {job.location} • {job.applicationsCount} applicants
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Use ↑↓ to navigate, ↵ to select</span>
            <span>NEXA HR Global Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
