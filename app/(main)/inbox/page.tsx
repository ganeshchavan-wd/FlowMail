"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import EmailCard from "@/components/email-card";
import EmailDetailModal from "@/components/email-detail-modal";
import {
  Sparkles,
  FolderOpen,
  Inbox,
  CheckCircle2,
  BrainCircuit,
  Search,
  Star,
  Layers,
  Mail,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body?: string;
}

// Type definitions for structured data
interface SummaryData {
  overview: {
    totalEmails: number;
    summary: string;
  };
  important: Array<{
    subject: string;
    sender: string;
    reason: string;
  }>;
  urgent: Array<{
    task: string;
  }>;
  meetings: Array<{
    title: string;
    time: string;
  }>;
  summary: string[];
}

interface CategoryData {
  urgent: Array<{
    subject: string;
    sender: string;
    reason: string;
  }>;
  important: Array<{
    subject: string;
    sender: string;
  }>;
  jobs: Array<{
    subject: string;
    company: string;
  }>;
  meetings: Array<{
    subject: string;
    time: string;
  }>;
  promotions: Array<{
    subject: string;
  }>;
  social: Array<{
    subject: string;
  }>;
}

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryData | null>(null);
  const [categorizing, setCategorizing] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local UX enhancement states
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "priority">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Parallax Ambient Light Engine
  const boundingRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent) {
    if (!boundingRef.current) return;
    const { left, top } = boundingRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  // --- BACKEND INTERACTION LOGIC ---
  useEffect(() => {
    const loadEmails = async () => {
      try {
        const res = await fetch("/api/gmail/messages");
        const data = await res.json();
        if (data.success) setEmails(data.emails);
      } catch (error) { 
        console.error(error); 
      } finally { 
        setLoading(false); 
      }
    };
    loadEmails();
  }, []);

  const summarizeInbox = async () => {
    try {
      setSummarizing(true);
      setSummaryError(null);
      const res = await fetch("/api/gmail/summarize");
      const data = await res.json();
      
      if (data.success) {
        setSummary(data.data);
        if (data.warning) {
          setSummaryError(data.warning);
        }
      } else {
        setSummary({
          overview: {
            totalEmails: emails.length || 0,
            summary: data.error || "Unable to generate summary. Please try again.",
          },
          important: [],
          urgent: [],
          meetings: [],
          summary: ["Error generating summary. Please refresh and try again."],
        });
        setSummaryError(data.error || "Failed to generate summary");
      }
    } catch (error) { 
      console.error(error);
      setSummary({
        overview: {
          totalEmails: emails.length || 0,
          summary: "Network error. Please check your connection and try again.",
        },
        important: [],
        urgent: [],
        meetings: [],
        summary: ["Network error. Please try again."],
      });
      setSummaryError("Network error. Please try again.");
    } finally { 
      setSummarizing(false); 
    }
  };

  const categorizeInbox = async () => {
    try {
      setCategorizing(true);
      setCategoriesError(null);
      const res = await fetch("/api/gmail/categorize");
      const data = await res.json();
      
      if (data.success) {
        setCategories(data.data);
        if (data.warning) {
          setCategoriesError(data.warning);
        }
      } else {
        setCategories({
          urgent: [],
          important: [],
          jobs: [],
          meetings: [],
          promotions: [],
          social: [],
        });
        setCategoriesError(data.error || "Failed to categorize emails");
      }
    } catch (error) {
      console.error(error);
      setCategories({
        urgent: [],
        important: [],
        jobs: [],
        meetings: [],
        promotions: [],
        social: [],
      });
      setCategoriesError("Network error. Please try again.");
    } finally { 
      setCategorizing(false); 
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmail(null);
  };

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const matchesSearch = 
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.snippet.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [emails, searchQuery]);

  return (
    <div 
      ref={boundingRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen bg-gray-50 dark:bg-[#020205] text-gray-900 dark:text-[#e4e4e7] antialiased selection:bg-indigo-500/30 transition-colors duration-300"
    >
      {/* Immersive Glass Spotlight Background Canvas */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute -inset-[400px] opacity-[0.09] blur-[130px] hidden xl:block dark:block"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(99, 102, 241, 0.4),
                transparent 80%
              )
            `
          }}
        />
        <div className="absolute top-[-10%] left-[20%] h-[500px] w-[600px] rounded-full bg-indigo-500/[0.03] blur-[120px] hidden lg:block dark:block" />
        <div className="absolute bottom-[5%] right-[5%] h-[400px] w-[500px] rounded-full bg-emerald-500/[0.02] blur-[100px] hidden lg:block dark:block" />
        <div 
          className="absolute inset-0 opacity-[0.015] hidden dark:block"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }}
        />
        <div className="absolute inset-0 bg-white/5 opacity-0 dark:opacity-0 opacity-10 block dark:hidden" />
      </div>

      {/* Main Structural Compartments */}
      <div className="relative z-10 flex-1 overflow-x-hidden">
        <motion.main 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10"
        >
          {/* Dynamic Core Header Matrix */}
          <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-6 border-b border-gray-200 dark:border-white/[0.04] pb-4 sm:pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900/40 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-gray-600 dark:text-neutral-400 uppercase backdrop-blur-md">
                <BrainCircuit className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                <span>Cognitive Mail Interface</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white">
                Inbox
              </h1>
              <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400 sm:text-sm">
                AI-orchestrated telemetry and predictive communications hub.
              </p>
            </div>

            {/* Premium AI Actions Block */}
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
              <button 
                onClick={summarizeInbox} 
                disabled={summarizing} 
                className="group relative flex w-full sm:w-auto justify-center items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-gray-200 to-gray-100 dark:from-neutral-900 dark:to-neutral-950 px-4 py-2.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:border-indigo-400 dark:hover:border-indigo-500/40 hover:text-indigo-900 dark:hover:text-white disabled:opacity-50"
              >
                {summarizing && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                )}
                <Sparkles className={`h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 transition-transform ${summarizing ? "animate-spin" : "group-hover:rotate-12"}`} />
                <span>{summarizing ? "Analyzing Engine..." : "Summarize Workspace"}</span>
              </button>

              <button 
                onClick={categorizeInbox} 
                disabled={categorizing} 
                className="group relative flex w-full sm:w-auto justify-center items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-gray-200 to-gray-100 dark:from-neutral-900 dark:to-neutral-950 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:border-emerald-400 dark:hover:border-emerald-500/40 hover:text-emerald-900 dark:hover:text-white disabled:opacity-50"
              >
                {categorizing && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                )}
                <FolderOpen className={`h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 transition-transform ${categorizing ? "animate-bounce" : "group-hover:scale-11"}`} />
                <span>{categorizing ? "Sorting Vectors..." : "Categorize Streams"}</span>
              </button>
            </div>
          </div>

          {/* Integrated Multi-Filter Control Strip */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 rounded-xl bg-gray-200 dark:bg-neutral-900/40 p-1 border border-gray-300 dark:border-white/[0.04] w-fit backdrop-blur-md overflow-x-auto">
              {(["all", "unread", "priority"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-all whitespace-nowrap ${
                    activeFilter === filter 
                      ? "bg-white dark:bg-white/[0.06] text-gray-900 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-gray-300 dark:border-white/[0.04]" 
                      : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Integrated Semantic Search Field */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-gray-500 dark:text-neutral-500" />
              <input 
                type="text"
                placeholder="Filter messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-white/[0.04] bg-white dark:bg-neutral-900/20 py-2 pl-9 pr-4 text-xs text-gray-900 dark:text-neutral-200 placeholder-gray-500 dark:placeholder-neutral-500 outline-none transition-all focus:border-indigo-500/40 focus:bg-gray-50 dark:focus:bg-neutral-900/40"
              />
            </div>
          </div>

          {/* Dynamic AI Engine Workspace Output Display Panels */}
          <AnimatePresence mode="popLayout">
            {(summary || categories || summarizing || categorizing) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, height: 0 }} 
                animate={{ opacity: 1, scale: 1, height: 'auto' }} 
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6 sm:mb-8 overflow-hidden"
              >
                {/* Executive Synthesis Panel */}
                <div className="group relative overflow-hidden rounded-2xl border border-indigo-300 dark:border-indigo-500/10 bg-indigo-50/50 dark:bg-gradient-to-b from-neutral-900/40 to-neutral-950/60 p-4 sm:p-5 lg:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] backdrop-blur-xl">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/[0.03] blur-xl group-hover:bg-indigo-500/[0.06] transition-colors" />
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      Executive Synthesis
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-neutral-500">AI Verified</span>
                  </div>
                  
                  {summarizing ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative h-8 w-8">
                          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
                          <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-neutral-400">Analyzing emails...</p>
                      </div>
                    </div>
                  ) : summary ? (
                    <>
                      {summaryError && (
                        <div className="mb-3 flex items-center gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-3 py-2">
                          <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">{summaryError}</p>
                        </div>
                      )}
                      
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-indigo-500 dark:text-indigo-400">
                            📌 Inbox Overview
                          </h4>
                          <p className="mt-1 text-gray-700 dark:text-neutral-300">
                            {summary.overview?.summary || "No summary available"}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-neutral-500">
                            Total Emails: {summary.overview?.totalEmails || 0}
                          </span>
                        </div>

                        {summary.important && summary.important.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-red-500 dark:text-red-400">
                              🔥 Important Emails
                            </h4>
                            <ul className="mt-2 space-y-2">
                              {summary.important.map((mail, index) => (
                                <li
                                  key={index}
                                  className="rounded-lg bg-neutral-900/30 dark:bg-neutral-800/30 p-2"
                                >
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {mail.subject}
                                  </div>
                                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {mail.sender}
                                  </div>
                                  <div className="text-xs mt-1 text-gray-700 dark:text-neutral-300">
                                    {mail.reason}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {summary.urgent && summary.urgent.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-yellow-500 dark:text-yellow-400">
                              ⚡ Action Items
                            </h4>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              {summary.urgent.map((item, index) => (
                                <li key={index} className="text-gray-700 dark:text-neutral-300">
                                  {item.task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {summary.meetings && summary.meetings.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-500 dark:text-green-400">
                              📅 Meetings
                            </h4>
                            <ul className="mt-2 space-y-2">
                              {summary.meetings.map((meeting, index) => (
                                <li key={index} className="text-gray-700 dark:text-neutral-300">
                                  <div>{meeting.title}</div>
                                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {meeting.time}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {summary.summary && summary.summary.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-blue-500 dark:text-blue-400">
                              ✅ Quick Summary
                            </h4>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              {summary.summary.map((point, index) => (
                                <li key={index} className="text-gray-700 dark:text-neutral-300">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>

                {/* Taxonomy Segments Panel */}
                <div className="group relative overflow-hidden rounded-2xl border border-emerald-300 dark:border-emerald-500/10 bg-emerald-50/50 dark:bg-gradient-to-b from-neutral-900/40 to-neutral-950/60 p-4 sm:p-5 lg:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] backdrop-blur-xl max-h-[600px] overflow-y-auto">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/[0.03] blur-xl group-hover:bg-emerald-500/[0.06] transition-colors" />
                  <div className="mb-3 flex items-center justify-between sticky top-0 bg-emerald-50/80 dark:bg-neutral-900/80 backdrop-blur-sm py-2 -mt-2 px-1 z-10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Taxonomy Segments
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-neutral-500">Sorted</span>
                  </div>
                  
                  {categorizing ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative h-8 w-8">
                          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                          <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-neutral-400">Categorizing emails...</p>
                      </div>
                    </div>
                  ) : categories ? (
                    <>
                      {categoriesError && (
                        <div className="mb-3 flex items-center gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-3 py-2">
                          <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">{categoriesError}</p>
                        </div>
                      )}
                      
                      <div className="space-y-5">
                        {[
                          ["🔥 Urgent", "urgent", "text-red-500 dark:text-red-400"],
                          ["⭐ Important", "important", "text-yellow-500 dark:text-yellow-400"],
                          ["💼 Jobs", "jobs", "text-cyan-500 dark:text-cyan-400"],
                          ["📅 Meetings", "meetings", "text-green-500 dark:text-green-400"],
                          ["📢 Promotions", "promotions", "text-pink-500 dark:text-pink-400"],
                          ["👥 Social", "social", "text-purple-500 dark:text-purple-400"]
                        ].map(([title, key, color]) => {
                          const items = categories[key as keyof CategoryData] ?? [];
                          return (
                            <div key={key}>
                              <h4 className={`font-semibold ${color}`}>
                                {title} <span className="text-xs font-normal text-gray-500">({items.length})</span>
                              </h4>
                              <div className="mt-2 space-y-2">
                                {items.length === 0 ? (
                                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    No emails
                                  </div>
                                ) : (
                                  items.map((mail, index) => (
                                    <div
                                      key={index}
                                      className="rounded-lg bg-neutral-900/30 dark:bg-neutral-800/30 p-2"
                                    >
                                      <div className="font-medium text-gray-900 dark:text-white">
                                        {mail.subject}
                                      </div>
                                      {"sender" in mail && (
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                          {mail.sender}
                                        </div>
                                      )}
                                      {"reason" in mail && (
                                        <div className="text-xs text-gray-700 dark:text-neutral-300">
                                          {mail.reason}
                                        </div>
                                      )}
                                      {"company" in mail && (
                                        <div className="text-xs text-gray-700 dark:text-neutral-300">
                                          {mail.company}
                                        </div>
                                      )}
                                      {"time" in mail && (
                                        <div className="text-xs text-gray-700 dark:text-neutral-300">
                                          {mail.time}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Synchronized Email Feed Stream */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
                <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 dark:border-white/[0.06] bg-gray-100 dark:bg-neutral-900/40 shadow-md">
                  <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  <span className="absolute inset-0 rounded-xl border border-indigo-500/20 animate-ping opacity-40" />
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-neutral-400 tracking-wide animate-pulse">
                  Synchronizing cryptographic communication threads...
                </p>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center border border-dashed border-gray-300 dark:border-white/[0.04] rounded-2xl bg-gray-100 dark:bg-neutral-900/[0.05]">
                <Inbox className="h-6 w-6 text-gray-500 dark:text-neutral-600 mb-2" />
                <p className="text-xs text-gray-600 dark:text-neutral-400 font-medium">No matching communication nodes found.</p>
              </div>
            ) : (
              <motion.div 
                layout
                className="space-y-3"
              >
                {filteredEmails.map((email, i) => (
                  <motion.div 
                    key={email.id} 
                    initial={{ opacity: 0, y: 12 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: Math.min(i * 0.04, 0.3), type: "spring", stiffness: 260, damping: 25 }}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/[0.03] bg-white dark:bg-neutral-900/[0.15] p-1.5 backdrop-blur-xl transition-all duration-300 shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] hover:border-gray-300 dark:hover:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-neutral-900/[0.3] hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] cursor-pointer"
                    onClick={() => handleEmailClick(email)}
                  >
                    {/* Lateral Accent Strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/0 via-indigo-500/40 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex flex-col sm:flex-row items-start gap-4 p-4">
                      {/* Interactive Custom Initial Avatar Badge */}
                      <div className="relative flex h-10 w-10 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gray-300 dark:border-white/[0.06] bg-gray-200 dark:bg-neutral-950/60 text-xs font-bold text-gray-700 dark:text-neutral-300 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-indigo-500/30">
                        {email.from ? email.from.charAt(0).toUpperCase() : "M"}
                        <span className="absolute bottom-[-1px] right-[-1px] h-2 w-2 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-950" />
                      </div>

                      {/* Main Dynamic Prop Passing Injection */}
                      <div className="min-w-0 flex-1 w-full">
                        <EmailCard 
                          sender={email.from} 
                          subject={email.subject} 
                          preview={email.snippet}
                          onClick={() => handleEmailClick(email)}
                        />
                        
                        {/* Micro-Actions Utility Ribbon */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-200 dark:border-white/[0.02] pt-2.5 opacity-40 transition-opacity duration-300 group-hover:opacity-100">
                          <button className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <Sparkles className="h-3 w-3" />
                            <span>Draft AI Reply</span>
                          </button>
                          <span className="text-gray-300 dark:text-neutral-700 text-[10px]">•</span>
                          <button className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Star className="h-3 w-3" />
                            <span>Flag Node</span>
                          </button>
                        </div>
                      </div>

                      {/* Diagnostic Status Indicators - Hidden on mobile */}
                      <div className="hidden sm:flex flex-col items-end justify-between self-stretch pl-2">
                        <span className="text-[10px] font-mono text-gray-500 dark:text-neutral-500 tracking-tighter whitespace-nowrap">
                          Node-{email.id.slice(0, 4)}
                        </span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/30 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.main>
      </div>

      {/* Email Detail Modal */}
      <EmailDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        email={selectedEmail}
      />
    </div>
  );
}