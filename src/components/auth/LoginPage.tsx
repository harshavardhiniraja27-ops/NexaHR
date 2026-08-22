import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import { UserRole } from "../../types";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, Building2, Sparkles, Users } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login } = useHR();
  const [email, setEmail] = useState("sarah.jenkins@nexahr.io");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("HR Admin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid business email address.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(email, selectedRole);
    }, 450);
  };

  const handleDemoQuickLogin = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "HR Admin") {
      setEmail("sarah.jenkins@nexahr.io");
    } else if (role === "HR Manager") {
      setEmail("david.chen@nexahr.io");
    } else {
      setEmail("zoe.washington@nexahr.io");
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(
        role === "HR Admin" ? "sarah.jenkins@nexahr.io" : role === "HR Manager" ? "david.chen@nexahr.io" : "zoe.washington@nexahr.io",
        role
      );
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Left Column: Commercial SaaS Branding & Live Value Props */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border-r border-slate-800/80 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/25">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-white">NEXA HR</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Enterprise AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Intelligent Human Resource Management Platform</p>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="space-y-6 my-auto relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Decision Support Engine
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Orchestrate your workforce with intelligence & clarity.
          </h1>

          <p className="text-slate-300 text-sm xl:text-base leading-relaxed">
            Real-time workforce telemetry, automated attendance reconciliation, multi-tier leave workflows, one-click payroll disbursement, and Gemini-powered decision support.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <Users className="w-5 h-5 text-blue-400 mb-2" />
              <p className="text-sm font-semibold text-white">Employee 360°</p>
              <p className="text-xs text-slate-400 mt-1">Holistic view of attendance, leave balance, payroll & reviews.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <Building2 className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-white">Command Center</p>
              <p className="text-xs text-slate-400 mt-1">Real-time alerts identifying attendance anomalies & bottlenecks.</p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof / Trust Badge */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC2 Type II Certified & GDPR Compliant</span>
          </div>
          <span>v2.5 Enterprise Edition</span>
        </div>
      </div>

      {/* Right Column: Login Form & Demo Presets */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <span className="font-extrabold text-xl text-white">NEXA HR</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome to NEXA HR
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Sign in with your enterprise credentials or use one-click demo presets.
            </p>
          </div>

          {/* Quick Demo Access Presets */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Hackathon One-Click Demo Logins:
              </span>
              <span className="text-[10px] text-slate-400">Instant Access</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoQuickLogin("HR Admin")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                  selectedRole === "HR Admin"
                    ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                    : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                }`}
              >
                HR Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuickLogin("HR Manager")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                  selectedRole === "HR Manager"
                    ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                    : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                }`}
              >
                HR Manager
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuickLogin("HR Specialist")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                  selectedRole === "HR Specialist"
                    ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                    : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                }`}
              >
                Specialist
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordModalOpen(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Role select */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Remember this device for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to NEXA HR</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-500">
            Protected by enterprise end-to-end encryption & role-based access control.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Reset Password</h3>
            <p className="text-xs text-slate-400">
              Enter your work email address to receive password reset instructions.
            </p>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Password reset link sent! Check your inbox.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordModalOpen(false);
                  setResetSent(false);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
