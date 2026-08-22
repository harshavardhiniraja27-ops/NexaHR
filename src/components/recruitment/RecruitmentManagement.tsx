import React, { useState } from "react";
import { useHR } from "../../context/HRContext";
import { JobOpening, CandidateApplication, PipelineStage, EmploymentType } from "../../types";
import { generateJobDescriptionAI } from "../../services/aiService";
import {
  Briefcase,
  Users,
  Plus,
  Sparkles,
  Search,
  Star,
  Mail,
  Phone,
  FileText,
  X,
  MapPin,
  DollarSign,
  ChevronRight,
} from "lucide-react";

export const RecruitmentManagement: React.FC = () => {
  const {
    jobOpenings,
    candidateApplications,
    departments,
    addJobOpening,
    updateCandidateStage,
    convertCandidateToEmployee,
  } = useHR();

  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "jobs">("pipeline");
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>("All");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(null);

  // AI Job Creator Modal
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    title: "Senior Full Stack Engineer",
    department: departments[0]?.name || "Engineering",
    location: "San Francisco, CA (Hybrid)",
    employmentType: "Full-time" as EmploymentType,
    experience: "5+ years",
    salaryMin: 140000,
    salaryMax: 180000,
    skills: "React, Node.js, TypeScript, PostgreSQL",
    description: "",
    hiringManager: "Sarah Jenkins",
  });

  const stages: PipelineStage[] = ["Applied", "Screening", "Interview", "Shortlisted", "Selected", "Rejected"];

  const handleGenerateAIJobDescription = async () => {
    setIsGeneratingAI(true);
    try {
      const generated = await generateJobDescriptionAI({
        title: jobFormData.title,
        department: jobFormData.department,
        experience: jobFormData.experience,
        skills: jobFormData.skills,
      });
      setJobFormData((prev) => ({ ...prev, description: generated }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    addJobOpening({
      title: jobFormData.title,
      department: jobFormData.department,
      location: jobFormData.location,
      employmentType: jobFormData.employmentType,
      experience: jobFormData.experience,
      skills: jobFormData.skills.split(",").map((s) => s.trim()),
      salaryMin: Number(jobFormData.salaryMin),
      salaryMax: Number(jobFormData.salaryMax),
      status: "Active",
      description: jobFormData.description || "Exciting career opportunity at NEXA HR.",
      hiringManager: jobFormData.hiringManager,
    });
    setIsJobModalOpen(false);
  };

  const filteredCandidates = candidateApplications.filter((c) => {
    if (selectedJobFilter === "All") return true;
    return c.jobId === selectedJobFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recruitment & Applicant Tracking (ATS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage active vacancies, AI job description generation, candidate pipelines, and scoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsJobModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ AI Job Creator</span>
          </button>
        </div>
      </div>

      {/* Sub tabs & Job Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("pipeline")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "pipeline"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Kanban Pipeline ({candidateApplications.length})
          </button>
          <button
            onClick={() => setActiveSubTab("jobs")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === "jobs"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Active Positions ({jobOpenings.length})
          </button>
        </div>

        {activeSubTab === "pipeline" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter Requisition:</span>
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-3 py-1.5"
            >
              <option value="All">All Openings ({candidateApplications.length})</option>
              {jobOpenings.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* View: Pipeline Kanban */}
      {activeSubTab === "pipeline" && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageCandidates = filteredCandidates.filter((c) => c.stage === stage);

            return (
              <div
                key={stage}
                className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col min-w-[240px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {stage}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards in Stage */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {stageCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={cand.avatar}
                            alt={cand.candidateName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                              {cand.candidateName}
                            </h4>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                              {cand.currentCompany}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-500 text-[11px] font-bold">
                          <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                          <span>{cand.rating}</span>
                        </div>
                      </div>

                      <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-semibold mb-2 truncate max-w-full">
                        {cand.jobTitle}
                      </span>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {cand.skills.slice(0, 2).map((sk) => (
                          <span
                            key={sk}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-600 dark:text-slate-400"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* Quick Move Trigger */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
                      >
                        <select
                          value={cand.stage}
                          onChange={(e) => updateCandidateStage(cand.id, e.target.value as PipelineStage)}
                          className="text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300"
                        >
                          {stages.map((s) => (
                            <option key={s} value={s}>
                              Move to {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageCandidates.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-[11px]">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Job Openings List */}
      {activeSubTab === "jobs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
                      {job.department}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {job.title}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      job.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs my-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" /> ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.skills.map((req) => (
                    <span
                      key={req}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">
                  {job.applicationsCount} Applicants
                </span>
                <button
                  onClick={() => {
                    setSelectedJobFilter(job.id);
                    setActiveSubTab("pipeline");
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Pipeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Dossier Drawer Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.candidateName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-600/20"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedCandidate.candidateName}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Applying for: <strong>{selectedCandidate.jobTitle}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-500" /> {selectedCandidate.candidateEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> {selectedCandidate.candidatePhone}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                  Experience & Company
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedCandidate.experienceYears} Years Experience • Currently at {selectedCandidate.currentCompany}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                  Skill Assessment
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                  Interviewer Notes
                </span>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {selectedCandidate.notes}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Applied on: {selectedCandidate.appliedDate}
              </span>
              <div className="flex items-center gap-2">
                {selectedCandidate.stage !== "Selected" && (
                  <button
                    onClick={() => {
                      convertCandidateToEmployee(selectedCandidate.id);
                      setSelectedCandidate(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>✓ Convert to Employee</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Job Creator Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Create Requisition with AI Assistant
                </h3>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Department *
                  </label>
                  <select
                    value={jobFormData.department}
                    onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={jobFormData.experience}
                    onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Min Salary ($)
                  </label>
                  <input
                    type="number"
                    value={jobFormData.salaryMin}
                    onChange={(e) => setJobFormData({ ...jobFormData, salaryMin: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Key Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={jobFormData.skills}
                  onChange={(e) => setJobFormData({ ...jobFormData, skills: e.target.value })}
                  placeholder="React, TypeScript, AWS..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              {/* AI Trigger */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <span className="text-xs text-blue-900 dark:text-blue-200">
                  Generate high-impact role description with Gemini AI
                </span>
                <button
                  type="button"
                  onClick={handleGenerateAIJobDescription}
                  disabled={isGeneratingAI}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAI ? "Drafting..." : "Auto-Draft Description"}</span>
                </button>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Job Description & Scope
                </label>
                <textarea
                  rows={4}
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  placeholder="Comprehensive job description and company background..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold shadow-md"
                >
                  Publish Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
