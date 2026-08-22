import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import { PerformanceReview } from "../../types";
import {
  TrendingUp,
  Star,
  Award,
  Target,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Eye,
  X,
  Sparkles,
} from "lucide-react";

export const PerformanceManagement: React.FC = () => {
  const {
    performanceReviews,
    employees,
    departments,
    addPerformanceReview,
    openEmployee360,
  } = useHR();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || "",
    reviewPeriod: "Q2 2026",
    overallRating: 4.8,
    reviewerName: "Dr. Marcus Vance",
    goal1Title: "System Architecture Redesign",
    goal1Target: 100,
    goal1Achieved: 95,
    goal2Title: "Mentorship & Team Sprint Delivery",
    goal2Target: 100,
    goal2Achieved: 90,
    strengths: "Deep TypeScript expertise, stellar cross-functional communication",
    improvements: "Increase automated integration test coverage",
    feedback: "Exceptional technical execution throughout the quarter.",
    promotionRecommended: true,
  });

  const filteredReviews = performanceReviews.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || r.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const avgRating = (
    performanceReviews.reduce((acc, curr) => acc + curr.overallRating, 0) /
    (performanceReviews.length || 1)
  ).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === formData.employeeId) || employees[0];
    if (!emp) return;

    addPerformanceReview({
      employeeId: emp.id,
      employeeName: emp.fullName,
      employeeAvatar: emp.avatar,
      designation: emp.designation,
      department: emp.department,
      reviewPeriod: formData.reviewPeriod,
      reviewerName: formData.reviewerName,
      overallRating: Number(formData.overallRating),
      goals: [
        {
          id: `g-${Date.now()}-1`,
          title: formData.goal1Title,
          category: "Technical",
          targetScore: Number(formData.goal1Target),
          achievedScore: Number(formData.goal1Achieved),
          status: "Completed",
        },
        {
          id: `g-${Date.now()}-2`,
          title: formData.goal2Title,
          category: "Leadership",
          targetScore: Number(formData.goal2Target),
          achievedScore: Number(formData.goal2Achieved),
          status: "Completed",
        },
      ],
      achievements: ["Successfully delivered mission-critical product features ahead of schedule"],
      strengths: formData.strengths.split(",").map((s) => s.trim()),
      areasForImprovement: formData.improvements.split(",").map((s) => s.trim()),
      feedback: formData.feedback,
      promotionRecommended: formData.promotionRecommended,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Performance & OKR Appraisals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Quarterly performance evaluations, OKR objective tracking, competencies, and 360 feedback.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Appraisal Review</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Company Average Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {avgRating} <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            High-performance benchmark (+0.2 QoQ)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Completed Reviews</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {performanceReviews.length} Appraisals
          </p>
          <span className="text-[11px] text-slate-500">100% evaluated by managers</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Promotion Pipeline</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {performanceReviews.filter((r) => r.promotionRecommended).length} Endorsed
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Leadership elevation candidates
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee, department..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-3 py-2"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Employee Top Meta */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.employeeAvatar}
                    alt={rev.employeeName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-600/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {rev.employeeName}
                    </h3>
                    <p className="text-xs text-slate-500">{rev.designation} • {rev.department}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-black text-base justify-end">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{rev.overallRating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    {rev.reviewPeriod}
                  </span>
                </div>
              </div>

              {/* OKR Goals Progress */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  OKR Key Results & Scores
                </span>
                {rev.goals.map((g) => {
                  const pct = Math.min(100, Math.round((g.achievedScore / (g.targetScore || 1)) * 100));
                  return (
                    <div key={g.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[260px]">
                          {g.title}
                        </span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {g.achievedScore}/{g.targetScore} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                    Key Strengths
                  </span>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                    {rev.strengths.slice(0, 2).map((st, i) => (
                      <li key={i} className="truncate">{st}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                  <span className="font-bold text-indigo-800 dark:text-indigo-300 block mb-1">
                    Growth Targets
                  </span>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                    {rev.areasForImprovement.slice(0, 2).map((imp, i) => (
                      <li key={i} className="truncate">{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feedback excerpt */}
              <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                &ldquo;{rev.feedback}&rdquo;
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Reviewed by: <strong>{rev.reviewerName}</strong>
              </span>

              <button
                onClick={() => openEmployee360(rev.employeeId)}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>360° Profile</span>
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Record Performance Appraisal
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
                  Employee *
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} — {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Review Period
                  </label>
                  <input
                    type="text"
                    value={formData.reviewPeriod}
                    onChange={(e) => setFormData({ ...formData, reviewPeriod: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Overall Rating (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.overallRating}
                    onChange={(e) => setFormData({ ...formData, overallRating: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reviewer Name
                </label>
                <input
                  type="text"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Key Strengths
                </label>
                <input
                  type="text"
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Feedback & Synthesis
                </label>
                <textarea
                  rows={3}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white leading-relaxed"
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
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold shadow-md"
                >
                  Save Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
