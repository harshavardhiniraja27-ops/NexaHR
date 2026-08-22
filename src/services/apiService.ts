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
  UserProfile,
  UserRole,
  PipelineStage,
  LeaveType,
} from "../types";

const API_BASE = "/api";
const TOKEN_KEY = "nexa_auth_token";

let currentToken: string | null = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

export const apiService = {
  // Token management
  getToken(): string | null {
    if (!currentToken && typeof window !== "undefined") {
      currentToken = localStorage.getItem(TOKEN_KEY);
    }
    return currentToken;
  },

  setToken(token: string | null) {
    currentToken = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  },

  // Internal Authenticated Fetch Wrapper
  async authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    return res;
  },

  // Auth
  async login(email: string, role?: UserRole, password?: string): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }
    const data = await res.json();
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async switchDemoRole(role: UserRole): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to switch role");
    }
    const data = await res.json();
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  async getCurrentUser(): Promise<{ user: UserProfile }> {
    const res = await this.authFetch(`${API_BASE}/auth/me`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Unauthorized");
    }
    return res.json();
  },

  async logout(): Promise<void> {
    try {
      await this.authFetch(`${API_BASE}/auth/logout`, { method: "POST" });
    } finally {
      this.setToken(null);
    }
  },

  // Employees
  async getEmployees(params?: { department?: string; status?: string; search?: string }): Promise<Employee[]> {
    const searchParams = new URLSearchParams();
    if (params?.department) searchParams.append("department", params.department);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.search) searchParams.append("search", params.search);

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await this.authFetch(`${API_BASE}/employees${queryStr}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch employees");
    }
    return res.json();
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const res = await this.authFetch(`${API_BASE}/employees/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Employee not found");
    }
    return res.json();
  },

  async createEmployee(emp: Partial<Employee>): Promise<Employee> {
    const res = await this.authFetch(`${API_BASE}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emp),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create employee");
    }
    return res.json();
  },

  async updateEmployee(id: string, emp: Partial<Employee>): Promise<Employee> {
    const res = await this.authFetch(`${API_BASE}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emp),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update employee");
    }
    return res.json();
  },

  async deleteEmployee(id: string): Promise<{ success: boolean; id: string }> {
    const res = await this.authFetch(`${API_BASE}/employees/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete employee");
    }
    return res.json();
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    const res = await this.authFetch(`${API_BASE}/departments`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch departments");
    }
    return res.json();
  },

  async createDepartment(dept: Partial<Department>): Promise<Department> {
    const res = await this.authFetch(`${API_BASE}/departments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dept),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create department");
    }
    return res.json();
  },

  async updateDepartment(id: string, dept: Partial<Department>): Promise<Department> {
    const res = await this.authFetch(`${API_BASE}/departments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dept),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update department");
    }
    return res.json();
  },

  async deleteDepartment(id: string): Promise<{ success: boolean; id: string }> {
    const res = await this.authFetch(`${API_BASE}/departments/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete department");
    }
    return res.json();
  },

  // Attendance
  async getAttendance(params?: { date?: string; employeeId?: string; department?: string }): Promise<AttendanceRecord[]> {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.append("date", params.date);
    if (params?.employeeId) searchParams.append("employeeId", params.employeeId);
    if (params?.department) searchParams.append("department", params.department);

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await this.authFetch(`${API_BASE}/attendance${queryStr}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch attendance");
    }
    return res.json();
  },

  async checkIn(payload: { employeeId: string; date?: string; notes?: string }): Promise<AttendanceRecord> {
    const res = await this.authFetch(`${API_BASE}/attendance/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Check-in failed");
    }
    return res.json();
  },

  async checkOut(payload: { employeeId: string; date?: string; notes?: string }): Promise<AttendanceRecord> {
    const res = await this.authFetch(`${API_BASE}/attendance/check-out`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Check-out failed");
    }
    return res.json();
  },

  async markAttendanceManual(record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const res = await this.authFetch(`${API_BASE}/attendance/manual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to record attendance");
    }
    return res.json();
  },

  // Leave
  async getLeaveRequests(params?: { employeeId?: string; status?: string }): Promise<LeaveRequest[]> {
    const searchParams = new URLSearchParams();
    if (params?.employeeId) searchParams.append("employeeId", params.employeeId);
    if (params?.status) searchParams.append("status", params.status);

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await this.authFetch(`${API_BASE}/leave${queryStr}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch leave requests");
    }
    return res.json();
  },

  async applyLeave(payload: {
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<LeaveRequest> {
    const res = await this.authFetch(`${API_BASE}/leave/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to submit leave request");
    }
    return res.json();
  },

  async approveLeave(id: string, reviewerName: string = "HR Admin"): Promise<LeaveRequest> {
    const res = await this.authFetch(`${API_BASE}/leave/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewerName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to approve leave request");
    }
    return res.json();
  },

  async rejectLeave(id: string, reason: string, reviewerName: string = "HR Admin"): Promise<LeaveRequest> {
    const res = await this.authFetch(`${API_BASE}/leave/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, reviewerName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to reject leave request");
    }
    return res.json();
  },

  // Payroll
  async getPayrollRecords(params?: { month?: string; employeeId?: string }): Promise<PayrollRecord[]> {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.append("month", params.month);
    if (params?.employeeId) searchParams.append("employeeId", params.employeeId);

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await this.authFetch(`${API_BASE}/payroll${queryStr}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch payroll records");
    }
    return res.json();
  },

  async generatePayrollCycle(month: string): Promise<PayrollRecord[]> {
    const res = await this.authFetch(`${API_BASE}/payroll/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to generate payroll cycle");
    }
    return res.json();
  },

  async updatePayrollStatus(id: string, status: PayrollRecord["status"]): Promise<PayrollRecord> {
    const res = await this.authFetch(`${API_BASE}/payroll/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update payroll status");
    }
    return res.json();
  },

  // Recruitment
  async getJobOpenings(): Promise<JobOpening[]> {
    const res = await this.authFetch(`${API_BASE}/recruitment/positions`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch job openings");
    }
    return res.json();
  },

  async createJobOpening(job: Partial<JobOpening>): Promise<JobOpening> {
    const res = await this.authFetch(`${API_BASE}/recruitment/positions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create job opening");
    }
    return res.json();
  },

  async getCandidates(): Promise<CandidateApplication[]> {
    const res = await this.authFetch(`${API_BASE}/recruitment/candidates`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch candidates");
    }
    return res.json();
  },

  async updateCandidateStage(candidateId: string, stage: PipelineStage): Promise<CandidateApplication> {
    const res = await this.authFetch(`${API_BASE}/recruitment/candidates/${candidateId}/stage`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update candidate stage");
    }
    return res.json();
  },

  async convertCandidateToEmployee(candidateId: string, salary?: number): Promise<Employee> {
    const res = await this.authFetch(`${API_BASE}/recruitment/candidates/${candidateId}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salary }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to convert candidate to employee");
    }
    return res.json();
  },

  // AI
  async getAIBrief(): Promise<any> {
    const res = await this.authFetch(`${API_BASE}/ai/brief`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to generate AI brief");
    }
    return res.json();
  },

  async chatWithAI(prompt: string, conversationHistory?: any[], hrContext?: any): Promise<{ response: string; metrics?: any[] }> {
    const res = await this.authFetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, conversationHistory, hrContext }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "AI service failed");
    }
    return res.json();
  },

  async generateJobDescription(payload: { title: string; department: string; experience: string; skills: string }): Promise<{ jobDescription: string }> {
    const res = await this.authFetch(`${API_BASE}/ai/job-description`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to generate job description");
    }
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<HRNotification[]> {
    const res = await this.authFetch(`${API_BASE}/notifications`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch notifications");
    }
    return res.json();
  },

  async markNotificationAsRead(id: string): Promise<{ success: boolean }> {
    const res = await this.authFetch(`${API_BASE}/notifications/${id}/read`, {
      method: "PUT",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to mark notification as read");
    }
    return res.json();
  },

  async markAllNotificationsAsRead(): Promise<{ success: boolean }> {
    const res = await this.authFetch(`${API_BASE}/notifications/read-all`, {
      method: "PUT",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to mark all notifications as read");
    }
    return res.json();
  },

  // Performance Reviews
  async getPerformanceReviews(): Promise<PerformanceReview[]> {
    const res = await this.authFetch(`${API_BASE}/performance`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to fetch performance reviews");
    }
    return res.json();
  },

  async createPerformanceReview(review: Partial<PerformanceReview>): Promise<PerformanceReview> {
    const res = await this.authFetch(`${API_BASE}/performance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create performance review");
    }
    return res.json();
  },

  // Seed / Reset
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await this.authFetch(`${API_BASE}/seed/reset`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to reset database");
    }
    return res.json();
  },
};
