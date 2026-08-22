import React, { useState, useEffect } from "react";
import { useHR } from "../../context/HRContext";
import { Employee, EmploymentType, EmployeeStatus, Gender } from "../../types";
import { X, User, Briefcase, Phone, Mail, DollarSign, Calendar, MapPin, Sparkles } from "lucide-react";

interface AddEditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

export const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
}) => {
  const { addEmployee, updateEmployee, departments } = useHR();

  const [formData, setFormData] = useState({
    employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Prefer not to say" as Gender,
    dob: "1995-01-01",
    address: "",
    department: departments[0]?.name || "Engineering",
    designation: "",
    joiningDate: new Date().toISOString().split("T")[0],
    employmentType: "Full-Time" as EmploymentType,
    salary: 85000,
    manager: "Dr. Marcus Vance",
    status: "Active" as EmployeeStatus,
    skills: "React, TypeScript, Collaboration",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    emergencyName: "",
    emergencyRelation: "Spouse",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        employeeId: employeeToEdit.employeeId,
        firstName: employeeToEdit.firstName,
        lastName: employeeToEdit.lastName,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        gender: employeeToEdit.gender,
        dob: employeeToEdit.dob,
        address: employeeToEdit.address,
        department: employeeToEdit.department,
        designation: employeeToEdit.designation,
        joiningDate: employeeToEdit.joiningDate,
        employmentType: employeeToEdit.employmentType,
        salary: employeeToEdit.salary,
        manager: employeeToEdit.manager,
        status: employeeToEdit.status,
        skills: employeeToEdit.skills.join(", "),
        avatar: employeeToEdit.avatar,
        emergencyName: employeeToEdit.emergencyContact.name,
        emergencyRelation: employeeToEdit.emergencyContact.relationship,
        emergencyPhone: employeeToEdit.emergencyContact.phone,
      });
    } else {
      setFormData({
        employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "Female",
        dob: "1995-05-15",
        address: "San Francisco, CA",
        department: departments[0]?.name || "Engineering",
        designation: "Software Engineer",
        joiningDate: new Date().toISOString().split("T")[0],
        employmentType: "Full-Time",
        salary: 110000,
        manager: "Dr. Marcus Vance",
        status: "Active",
        skills: "TypeScript, React, Node.js, Problem Solving",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        emergencyName: "Jane Doe",
        emergencyRelation: "Spouse",
        emergencyPhone: "+1 (555) 000-1122",
      });
    }
    setErrors({});
  }, [employeeToEdit, isOpen, departments]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) errs.email = "Valid work email is required";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    if (!formData.designation.trim()) errs.designation = "Job title/designation is required";
    if (!formData.salary || Number(formData.salary) <= 0) errs.salary = "Salary must be positive";
    if (!formData.department) errs.department = "Department is required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      employeeId: formData.employeeId,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      dob: formData.dob,
      address: formData.address.trim(),
      department: formData.department,
      designation: formData.designation.trim(),
      joiningDate: formData.joiningDate,
      employmentType: formData.employmentType,
      salary: Number(formData.salary),
      manager: formData.manager.trim() || "Executive Leadership",
      status: formData.status,
      skills: skillsArray.length > 0 ? skillsArray : ["Generalist"],
      avatar: formData.avatar,
      emergencyContact: {
        name: formData.emergencyName || "Contact On File",
        relationship: formData.emergencyRelation || "Family",
        phone: formData.emergencyPhone || "+1 (555) 000-0000",
      },
      leaveBalance: employeeToEdit ? employeeToEdit.leaveBalance : { casual: 8, sick: 10, earned: 14, emergency: 3 },
    };

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, payload);
    } else {
      addEmployee(payload);
    }

    onClose();
  };

  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {employeeToEdit ? "Edit Employee Profile" : "Onboard New Employee"}
              </h3>
              <p className="text-xs text-slate-500">
                {employeeToEdit
                  ? `Modifying record for ${employeeToEdit.fullName} (${employeeToEdit.employeeId})`
                  : "Complete employee record for organizational directory & payroll system."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Profile Photo</label>
            <div className="flex items-center gap-3">
              <img
                src={formData.avatar}
                alt="Selected Avatar"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500 shrink-0"
              />
              <div className="flex flex-wrap gap-2">
                {avatarPresets.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset}
                    alt={`Preset ${idx + 1}`}
                    onClick={() => setFormData({ ...formData, avatar: preset })}
                    className={`w-9 h-9 rounded-xl object-cover cursor-pointer transition-all ${
                      formData.avatar === preset
                        ? "ring-2 ring-blue-500 scale-105"
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white ${
                  errors.firstName ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                }`}
                required
              />
              {errors.firstName && <span className="text-[10px] text-rose-500">{errors.firstName}</span>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white ${
                  errors.lastName ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                }`}
                required
              />
              {errors.lastName && <span className="text-[10px] text-rose-500">{errors.lastName}</span>}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@nexahr.io"
                  className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white ${
                    errors.email ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                  }`}
                  required
                />
              </div>
              {errors.email && <span className="text-[10px] text-rose-500">{errors.email}</span>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 012-3456"
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Job & Department Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Designation / Job Title *
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Senior Full Stack Engineer"
                className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl px-3 py-2 text-slate-900 dark:text-white ${
                  errors.designation ? "border-rose-500" : "border-slate-300 dark:border-slate-700"
                }`}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Employment Type
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Compensation & Management */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Annual Base Salary ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                  placeholder="120000"
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Joining Date
              </label>
              <input
                type="date"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Probation">Probation</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. React, Node.js, GraphQL, Team Leadership"
              className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          {/* Emergency Contact Section */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-500" /> Emergency Contact
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  placeholder="Contact Name"
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.emergencyRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  placeholder="Relationship (e.g. Spouse)"
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="Contact Phone"
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              {employeeToEdit ? "Save Changes" : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
