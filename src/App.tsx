import React, { useState } from "react";
import { HRProvider, useHR } from "./context/HRContext";
import { Sidebar } from "./components/layout/Sidebar";
import { TopNavbar } from "./components/layout/TopNavbar";
import { SpotlightSearchModal } from "./components/layout/SpotlightSearchModal";
import { LoginPage } from "./components/auth/LoginPage";
import { ToastContainer } from "./components/common/ToastContainer";

import { MainDashboard } from "./components/dashboard/MainDashboard";
import { EmployeeDashboard } from "./components/dashboard/EmployeeDashboard";
import { EmployeeManagement } from "./components/employees/EmployeeManagement";
import { Employee360Modal } from "./components/employees/Employee360Modal";
import { DepartmentManagement } from "./components/departments/DepartmentManagement";
import { AttendanceManagement } from "./components/attendance/AttendanceManagement";
import { LeaveManagement } from "./components/leave/LeaveManagement";
import { PayrollManagement } from "./components/payroll/PayrollManagement";
import { RecruitmentManagement } from "./components/recruitment/RecruitmentManagement";
import { PerformanceManagement } from "./components/performance/PerformanceManagement";
import { ReportsAnalytics } from "./components/analytics/ReportsAnalytics";
import { ReportsManagement } from "./components/reports/ReportsManagement";
import { NotificationsManagement } from "./components/notifications/NotificationsManagement";
import { AIAssistantChat } from "./components/ai/AIAssistantChat";
import { SettingsView } from "./components/settings/SettingsView";

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    currentUser,
    activeTab,
    selectedEmployeeId,
    closeEmployee360,
  } = useHR();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Navigation Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Dynamic Main View */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            currentUser.role === "Employee" ? <EmployeeDashboard /> : <MainDashboard />
          )}
          {activeTab === "employees" && <EmployeeManagement />}
          {activeTab === "departments" && <DepartmentManagement />}
          {activeTab === "attendance" && <AttendanceManagement />}
          {activeTab === "leave" && <LeaveManagement />}
          {activeTab === "payroll" && <PayrollManagement />}
          {activeTab === "recruitment" && <RecruitmentManagement />}
          {activeTab === "performance" && <PerformanceManagement />}
          {activeTab === "analytics" && <ReportsAnalytics />}
          {activeTab === "reports" && <ReportsManagement />}
          {activeTab === "notifications" && <NotificationsManagement />}
          {activeTab === "ai" && <AIAssistantChat />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Global 360° Employee Intelligence Dossier Modal */}
      {selectedEmployeeId && (
        <Employee360Modal
          employeeId={selectedEmployeeId}
          onClose={closeEmployee360}
        />
      )}

      {/* Global Spotlight Search Modal (Cmd+K / Ctrl+K) */}
      <SpotlightSearchModal />

      {/* Global Toast Feedback Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HRProvider>
      <AppContent />
    </HRProvider>
  );
}
