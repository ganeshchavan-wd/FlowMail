"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Mail,
  Calendar,
  Sparkles,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    emails: 0,
    unread: 0,
    important: 0,
    starred: 0,
    meetings: 0,
    aiActions: 0,
    hoursSaved: "0h",
  });

  const [recentEmails, setRecentEmails] = useState<any[]>([]);

  // 1. Load data when the page mounts
  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();

      setStats({
        emails: data.emails || 0,
        unread: data.unread || 0,
        important: data.important || 0,
        starred: data.starred || 0,
        meetings: data.meetings || 0,
        aiActions: data.aiActions || 0,
        hoursSaved: data.hoursSaved || "0h",
      });

      setRecentEmails(data.recentEmails || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  }

  // 2. Function that returns the personalized brief
  function getDailyBrief() {
    if (stats.unread > 0) {
      return `You have ${stats.unread} unread emails, ${stats.important} important emails and ${stats.meetings} meetings today. AI has already saved you ${stats.hoursSaved}.`;
    }

    return `Your inbox is clear. You have ${stats.meetings} meetings today. AI has already saved you ${stats.hoursSaved}.`;
  }

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const fadeUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-white antialiased transition-colors duration-300">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[700px] rounded-full bg-blue-500/15 blur-[120px] dark:block hidden" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px] dark:block hidden" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.015] opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 flex">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Navbar />

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
            {/* Hero header */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 lg:mb-12 flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between"
            >
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-3 py-1 text-xs text-gray-600 dark:text-white/60 backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  All systems operational
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-medium tracking-[-0.03em] text-gray-900 dark:text-white">
                  {greeting},{" "}
                  <span className="bg-gradient-to-br from-gray-800 via-blue-600 to-blue-800 dark:from-white dark:via-blue-100 dark:to-blue-400 bg-clip-text text-transparent">
                    {session?.user?.name?.split(" ")[0] || "User"}
                  </span>
                </h1>
                {/* 3. Replace the static paragraph with the dynamic brief */}
                <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-white/50">
                  {getDailyBrief()}
                </p>
              </div>

              <button className="group flex w-full sm:w-auto items-center justify-center gap-2 self-start sm:self-auto rounded-full bg-gray-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-black transition-transform hover:scale-[1.02]">
                Compose with AI
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              </button>
            </motion.div>

            {/* Stat grid */}
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {[
                {
                  label: "Emails",
                  val: stats.emails,
                  change: "+12%",
                  icon: Mail,
                  accent: "from-blue-500/20 to-blue-500/0",
                  iconColor: "text-blue-500 dark:text-blue-400",
                },
                {
                  label: "Meetings",
                  val: stats.meetings,
                  change: "+3",
                  icon: Calendar,
                  accent: "from-purple-500/20 to-purple-500/0",
                  iconColor: "text-purple-500 dark:text-purple-400",
                },
                {
                  label: "AI Actions",
                  val: stats.aiActions,
                  change: "+24%",
                  icon: Sparkles,
                  accent: "from-emerald-500/20 to-emerald-500/0",
                  iconColor: "text-emerald-500 dark:text-emerald-400",
                },
                {
                  label: "Hours Saved",
                  val: stats.hoursSaved,
                  change: "This Week",
                  icon: Clock,
                  accent: "from-amber-500/20 to-amber-500/0",
                  iconColor: "text-amber-500 dark:text-amber-400",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  {...fadeUp}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.6,
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 sm:p-6 backdrop-blur-xl transition hover:border-gray-300 dark:hover:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-50`}
                  />

                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                        <stat.icon className={`h-4.5 w-4.5 ${stat.iconColor}`} />
                      </div>

                      <span className="text-xs text-gray-400">
                        {stat.change}
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-bold">
                      {stat.val}
                    </div>

                    <div className="mt-2 text-xs uppercase tracking-widest text-gray-500">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <motion.div
                {...fadeUp}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="xl:col-span-2"
              >
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between border-b border-gray-200 dark:border-white/5 p-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
                      <p className="text-xs text-gray-500 dark:text-white/40">Your latest automated actions</p>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-gray-500 dark:text-white/50 transition hover:text-gray-800 dark:hover:text-white whitespace-nowrap">
                      View all <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-white/5">
                    {recentEmails.map((email, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                        className="group flex items-start sm:items-center gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">
                            {email.subject}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {email.from}
                          </div>
                          <div className="mt-1 truncate text-xs text-zinc-500">
                            {email.snippet}
                          </div>
                        </div>
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 dark:text-emerald-400/60 opacity-0 transition group-hover:opacity-100" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* AI Insights side card */}
              <motion.div
                {...fadeUp}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-gradient-to-br from-blue-100/30 via-white to-transparent dark:from-blue-500/15 dark:via-indigo-500/5 dark:to-transparent p-6 backdrop-blur-xl"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-blue-500/20 blur-[60px] hidden lg:block" />

                <div className="relative">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                    <Sparkles className="h-4.5 w-4.5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Insights</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-white/50">
                    You're 32% more productive this week
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      {
                        label: "Unread Emails",
                        val: stats.unread,
                        trend: "Live",
                      },
                      {
                        label: "Important",
                        val: stats.important,
                        trend: "Live",
                      },
                      {
                        label: "Starred",
                        val: stats.starred,
                        trend: "Live",
                      },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 px-3 sm:px-4 py-3">
                        <span className="text-xs text-gray-600 dark:text-white/60">{m.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{m.val}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{m.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 py-2.5 text-xs font-medium text-gray-700 dark:text-white transition hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-200 dark:hover:bg-white/10">
                    View full report
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}