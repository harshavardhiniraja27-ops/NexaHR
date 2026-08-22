import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Employee,
  Department,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  JobOpening,
  CandidateApplication,
  PerformanceReview,
  HRNotification,
  CommandCenterAlert,
  UserProfile,
  UserRole,
  PipelineStage,
} from "../types";
import {
  initialEmployees,
  initialDepartments,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialPayrollRecords,
  initialJobOpenings,
  initialCandidateApplications,
  initialPerformanceReviews,
  initialCommandAlerts,
  initialNotifications,
} from "../data/seedData";
import { apiService } from "../services/apiService";

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: "success" | "info" | "warning" | "error";
}

interface HRContextType {
  // Auth state
  isAuthenticated: boolean;
  currentUser: UserProfile;
  login: (email?: string, role?: UserRole, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string, filterParam?: string) => void;
  activeFilterParam: string | null;
  setActiveFilterParam: (param: string | null) => void;

  // Search
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Employee 360 modal
  selectedEmployeeId: string | null;
  openEmployee360: (empId: string) => void;
  closeEmployee360: () => void;

  // State entities
  employees: Employee[];
  departments: Department[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  jobOpenings: JobOpening[];
  candidateApplications: CandidateApplication[];
  performanceReviews: PerformanceReview[];
  commandAlerts: CommandCenterAlert[];
  notifications: HRNotification[];
  unreadNotificationsCount: number;

  // CRUD Actions
  addEmployee: (emp: Omit<Employee, "id" | "attendanceRate" | "performanceScore">) => Promise<void>;
  updateEmployee: (id: string, emp: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;

  addDepartment: (dept: Omit<Department, "id">) => Promise<void>;
  updateDepartment: (id: string, dept: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;

  // Attendance
  markAttendance: (record: Omit<AttendanceRecord, "id">) => Promise<void>;
  updateAttendanceStatus: (id: string, status: AttendanceRecord["status"], notes?: string) => void;
  checkIn: (employeeId: string, date?: string) => Promise<void>;
  checkOut: (employeeId: string, date?: string) => Promise<void>;

  // Leave
  submitLeaveRequest: (req: Omit<LeaveRequest, "id" | "status" | "appliedDate">) => Promise<void>;
  approveLeaveRequest: (id: string) => Promise<void>;
  rejectLeaveRequest: (id: string, reason?: string) => Promise<void>;

  // Payroll
  generatePayrollCycle: (month: string) => Promise<void>;
  updatePayrollStatus: (id: string, status: PayrollRecord["status"]) => Promise<void>;

  // Recruitment
  addJobOpening: (job: Omit<JobOpening, "id" | "postedDate" | "applicationsCount">) => Promise<void>;
  updateCandidateStage: (candidateId: string, newStage: PipelineStage) => Promise<void>;
  convertCandidateToEmployee: (candidateId: string, salary?: number) => Promise<void>;

  // Performance
  addPerformanceReview: (review: Omit<PerformanceReview, "id" | "reviewDate">) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Toast system
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;

  // Reset / Refresh demo data
  resetDemoData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const defaultAdminUser: UserProfile = {
  id: "usr-admin-1",
  name: "Sarah Jenkins",
  email: "admin@nexahr.com",
  role: "HR Admin",
  title: "VP of People & Culture",
  department: "Human Resources",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
};

const HRContext = createContext<HRContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = "nexa_hr_state_v2";

export const HRProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("nexa_hr_user") : null;
    return saved ? JSON.parse(saved) : defaultAdminUser;
  });

  const [activeTab, setActiveTabState] = useState<string>("dashboard");
  const [activeFilterParam, setActiveFilterParam] = useState<string | null>(null);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // HR Data states
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(initialPayrollRecords);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(initialJobOpenings);
  const [candidateApplications, setCandidateApplications] = useState<CandidateApplication[]>(initialCandidateApplications);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(initialPerformanceReviews);
  const [commandAlerts, setCommandAlerts] = useState<CommandCenterAlert[]>(initialCommandAlerts);
  const [notifications, setNotifications] = useState<HRNotification[]>(initialNotifications);

  // Fetch live from server on mount & after auth change
  const refreshAllData = async () => {
    try {
      const [emps, depts, atts, leaves, payroll, jobs, candidates, perf, notifs] = await Promise.all([
        apiService.getEmployees().catch(() => null),
        apiService.getDepartments().catch(() => null),
        apiService.getAttendance().catch(() => null),
        apiService.getLeaveRequests().catch(() => null),
        apiService.getPayrollRecords().catch(() => null),
        apiService.getJobOpenings().catch(() => null),
        apiService.getCandidates().catch(() => null),
        apiService.getPerformanceReviews().catch(() => null),
        apiService.getNotifications().catch(() => null),
      ]);

      if (emps) setEmployees(emps);
      if (depts) setDepartments(depts);
      if (atts) setAttendanceRecords(atts);
      if (leaves) setLeaveRequests(leaves);
      if (payroll) setPayrollRecords(payroll);
      if (jobs) setJobOpenings(jobs);
      if (candidates) setCandidateApplications(candidates);
      if (perf) setPerformanceReviews(perf);
      if (notifs) setNotifications(notifs);
    } catch (e) {
      console.warn("Initial data sync fallback to cached data");
    }
  };

  // Initial token bootstrap & login
  useEffect(() => {
    const initAuth = async () => {
      const existingToken = apiService.getToken();
      if (existingToken) {
        try {
          const res = await apiService.getCurrentUser();
          setCurrentUser(res.user);
          setIsAuthenticated(true);
        } catch {
          // Token expired or invalid, auto login with default admin
          const loginRes = await apiService.login("admin@nexahr.com", "HR Admin");
          setCurrentUser(loginRes.user);
          setIsAuthenticated(true);
        }
      } else {
        try {
          const loginRes = await apiService.login("admin@nexahr.com", "HR Admin");
          setCurrentUser(loginRes.user);
          setIsAuthenticated(true);
        } catch {
          setIsAuthenticated(true);
        }
      }
      await refreshAllData();
    };

    initAuth();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("nexa_hr_auth", JSON.stringify(isAuthenticated));
    localStorage.setItem("nexa_hr_user", JSON.stringify(currentUser));
  }, [isAuthenticated, currentUser]);

  // Toast Helpers
  const addToast = (title: string, message?: string, type: ToastMessage["type"] = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Operations
  const login = async (email = "admin@nexahr.com", role?: UserRole, password?: string) => {
    try {
      const res = await apiService.login(email, role, password);
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      await refreshAllData();
      addToast(`Welcome, ${res.user.name}`, `Signed in with ${res.user.role} privileges.`, "success");
    } catch (e: any) {
      addToast("Authentication Error", e.message || "Failed to log in", "error");
      throw e;
    }
  };

  const logout = async () => {
    await apiService.logout();
    setIsAuthenticated(false);
    addToast("Signed Out", "You have securely signed out of NEXA HR.", "info");
  };

  const switchRole = async (newRole: UserRole) => {
    try {
      const res = await apiService.switchDemoRole(newRole);
      setCurrentUser(res.user);
      await refreshAllData();

      // Guard tab navigation
      if (newRole === "Employee") {
        if (["recruitment", "performance", "settings"].includes(activeTab)) {
          setActiveTabState("dashboard");
        }
        addToast("Switched to Employee View", `Authenticated as ${res.user.name} (${res.user.title}).`, "info");
      } else {
        addToast(`Switched to ${newRole} View`, "Full administrative controls active.", "info");
      }
    } catch (err: any) {
      addToast("Switch Role Failed", err.message || "Could not switch role.", "error");
    }
  };

  const setActiveTab = (tab: string, filterParam?: string) => {
    setActiveTabState(tab);
    if (filterParam !== undefined) {
      setActiveFilterParam(filterParam);
    }
  };

  const openEmployee360 = (empId: string) => setSelectedEmployeeId(empId);
  const closeEmployee360 = () => setSelectedEmployeeId(null);

  // Employee Operations
  const addEmployee = async (empData: Omit<Employee, "id" | "attendanceRate" | "performanceScore">) => {
    try {
      const newEmp = await apiService.createEmployee(empData);
      setEmployees((prev) => [newEmp, ...prev]);
      addToast("Employee Created", `${newEmp.fullName} added to ${newEmp.department}.`, "success");
      await refreshAllData();
    } catch (err: any) {
      addToast("Creation Failed", err.message || "Could not create employee.", "error");
    }
  };

  const updateEmployee = async (id: string, updatedData: Partial<Employee>) => {
    try {
      const updated = await apiService.updateEmployee(id, updatedData);
      setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
      addToast("Employee Profile Updated", "Changes saved successfully.", "success");
      await refreshAllData();
    } catch (err: any) {
      addToast("Update Failed", err.message || "Could not update employee.", "error");
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await apiService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      addToast("Employee Removed", "Employee record removed from active roster.", "info");
      await refreshAllData();
    } catch (err: any) {
      addToast("Delete Failed", err.message || "Could not delete employee.", "error");
    }
  };

  // Department Operations
  const addDepartment = async (deptData: Omit<Department, "id">) => {
    try {
      const newDept = await apiService.createDepartment(deptData);
      setDepartments((prev) => [...prev, newDept]);
      addToast("Department Created", `${newDept.name} created successfully.`, "success");
      await refreshAllData();
    } catch (err: any) {
      addToast("Department Creation Failed", err.message || "Could not create department.", "error");
    }
  };

  const updateDepartment = async (id: string, deptData: Partial<Department>) => {
    try {
      const updated = await apiService.updateDepartment(id, deptData);
      setDepartments((prev) => prev.map((d) => (d.id === id ? updated : d)));
      addToast("Department Updated", "Department configuration saved.", "success");
      await refreshAllData();
    } catch (err: any) {
      addToast("Update Failed", err.message || "Could not update department.", "error");
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      await apiService.deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      addToast("Department Deleted", "Department removed.", "info");
      await refreshAllData();
    } catch (err: any) {
      addToast("Delete Failed", err.message || "Could not delete department.", "error");
    }
  };

  // Attendance Operations
  const markAttendance = async (recordData: Omit<AttendanceRecord, "id">) => {
    try {
      const newRec = await apiService.markAttendanceManual(recordData);
      setAttendanceRecords((prev) => [
        newRec,
        ...prev.filter((r) => !(r.employeeId === newRec.employeeId && r.date === newRec.date)),
      ]);
      addToast("Attendance Marked", `${newRec.employeeName} marked as ${newRec.status}.`, "success");
    } catch (err: any) {
      addToast("Attendance Failed", err.message || "Could not mark attendance.", "error");
    }
  };

  const updateAttendanceStatus = (id: string, status: AttendanceRecord["status"], notes?: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, notes: notes || r.notes } : r))
    );
    addToast("Attendance Record Updated", `Status updated to ${status}.`, "success");
  };

  const checkIn = async (employeeId: string, date?: string) => {
    try {
      const rec = await apiService.checkIn({ employeeId, date });
      setAttendanceRecords((prev) => [
        rec,
        ...prev.filter((r) => !(r.employeeId === rec.employeeId && r.date === rec.date)),
      ]);
      addToast(
        rec.status === "Late" ? "Checked In (Late Notice)" : "Checked In Successfully",
        `Punched in at ${rec.checkIn}. Status: ${rec.status}.`,
        rec.status === "Late" ? "warning" : "success"
      );
    } catch (err: any) {
      addToast("Check-In Error", err.message || "Could not check in.", "error");
    }
  };

  const checkOut = async (employeeId: string, date?: string) => {
    try {
      const rec = await apiService.checkOut({ employeeId, date });
      setAttendanceRecords((prev) =>
        prev.map((r) => (r.employeeId === rec.employeeId && r.date === rec.date ? rec : r))
      );
      addToast("Checked Out Successfully", `Punched out at ${rec.checkOut}. Total hours: ${rec.workingHours} hrs.`, "success");
    } catch (err: any) {
      addToast("Check-Out Error", err.message || "Could not check out.", "error");
    }
  };

  // Leave Operations
  const submitLeaveRequest = async (reqData: Omit<LeaveRequest, "id" | "status" | "appliedDate">) => {
    try {
      const newReq = await apiService.applyLeave({
        employeeId: reqData.employeeId,
        leaveType: reqData.leaveType,
        startDate: reqData.startDate,
        endDate: reqData.endDate,
        reason: reqData.reason,
      });
      setLeaveRequests((prev) => [newReq, ...prev]);
      addToast("Leave Application Submitted", `${newReq.days} days requested for ${newReq.leaveType}.`, "success");
    } catch (err: any) {
      addToast("Leave Application Failed", err.message || "Validation error.", "error");
    }
  };

  const approveLeaveRequest = async (id: string) => {
    try {
      const approved = await apiService.approveLeave(id, currentUser.name);
      setLeaveRequests((prev) => prev.map((l) => (l.id === id ? approved : l)));
      await refreshAllData();
      addToast("Leave Approved", `Approved ${approved.days} days for ${approved.employeeName}.`, "success");
    } catch (err: any) {
      addToast("Approval Error", err.message || "Failed to approve.", "error");
    }
  };

  const rejectLeaveRequest = async (id: string, reason?: string) => {
    try {
      const rejected = await apiService.rejectLeave(id, reason || "Scheduling conflict", currentUser.name);
      setLeaveRequests((prev) => prev.map((l) => (l.id === id ? rejected : l)));
      addToast("Leave Request Declined", `Declined for ${rejected.employeeName}.`, "info");
    } catch (err: any) {
      addToast("Rejection Error", err.message || "Failed to decline.", "error");
    }
  };

  // Payroll Operations
  const generatePayrollCycle = async (month: string) => {
    try {
      const records = await apiService.generatePayrollCycle(month);
      setPayrollRecords(records);
      addToast("Payroll Processed & Disbursed", `Generated payslips for ${records.length} employees (${month}).`, "success");
    } catch (err: any) {
      addToast("Payroll Generation Failed", err.message || "Please check server logs.", "error");
    }
  };

  const updatePayrollStatus = async (id: string, status: PayrollRecord["status"]) => {
    try {
      const updated = await apiService.updatePayrollStatus(id, status);
      setPayrollRecords((prev) => prev.map((p) => (p.id === id ? updated : p)));
      addToast("Payroll Status Updated", `Marked as ${status}.`, "success");
    } catch (err: any) {
      addToast("Status Update Failed", err.message || "Could not update payroll status.", "error");
    }
  };

  // Recruitment Operations
  const addJobOpening = async (jobData: Omit<JobOpening, "id" | "postedDate" | "applicationsCount">) => {
    try {
      const newJob = await apiService.createJobOpening(jobData);
      setJobOpenings((prev) => [newJob, ...prev]);
      addToast("Job Requisition Published", `${newJob.title} is now open for applicants.`, "success");
    } catch (err: any) {
      addToast("Publish Failed", err.message || "Could not publish job requisition.", "error");
    }
  };

  const updateCandidateStage = async (candidateId: string, newStage: PipelineStage) => {
    try {
      const updated = await apiService.updateCandidateStage(candidateId, newStage);
      setCandidateApplications((prev) =>
        prev.map((c) => (c.id === candidateId ? updated : c))
      );
      addToast("Candidate Pipeline Updated", `${updated.candidateName} moved to ${newStage}.`, "info");
    } catch (err: any) {
      addToast("Update Failed", err.message || "Could not update candidate stage.", "error");
    }
  };

  const convertCandidateToEmployee = async (candidateId: string, salary?: number) => {
    try {
      const newEmp = await apiService.convertCandidateToEmployee(candidateId, salary);
      setEmployees((prev) => [newEmp, ...prev]);
      setCandidateApplications((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, stage: "Selected" } : c))
      );
      addToast(
        "Candidate Converted to Employee!",
        `${newEmp.fullName} hired as ${newEmp.designation} in ${newEmp.department}!`,
        "success"
      );
      await refreshAllData();
    } catch (err: any) {
      addToast("Conversion Failed", err.message || "Could not convert candidate.", "error");
    }
  };

  // Performance Reviews
  const addPerformanceReview = async (review: Omit<PerformanceReview, "id" | "reviewDate">) => {
    try {
      const created = await apiService.createPerformanceReview(review);
      setPerformanceReviews((prev) => [created, ...prev]);
      addToast("Performance Appraisal Recorded", `Appraisal logged for ${review.employeeName}.`, "success");
    } catch (err: any) {
      addToast("Appraisal Failed", err.message || "Could not record performance review.", "error");
    }
  };

  // Notifications
  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await apiService.markNotificationAsRead(id);
    } catch (e) {
      // local cache updated
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("Notifications Cleared", "All alerts marked as read.", "info");
    try {
      await apiService.markAllNotificationsAsRead();
    } catch (e) {
      // local cache updated
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Reset Demo Baseline
  const resetDemoData = async () => {
    try {
      await apiService.resetDatabase();
      await refreshAllData();
      addToast("Database Reset", "System restored to pristine demonstration baseline.", "success");
    } catch (e: any) {
      addToast("Reset Failed", e.message || "Could not reset database.", "error");
    }
  };

  return (
    <HRContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        logout,
        switchRole,
        activeTab,
        setActiveTab,
        activeFilterParam,
        setActiveFilterParam,
        isSearchOpen,
        setSearchOpen,
        selectedEmployeeId,
        openEmployee360,
        closeEmployee360,
        employees,
        departments,
        attendanceRecords,
        leaveRequests,
        payrollRecords,
        jobOpenings,
        candidateApplications,
        performanceReviews,
        commandAlerts,
        notifications,
        unreadNotificationsCount,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        markAttendance,
        updateAttendanceStatus,
        checkIn,
        checkOut,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        generatePayrollCycle,
        updatePayrollStatus,
        addJobOpening,
        updateCandidateStage,
        convertCandidateToEmployee,
        addPerformanceReview,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        refreshAllData,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = (): HRContextType => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error("useHR must be used within an HRProvider");
  }
  return context;
};
