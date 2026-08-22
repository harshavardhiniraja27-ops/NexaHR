import React, { useState, useRef, useEffect } from "react";
import { useHR } from "../../context/HRContext";
import { UserRole } from "../../types";
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  UserCheck,
  CheckCheck,
  Plus,
  RefreshCw,
} from "lucide-react";
import { NEXAAIBriefModal } from "../dashboard/NEXAAIBriefModal";

interface TopNavbarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ collapsed, setCollapsed }) => {
  const {
    currentUser,
    switchRole,
    setSearchOpen,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    openEmployee360,
    employees,
    attendanceRecords,
    resetDemoData,
  } = useHR();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles: UserRole[] = ["HR Admin", "HR Manager", "HR Specialist", "Employee"];

  // Quick stats
  const presentCount = attendanceRecords.filter((a) => a.status === "Present").length;
  const attendancePercentage = Math.round((presentCount / (employees.length || 1)) * 100);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8 flex-shrink-0 transition-colors">
        {/* Left section: Toggle & Search Trigger */}
        <div className="flex items-center flex-1 max-w-md gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar Input / Trigger */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              onClick={() => setSearchOpen(true)}
              readOnly
              placeholder="Search employees, reports... (⌘K)"
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right section: Brief, Stats, Notifications, Role Switcher & New Hire CTA */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* AI Executive Brief Trigger */}
          <button
            onClick={() => setIsBriefOpen(true)}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Brief</span>
          </button>

          {/* Live Attendance indicator */}
          <div className="hidden lg:flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Attendance:{" "}
                <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{attendancePercentage}%</strong>
              </span>
            </span>
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={resetDemoData}
            title="Reset Fresh Demo Data"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.targetModule) {
                            setActiveTab(notif.targetModule);
                          }
                          if (notif.targetId && notif.targetId.startsWith("emp-")) {
                            openEmployee360(notif.targetId);
                          }
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-start space-x-3 ${
                          !notif.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                        }`}
                      >
                        <div className="mt-0.5">
                          {notif.severity === "critical" ? (
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                          ) : notif.severity === "warning" ? (
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setActiveTab("notifications");
                      setNotifDropdownOpen(false);
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    View All Notifications & Audit Logs
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">Switch Demo Role</div>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                      currentUser.role === r
                        ? "font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Primary Action: New Hire Button (if Admin) or My Attendance (if Employee) */}
          {currentUser.role === "Employee" ? (
            <button
              onClick={() => setActiveTab("attendance")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Punch Clock</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("employees", "add-new")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Hire</span>
            </button>
          )}
        </div>
      </header>

      {/* NEXA AI Executive Brief Modal */}
      <NEXAAIBriefModal isOpen={isBriefOpen} onClose={() => setIsBriefOpen(false)} />
    </>
  );
};
