import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarCheck2,
  DollarSign,
  UserPlus,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Sparkles,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed: propCollapsed,
  setCollapsed: propSetCollapsed,
}) => {
  const { activeTab, setActiveTab, currentUser, logout, unreadNotificationsCount, leaveRequests } = useHR();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;

  const pendingLeavesCount = leaveRequests.filter((l) => l.status === "Pending").length;

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "employees", label: "Employees", icon: Users },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "attendance", label: "Attendance", icon: Clock },
    {
      id: "leave",
      label: "Leave Management",
      icon: CalendarCheck2,
      badge: pendingLeavesCount > 0 ? `${pendingLeavesCount}` : undefined,
      badgeColor: "bg-amber-500 text-white",
    },
    { id: "payroll", label: "Payroll", icon: DollarSign },
    { id: "recruitment", label: "Recruitment", icon: UserPlus },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "analytics", label: "HR Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
  ];

  const intelligenceItems = [
    {
      id: "ai",
      label: "NEXA AI Assistant",
      icon: Sparkles,
      highlight: true,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined,
      badgeColor: "bg-red-500 text-white",
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 flex flex-col flex-shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800/80 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
          <div className="w-4 h-4 bg-white rounded-xs" />
        </div>
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-xl tracking-tight">NEXA HR</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              PRO
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Core HR
          </div>
        )}

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center space-x-0 px-0" : ""}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? "text-white opacity-90" : "text-slate-400 opacity-70 group-hover:opacity-100"
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 font-medium">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Intelligence Section */}
        <div className="pt-4 pb-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3">
          {!collapsed ? "Intelligence & Admin" : "•••"}
        </div>

        {intelligenceItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white font-medium shadow-sm"
                  : item.highlight
                  ? "text-indigo-300 hover:bg-slate-800 hover:text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center space-x-0 px-0" : ""}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive
                    ? "text-white opacity-90"
                    : item.highlight
                    ? "text-indigo-400"
                    : "text-slate-400 opacity-70"
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 font-medium">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {!collapsed && item.highlight && !isActive && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <div className={`flex items-center space-x-3 px-1 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold text-sm shrink-0 ring-1 ring-slate-600">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-slate-400 text-xs truncate">{currentUser.role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
