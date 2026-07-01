"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Mail, Sparkles, Zap, Shield, ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Premium Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_60%)]" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center gap-8"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="relative h-12 w-12"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600" />
                  <div className="absolute inset-[2px] flex items-center justify-center rounded-[10px] bg-[#030712]">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                </motion.div>
                <span className="text-3xl font-light tracking-[0.3em] text-white">
                  FLOW<span className="font-bold">MAIL</span>
                </span>
              </div>

              <div className="h-[2px] w-64 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-xs tracking-widest text-white/40">
                {String(progress).padStart(3, "0")}%
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-screen overflow-hidden bg-[#030712] text-white antialiased"
        >
          {/* Ambient background */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
            <div className="absolute left-0 top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Nav */}
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-6"
          >
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-9 w-9">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600" />
                <div className="absolute inset-[1.5px] flex items-center justify-center rounded-[6.5px] bg-[#030712]">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <span className="text-lg font-light tracking-[0.2em]">
                FLOW<span className="font-bold">MAIL</span>
              </span>
            </Link>

            <div className="hidden items-center gap-10 text-sm text-white/60 md:flex">
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#pricing" className="transition hover:text-white">Pricing</a>
              <a href="#about" className="transition hover:text-white">About</a>
            </div>

            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm backdrop-blur-md transition hover:border-white/20 hover:bg-white/10"
            >
              Sign in
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.nav>

          {/* Hero */}
          <motion.section
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-32 pt-24 text-center md:pt-32"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
              </span>
              Now in private beta · Join the waitlist
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl text-5xl font-medium leading-[1.05] tracking-[-0.04em] md:text-7xl lg:text-[88px]"
            >
              Inbox zero,{" "}
              <span className="bg-gradient-to-br from-white via-blue-100 to-blue-400 bg-clip-text italic text-transparent">
                effortlessly
              </span>
              <br />
              powered by AI.
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
            >
              FlowMail reads, sorts, drafts, and prioritizes — so you spend
              minutes on email, not hours. Built for people who ship.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link
                href="/dashboard"
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
              >
                <span className="relative z-10">Get started — free</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#features"
                className="rounded-full border border-white/10 px-7 py-3.5 text-sm text-white/80 backdrop-blur-md transition hover:border-white/20 hover:bg-white/5"
              >
                See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/40"
            >
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> SOC 2 compliant</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> 14-day free trial</span>
            </motion.div>
          </motion.section>

          {/* Product preview card */}
          <motion.section
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto mb-32 max-w-6xl px-6"
          >
            <div className="relative">
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
              <div className="relative rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-2 backdrop-blur-xl">
                <div className="rounded-2xl border border-white/5 bg-[#0a0f1e] p-8 md:p-12">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    </div>
                    <span className="text-xs text-white/30">flowmail.app</span>
                  </div>
                  <div className="grid gap-3">
                    {[
                      { from: "Sarah Chen", subject: "Q4 strategy review", tag: "Priority", color: "bg-blue-500/20 text-blue-300" },
                      { from: "GitHub", subject: "Your weekly digest", tag: "Auto-archived", color: "bg-white/5 text-white/40" },
                      { from: "Mark @ Stripe", subject: "Re: contract terms", tag: "Draft ready", color: "bg-emerald-500/20 text-emerald-300" },
                      { from: "Newsletter", subject: "5 ways to ship faster", tag: "Summarized", color: "bg-purple-500/20 text-purple-300" },
                    ].map((mail, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i, duration: 0.5 }}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-600/30 text-xs font-medium">
                            {mail.from[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium">{mail.from}</div>
                            <div className="truncate text-sm text-white/40">{mail.subject}</div>
                          </div>
                        </div>
                        <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${mail.color}`}>
                          {mail.tag}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Features */}
          <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 pb-32">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 max-w-2xl"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-blue-400">Capabilities</span>
              <h2 className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">
                Email, but it thinks for you.
              </h2>
            </motion.div>

            <div className="grid gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 md:grid-cols-3">
              {[
                { icon: Sparkles, title: "Smart drafts", desc: "AI writes replies that sound exactly like you — in your tone, your style." },
                { icon: Zap, title: "Auto-triage", desc: "Newsletters archived. Urgent flagged. Spam buried. Without lifting a finger." },
                { icon: Shield, title: "End-to-end private", desc: "Your emails stay yours. Zero training, encrypted at rest and in transit." },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6 }}
                  className="group bg-[#030712] p-8 transition hover:bg-[#0a0f1e]"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition group-hover:border-blue-400/30 group-hover:bg-blue-500/10">
                    <f.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="relative z-10 mx-auto max-w-4xl px-6 pb-32 text-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent p-12 md:p-16"
            >
              <div className="absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-blue-500/30 blur-[80px]" />
              <h2 className="relative text-3xl font-medium tracking-tight md:text-5xl">
                Stop managing email.<br />Start ignoring it.
              </h2>
              <p className="relative mx-auto mt-5 max-w-md text-white/60">
                Join thousands who've reclaimed their mornings.
              </p>
              <Link
                href="/dashboard"
                className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
              >
                Get FlowMail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="relative z-10 border-t border-white/5">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-white/40 md:flex-row">
              <span>© 2026 FlowMail AI. All rights reserved.</span>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Terms</a>
                <a href="#" className="hover:text-white">Contact</a>
              </div>
            </div>
          </footer>
        </motion.main>
      )}
    </>
  );
}
