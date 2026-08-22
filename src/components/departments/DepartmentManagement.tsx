import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import { Department } from "../../types";
import {
  Building2,
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  X,
  Mail,
  UserCheck,
} from "lucide-react";

export const DepartmentManagement: React.FC = () => {
  const {
    departments,
    employees,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    openEmployee360,
  } = useHR();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deptToEdit, setDeptToEdit] = useState<Department | null>(null);
  const [viewDeptDetails, setViewDeptDetails] = useState<Department | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    headName: "",
    headAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    budget: 150000,
    color: "#3b82f6",
  });

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.headName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setDeptToEdit(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      headName: employees[0]?.fullName || "Jane Doe",
      headAvatar: employees[0]?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      budget: 200000,
      color: "#3b82f6",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setDeptToEdit(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description,
      headName: dept.headName,
      headAvatar: dept.headAvatar,
      budget: dept.budget,
      color: dept.color,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deptToEdit) {
      updateDepartment(deptToEdit.id, {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        headName: formData.headName,
        headAvatar: formData.headAvatar,
        budget: Number(formData.budget),
        color: formData.color,
      });
    } else {
      addDepartment({
        name: formData.name,
        code: formData.code.toUpperCase(),
        description: formData.description,
        headName: formData.headName,
        headAvatar: formData.headAvatar,
        employeeCount: 0,
        avgAttendance: 96.0,
        avgPerformance: 4.5,
        payrollCost: 0,
        budget: Number(formData.budget),
        color: formData.color,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Department Architecture ({departments.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Structure organizational units, leaders, headcounts, budgets, and project allocations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Department</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search department, code, or leader..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDepts.map((dept) => {
          const deptEmployees = employees.filter((e) => e.department === dept.name);
          const deptPayroll = deptEmployees.reduce((acc, curr) => acc + curr.salary, 0);

          return (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Code Badge + Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color || "#3b82f6" }}
                    />
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {dept.code}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                      {dept.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      title="Edit Department"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {departments.length > 1 && (
                      <button
                        onClick={() => deleteDepartment(dept.id)}
                        title="Delete Department"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {dept.description}
                </p>

                {/* Department Leader */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-4">
                  <img
                    src={dept.headAvatar}
                    alt={dept.headName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Department Head
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {dept.headName}
                    </span>
                  </div>
                </div>

                {/* Metrics 4-grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3 text-blue-500" /> Headcount
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {deptEmployees.length} Members
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <DollarSign className="w-3 h-3 text-emerald-500" /> Annual Cost
                    </span>
                    <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                      ${Math.round(deptPayroll / 1000)}k
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <TrendingUp className="w-3 h-3 text-indigo-500" /> Attendance
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {dept.avgAttendance}%
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Briefcase className="w-3 h-3 text-purple-500" /> Budget
                    </span>
                    <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                      ${(dept.budget / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <button
                  onClick={() => setViewDeptDetails(dept)}
                  className="hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Team Roster ({deptEmployees.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Department Details & Roster Modal */}
      {viewDeptDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {viewDeptDetails.name} Team Roster
                  </h3>
                  <p className="text-xs text-slate-500">
                    Leader: {viewDeptDetails.headName} • Code: {viewDeptDetails.code}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewDeptDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Roster List */}
            <div className="p-5 overflow-y-auto flex-1 space-y-2.5">
              {employees
                .filter((e) => e.department === viewDeptDetails.name)
                .map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {emp.fullName}
                        </span>
                        <span className="text-[11px] text-slate-500 block">{emp.designation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                        ${emp.salary.toLocaleString()}/yr
                      </span>
                      <button
                        onClick={() => {
                          setViewDeptDetails(null);
                          openEmployee360(emp.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors"
                      >
                        360° Profile
                      </button>
                    </div>
                  </div>
                ))}

              {employees.filter((e) => e.department === viewDeptDetails.name).length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No employees assigned to this department yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {deptToEdit ? "Edit Department" : "Create New Department"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department Code (3-4 Letters) *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. AI"
                  className="w-full uppercase bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department Head *
                </label>
                <input
                  type="text"
                  value={formData.headName}
                  onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                  placeholder="Leader Full Name"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Annual Department Budget ($)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Department scope and charter..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
                >
                  {deptToEdit ? "Save Changes" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
