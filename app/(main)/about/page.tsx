"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------------------- Inline SVG Icons ---------------------- */
function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ---------------------- Reusable helpers ---------------------- */
function AnimatedBackground({ mx, my }: { mx: any; my: any }) {
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const spotX = useTransform(sx, (v) => `${v}px`);
  const spotY = useTransform(sy, (v) => `${v}px`);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
      <motion.div
        className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-3xl"
        animate={{ x: [0, 40, -20, 0], y: [0, 30, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full bg-blue-600/20 blur-3xl"
        animate={{ x: [0, -40, 20, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[460px] w-[460px] rounded-full bg-pink-500/15 blur-3xl"
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-[600px] w-[600px] rounded-full"
        style={{
          left: spotX,
          top: spotY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,.18) 0%, rgba(34,211,238,0) 60%)",
        }}
      />
    </div>
  );
}

function FadeUp({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TiltCard({
  children,
  className = "",
  borderHover = "hover:border-cyan-400/70",
  glow = "rgba(34,211,238,.18)",
}: {
  children: ReactNode;
  className?: string;
  borderHover?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rsx = useSpring(rx, { stiffness: 200, damping: 20 });
  const rsy = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rsx,
        rotateY: rsy,
        transformStyle: "preserve-3d",
        boxShadow: `0 0 0 rgba(0,0,0,0)`,
      }}
      whileHover={{
        translateY: -6,
        boxShadow: `0 30px 60px -30px ${glow}`,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl transition-colors ${borderHover} ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,.06), transparent 40%)",
        }}
      />
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------------------- Main Client Component ---------------------- */
export default function AboutClient() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen overflow-hidden bg-[#030712] text-white"
    >
      <AnimatedBackground mx={mx} my={my} />

      {/* Back to Dashboard */}
      <div className="sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-white/5 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:text-black"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Hero */}
      <section ref={heroRef} className="relative py-28 text-center">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative mx-auto max-w-5xl px-6"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.6)]" />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-extrabold tracking-tight md:text-7xl"
          >
            About{" "}
            <motion.span
              className="inline-block bg-[linear-gradient(90deg,#22d3ee,#3b82f6,#8b5cf6,#22d3ee)] bg-[length:200%_100%] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              FlowMail AI
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mx-auto mt-8 max-w-3xl text-lg text-zinc-400 md:text-xl"
          >
            FlowMail AI is an AI-powered email productivity platform built to
            help users manage Gmail, schedule meetings, summarize emails and
            improve productivity using Google Gemini AI.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-6 font-medium text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
          >
            Created by Ganesh Laxmikant Chavan &amp; Chinmayi Vinayak Udata
          </motion.p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <FadeUp className="text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Our Mission
          </p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Making Email Management{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Smarter
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-zinc-400">
            FlowMail AI combines Gmail, Google Calendar and Google Gemini AI
            into one intelligent platform. Our goal is to simplify email
            management, automate repetitive work and increase productivity
            through Artificial Intelligence.
          </p>
        </FadeUp>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: "🎯",
              title: "Our Vision",
              text: "Build an AI-first productivity platform that helps individuals and organizations manage emails effortlessly.",
              border: "hover:border-cyan-400/70",
              glow: "rgba(34,211,238,.25)",
              from: -60,
            },
            {
              icon: "🚀",
              title: "Our Goal",
              text: "Save time through AI-powered summaries, smart replies, meeting scheduling and intelligent automation.",
              border: "hover:border-blue-400/70",
              glow: "rgba(59,130,246,.25)",
              from: 0,
            },
            {
              icon: "💡",
              title: "Innovation",
              text: "We continuously improve FlowMail AI by integrating modern AI technologies to provide a faster, smarter and more personalized experience.",
              border: "hover:border-purple-400/70",
              glow: "rgba(139,92,246,.25)",
              from: 60,
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: c.from, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 16,
                delay: i * 0.1,
              }}
            >
              <TiltCard borderHover={c.border} glow={c.glow}>
                <motion.div
                  className="text-5xl"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                  transition={{ duration: 0.6 }}
                >
                  {c.icon}
                </motion.div>
                <h3 className="mt-6 text-2xl font-bold">{c.title}</h3>
                <p className="mt-4 leading-7 text-zinc-400">{c.text}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <FadeUp className="text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Core Features
          </p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Everything You Need{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              In One Place
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            FlowMail AI combines powerful AI tools with Gmail and Google
            Calendar to create a modern productivity workspace.
          </p>
        </FadeUp>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "📧",
              title: "Gmail Integration",
              text: "Read, organize and manage your Gmail inbox with intelligent AI assistance.",
              accent: "cyan",
            },
            {
              icon: "📅",
              title: "Smart Calendar",
              text: "Automatically schedule meetings and manage your Google Calendar events.",
              accent: "purple",
            },
            {
              icon: "🤖",
              title: "Gemini AI",
              text: "Summarize emails, draft replies and automate daily communication.",
              accent: "emerald",
            },
            {
              icon: "📊",
              title: "Smart Dashboard",
              text: "Monitor emails, meetings, AI insights and productivity in real time.",
              accent: "blue",
            },
            {
              icon: "🏢",
              title: "Department Management",
              text: "Create departments, manage members and organize shared documents.",
              accent: "orange",
            },
            {
              icon: "🔔",
              title: "Smart Notifications",
              text: "Stay informed with live email alerts, meeting reminders and AI updates.",
              accent: "pink",
            },
          ].map((c, i) => {
            const accentMap: Record<
              string,
              { border: string; glow: string; bar: string }
            > = {
              cyan: {
                border: "hover:border-cyan-400/70",
                glow: "rgba(34,211,238,.25)",
                bar: "from-cyan-400 to-blue-500",
              },
              purple: {
                border: "hover:border-purple-400/70",
                glow: "rgba(139,92,246,.25)",
                bar: "from-purple-400 to-pink-500",
              },
              emerald: {
                border: "hover:border-emerald-400/70",
                glow: "rgba(16,185,129,.25)",
                bar: "from-emerald-400 to-cyan-500",
              },
              blue: {
                border: "hover:border-blue-400/70",
                glow: "rgba(59,130,246,.25)",
                bar: "from-blue-400 to-purple-500",
              },
              orange: {
                border: "hover:border-orange-400/70",
                glow: "rgba(249,115,22,.25)",
                bar: "from-orange-400 to-pink-500",
              },
              pink: {
                border: "hover:border-pink-400/70",
                glow: "rgba(236,72,153,.25)",
                bar: "from-pink-400 to-purple-500",
              },
            };
            const a = accentMap[c.accent];
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group"
              >
                <TiltCard
                  borderHover={a.border}
                  glow={a.glow}
                  className="overflow-hidden"
                >
                  <motion.div
                    className="text-5xl"
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {c.icon}
                  </motion.div>
                  <h3 className="mt-6 text-2xl font-bold">{c.title}</h3>
                  <p className="mt-4 leading-7 text-zinc-400">{c.text}</p>
                  <div
                    className={`mt-6 h-[2px] w-0 bg-gradient-to-r ${a.bar} transition-all duration-500 group-hover:w-full`}
                  />
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <FadeUp className="text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Technology Stack
          </p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Built With Modern{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            FlowMail AI is powered by industry-leading technologies to deliver a
            fast, secure and intelligent experience.
          </p>
        </FadeUp>

        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {[
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Prisma",
            "PostgreSQL",
            "NextAuth",
            "Google Gemini AI",
            "Gmail API",
            "Google Calendar API",
            "Google OAuth",
            "Vercel",
            "Node.js",
          ].map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 18,
                delay: i * 0.04,
              }}
              whileHover={{ y: -6, scale: 1.06 }}
              className="cursor-default rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-base font-medium backdrop-blur-xl transition-colors hover:border-cyan-400 hover:bg-cyan-500/10"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <FadeUp className="text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Project Statistics
          </p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            FlowMail AI In Numbers
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            A quick overview of what FlowMail AI can help users accomplish.
          </p>
        </FadeUp>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "📧",
              value: 15000,
              suffix: "+",
              label: "Emails Managed",
              glow: "rgba(34,211,238,.3)",
              border: "hover:border-cyan-400/70",
            },
            {
              icon: "🤖",
              value: 1200,
              suffix: "+",
              label: "AI Actions",
              glow: "rgba(16,185,129,.3)",
              border: "hover:border-emerald-400/70",
            },
            {
              icon: "📅",
              value: 350,
              suffix: "+",
              label: "Meetings Synced",
              glow: "rgba(139,92,246,.3)",
              border: "hover:border-purple-400/70",
            },
            {
              icon: "🏢",
              value: 50,
              suffix: "+",
              label: "Departments Created",
              glow: "rgba(249,115,22,.3)",
              border: "hover:border-orange-400/70",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <TiltCard
                borderHover={s.border}
                glow={s.glow}
                className="text-center"
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at center, ${s.glow}, transparent 60%)`,
                    opacity: 0.6,
                  }}
                />
                <motion.div
                  className="relative text-5xl"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: [0, 1.3, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                >
                  {s.icon}
                </motion.div>
                <h3 className="relative mt-6 text-5xl font-bold">
                  <Counter to={s.value} suffix={s.suffix} />
                </h3>
                <p className="relative mt-3 text-zinc-400">{s.label}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Developers */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <FadeUp className="text-center">
          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Meet the Developers
          </p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Built by Passionate{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Developers
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-400">
            FlowMail AI was designed and developed with a focus on creating a
            modern AI-powered productivity platform that is beautiful,
            intelligent and easy to use.
          </p>
        </FadeUp>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {[
            {
              initial: "G",
              name: "Ganesh Laxmikant Chavan",
              role: "Founder & Full Stack Developer",
              avatarFrom: "from-cyan-500",
              avatarTo: "to-blue-600",
              ringFrom: "from-cyan-400",
              ringVia: "via-blue-500",
              ringTo: "to-purple-500",
              accentText: "text-cyan-300",
              border: "hover:border-cyan-400/70",
              glow: "rgba(34,211,238,.25)",
              btnBg: "bg-cyan-400 text-black hover:bg-cyan-300",
              btnOutline:
                "border-cyan-400/60 hover:bg-cyan-400 hover:text-black",
              contributions: [
                "System Architecture",
                "AI Integration (Gemini)",
                "Gmail & Calendar APIs",
                "Backend Development",
                "UI / UX Design",
                "Deployment & DevOps",
              ],
              github: "https://github.com/ganeshchavan-wd",
              linkedin:
                "https://www.linkedin.com/in/ganesh-chavan-a46439340/",
            },
            {
              initial: "C",
              name: "Chinmayi Vinayak Udata",
              role: "Co-Founder & Full Stack Developer",
              avatarFrom: "from-pink-500",
              avatarTo: "to-purple-600",
              ringFrom: "from-pink-400",
              ringVia: "via-purple-500",
              ringTo: "to-cyan-400",
              accentText: "text-pink-300",
              border: "hover:border-pink-400/70",
              glow: "rgba(236,72,153,.25)",
              btnBg: "bg-pink-500 text-white hover:bg-pink-400",
              btnOutline:
                "border-pink-400/60 hover:bg-pink-500 hover:text-white",
              contributions: [
                "Frontend Development",
                "Dashboard UI",
                "Department Management",
                "Testing & Optimization",
                "Feature Integration",
                "User Experience",
              ],
              github: "https://github.com/udatachinmayi-bit",
              linkedin:
                "https://www.linkedin.com/in/chinmayi-udata-61aa7237a/",
            },
          ].map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <TiltCard borderHover={d.border} glow={d.glow} className="p-10">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <motion.div
                      className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${d.ringFrom} ${d.ringVia} ${d.ringTo} opacity-80 blur-[2px]`}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <div
                      className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${d.avatarFrom} ${d.avatarTo} text-4xl font-bold shadow-lg`}
                    >
                      {d.initial}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold md:text-3xl">{d.name}</h3>
                    <p className={`mt-2 ${d.accentText}`}>{d.role}</p>
                  </div>
                </div>

                <ul className="mt-8 space-y-3 text-zinc-300">
                  {d.contributions.map((c, j) => (
                    <motion.li
                      key={c}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ delay: 0.2 + j * 0.07, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${d.accentText.replace("text-", "bg-")}`}
                      />
                      <span>{c}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-10 flex gap-4">
                  <motion.a
                    href={d.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${d.name} on GitHub`}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${d.btnBg}`}
                  >
                    <GithubIcon /> GitHub
                  </motion.a>
                  <motion.a
                    href={d.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${d.name} on LinkedIn`}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${d.btnOutline}`}
                  >
                    <LinkedinIcon /> LinkedIn
                  </motion.a>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className="relative border-t border-white/10 bg-gradient-to-b from-transparent to-black/40 py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <FadeUp>
            <h2 className="text-4xl font-bold">FlowMail AI</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              Empowering smarter communication through Artificial Intelligence.
              FlowMail AI combines Gmail, Google Calendar and Gemini AI to help
              users work faster, smarter and more efficiently.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="mt-14">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Founding Team
            </p>
            <h3 className="mt-5 text-3xl font-bold">Ganesh Laxmikant Chavan</h3>
            <p className="mt-2 text-zinc-400">
              Founder &amp; Full Stack Developer
            </p>
            <div className="mt-5 flex justify-center gap-4">
              <a
                href="https://github.com/ganeshchavan-wd"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-cyan-500/30 px-5 py-2 transition hover:bg-cyan-400 hover:text-black"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ganesh-chavan-a46439340/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-cyan-500/30 px-5 py-2 transition hover:bg-cyan-400 hover:text-black"
              >
                LinkedIn
              </a>
            </div>

            <div className="mx-auto my-12 h-px w-32 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <h3 className="text-3xl font-bold">Chinmayi Vinayak Udata</h3>
            <p className="mt-2 text-zinc-400">
              Co-Founder &amp; Full Stack Developer
            </p>
            <div className="mt-5 flex justify-center gap-4">
              <a
                href="https://github.com/udatachinmayi-bit"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-pink-500/30 px-5 py-2 transition hover:bg-pink-500 hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/chinmayi-udata-61aa7237a/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-pink-500/30 px-5 py-2 transition hover:bg-pink-500 hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <motion.div
              className="relative mx-auto mt-20 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(34,211,238,0)",
                  "0 0 40px rgba(34,211,238,.25)",
                  "0 0 0 rgba(34,211,238,0)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-2xl font-semibold italic text-white">
                "Two minds. One vision.
              </p>
              <motion.p
                className="mt-2 bg-[linear-gradient(90deg,#22d3ee,#3b82f6,#8b5cf6,#22d3ee)] bg-[length:200%_100%] bg-clip-text text-2xl font-semibold italic text-transparent"
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                Building the future of AI-powered productivity."
              </motion.p>
            </motion.div>
          </FadeUp>

          <FadeUp delay={0.3} className="mt-16">
            <motion.div
              className="relative inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(16,185,129,0)",
                  "0 0 24px rgba(16,185,129,.4)",
                  "0 0 0 rgba(16,185,129,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Version 1.0.0 • Production Ready
            </motion.div>
            <p className="mt-8 text-zinc-500">
              © {new Date().getFullYear()} FlowMail AI. All Rights Reserved.
            </p>
          </FadeUp>
        </div>
      </section>
    </motion.div>
  );
}