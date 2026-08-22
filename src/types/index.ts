export type UserRole = "HR Admin" | "HR Manager" | "HR Specialist" | "Employee";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  department: string;
  employeeId?: string;
}

export type EmploymentType = "Full-Time" | "Part-Time" | "Contract" | "Internship";
export type EmployeeStatus = "Active" | "On Leave" | "Probation" | "Terminated";
export type Gender = "Male" | "Female" | "Non-Binary" | "Prefer not to say";

export interface Employee {
  id: string;
  employeeId: string; // e.g. "EMP-1001"
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  address: string;
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: EmploymentType;
  salary: number;
  manager: string;
  status: EmployeeStatus;
  skills: string[];
  avatar: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  attendanceRate: number;
  performanceScore: number;
  leaveBalance: {
    casual: number;
    sick: number;
    earned: number;
    emergency: number;
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  headAvatar: string;
  employeeCount: number;
  avgAttendance: number; // percentage e.g. 93.4
  avgPerformance: number; // out of 5.0 e.g. 4.3
  payrollCost: number; // monthly total e.g. 84000
  budget: number;
  description: string;
  color: string;
}

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm or "-"
  checkOut: string; // HH:mm or "-"
  workingHours: number; // e.g. 8.5
  status: AttendanceStatus;
  notes?: string;
}

export type LeaveType = "Casual Leave" | "Sick Leave" | "Earned Leave" | "Emergency Leave";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  designation: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export type PayrollStatus = "Paid" | "Pending" | "Processing";

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeAvatar: string;
  designation: string;
  department: string;
  month: string; // e.g. "August 2026"
  basicSalary: number;
  allowances: {
    housing: number;
    transport: number;
    medical: number;
    specialBonus: number;
  };
  deductions: {
    tax: number;
    providentFund: number;
    healthInsurance: number;
    other: number;
  };
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: PayrollStatus;
  paymentDate?: string;
  paymentMethod: string;
}

export type JobStatus = "Active" | "Draft" | "Closed" | "On Hold";
export type PipelineStage = "Applied" | "Screening" | "Interview" | "Shortlisted" | "Selected" | "Rejected";

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  experience: string;
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  status: JobStatus;
  postedDate: string;
  applicationsCount: number;
  description: string;
  hiringManager: string;
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  avatar: string;
  experienceYears: number;
  currentCompany: string;
  skills: string[];
  stage: PipelineStage;
  appliedDate: string;
  rating: number; // 1-5
  resumeUrl?: string;
  notes: string;
}

export interface PerformanceGoal {
  id: string;
  title: string;
  category: "Strategic" | "Operational" | "Leadership" | "Technical";
  targetScore: number;
  achievedScore: number;
  status: "Completed" | "In Progress" | "Needs Attention";
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  designation: string;
  department: string;
  reviewPeriod: string;
  overallRating: number; // 1.0 - 5.0
  reviewDate: string;
  reviewerName: string;
  goals: PerformanceGoal[];
  achievements: string[];
  strengths: string[];
  areasForImprovement: string[];
  feedback: string;
  promotionRecommended: boolean;
}

export type NotificationCategory = "leave" | "attendance" | "payroll" | "recruitment" | "performance" | "system";

export interface HRNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  targetModule?: string;
  targetId?: string;
  severity?: "info" | "warning" | "success" | "critical";
}

export type AlertSeverity = "critical" | "action" | "monitor" | "positive";

export interface CommandCenterAlert {
  id: string;
  severity: AlertSeverity;
  category: "attendance" | "leave" | "recruitment" | "payroll" | "performance" | "milestone";
  title: string;
  description: string;
  metric: string;
  actionText: string;
  targetModule: string;
  filterParam?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  metrics?: Array<{ label: string; value: string; trend?: string }>;
  suggestedFollowUps?: string[];
}
