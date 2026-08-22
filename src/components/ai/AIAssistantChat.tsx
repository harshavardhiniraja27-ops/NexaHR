import React, { useState, useRef, useEffect } from "react";
import { useHR } from "../../context/HRContext";
import { sendAIChatMessage, AIHRContextSnapshot } from "../../services/aiService";
import { ChatMessage } from "../../types";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export const AIAssistantChat: React.FC = () => {
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    jobOpenings,
    currentUser,
  } = useHR();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: `Hello ${currentUser.name.split(" ")[0]}! I am NEXA AI, your intelligent HR Copilot. I have real-time access to the live employee directory (${employees.length} personnel), attendance telemetry, leave queues (${leaveRequests.filter((l) => l.status === "Pending").length} pending), payroll records, and ATS vacancies. How can I assist your operations today?`,
      timestamp: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      suggestedFollowUps: [
        "Give me an executive summary of current HR operations.",
        "Which department has open requisitions?",
        "What is our monthly payroll breakdown?",
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: "user",
      text: query.trim(),
      timestamp: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      // Build real-time context summary
      const presentCount = attendanceRecords.filter((a) => a.status === "Present").length;
      const absentCount = attendanceRecords.filter((a) => a.status === "Absent").length;
      const onLeaveCount = attendanceRecords.filter((a) => a.status === "Leave").length;
      const attRate = Math.round(((presentCount) / (employees.length || 1)) * 100);

      const contextData: AIHRContextSnapshot = {
        totalEmployees: employees.length,
        activeEmployees: employees.filter((e) => e.status === "Active").length,
        presentToday: presentCount,
        absentToday: absentCount,
        onLeaveToday: onLeaveCount,
        attendanceRate: `${attRate}%`,
        openPositions: jobOpenings.filter((j) => j.status === "Active").length,
        monthlyPayroll: payrollRecords.reduce((acc, curr) => acc + curr.netSalary, 0),
        pendingLeaves: leaveRequests.filter((l) => l.status === "Pending").length,
        avgPerformance: "4.7 / 5.0",
      };

      const responseText = await sendAIChatMessage(query.trim(), contextData, newHistory);

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        sender: "ai",
        text: responseText,
        timestamp: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        sender: "ai",
        text: "I experienced a temporary communication glitch with the server. Please try submitting your question again.",
        timestamp: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Analyze Engineering attendance and recommend interventions",
    "Generate Job Description for Senior AI/ML Platform Engineer",
    "Summarize August 2026 monthly payroll expenditure",
    "Draft a constructive 360 appraisal review for a Senior Engineer",
    "Explain our company leave policy for sick leave vs earned leave",
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                NEXA AI HR Executive Copilot
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Live Context Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conversational HR intelligence grounded in real-time employee data, attendance, and compliance policies.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "m-1",
                sender: "ai",
                text: "Chat cleared. What else would you like to analyze?",
                timestamp: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" /> Prompts:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>{prompt}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col h-[560px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.sender === "ai" ? (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <span
                  className={`block text-[10px] mt-2 ${
                    msg.sender === "user" ? "text-blue-200 text-right" : "text-slate-400 text-left"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 ml-1">Analyzing HR telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about employees, policies, payroll, attendance, or job postings..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none shadow-2xs"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
