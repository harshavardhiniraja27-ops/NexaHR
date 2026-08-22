import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  CalendarCheck2,
  DollarSign,
  UserPlus,
  Trash2,
  CheckCheck,
  Filter,
} from "lucide-react";
import { HRNotification } from "../../types";

export const NotificationsManagement: React.FC = () => {
  const { notifications, markNotificationAsRead, setActiveTab } = useHR();
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "unread") return !notif.read;
    return notif.category === filterCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavigate = (targetModule?: string) => {
    if (targetModule) {
      setActiveTab(targetModule);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn" id="notifications-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Notification & Audit Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live organizational activity alerts, pending approvals, and system audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800">
            {unreadCount} Unread Alerts
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "All Activity" },
          { id: "unread", label: `Unread (${unreadCount})` },
          { id: "leave", label: "Leave Requests" },
          { id: "attendance", label: "Attendance" },
          { id: "payroll", label: "Payroll" },
          { id: "recruitment", label: "Recruitment" },
          { id: "system", label: "System Alerts" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterCategory(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === f.id
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List of Notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <Bell className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No notifications</h3>
          <p className="text-xs text-slate-400 mt-1">There are no notifications matching the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const isUnread = !notif.read;
            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (isUnread) markNotificationAsRead(notif.id);
                  if (notif.targetModule) handleNavigate(notif.targetModule);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isUnread
                    ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-2xs hover:border-blue-300"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      notif.severity === "critical"
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                        : notif.severity === "warning"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                        : notif.severity === "success"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                    }`}
                  >
                    {notif.category === "leave" && <CalendarCheck2 className="w-4 h-4" />}
                    {notif.category === "attendance" && <Clock className="w-4 h-4" />}
                    {notif.category === "payroll" && <DollarSign className="w-4 h-4" />}
                    {notif.category === "recruitment" && <UserPlus className="w-4 h-4" />}
                    {notif.category === "system" && <Info className="w-4 h-4" />}
                    {!["leave", "attendance", "payroll", "recruitment", "system"].includes(notif.category) && (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium mt-2 inline-block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                {notif.targetModule && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationAsRead(notif.id);
                      handleNavigate(notif.targetModule);
                    }}
                    className="shrink-0 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all"
                  >
                    View
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
