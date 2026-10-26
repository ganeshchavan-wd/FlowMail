"use client";

import { signIn } from "next-auth/react";
import { Mail, Send, Sparkles, User, UserPlus } from "lucide-react";
import Logo from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only redirect if authenticated and not already on dashboard
    if (status === "authenticated" && session) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  const handleGoogleAuth = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (error) {
      console.error("Authentication error:", error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (isLoading) return;

    setError("");
    setMagicLinkSent(false);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send magic link.");
      }

      setMagicLinkSent(true);
    } catch (error: any) {
      console.error("Magic link error:", error);
      setError(error.message || "Failed to send magic link.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = activeTab === "login";

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#05070d] flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] flex items-center justify-center px-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] bottom-[-200px] right-[-150px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Tab Switcher */}
        <div className="relative flex rounded-xl bg-white/5 p-1 mb-6 border border-white/5">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              isLogin
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
            disabled={isLoading}
          >
            <User className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              !isLogin
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
            disabled={isLoading}
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </button>
        </div>

        {/* Content with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>

            <p className="text-zinc-400 text-center mt-3 text-sm sm:text-base">
              {isLogin
                ? "AI Powered Email & Calendar Assistant"
                : "Start managing your emails with AI"}
            </p>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-white font-semibold text-center">
                FlowMail – AI Powered Gmail & Calendar Assistant
              </h3>

              <p className="mt-2 text-xs text-zinc-400 text-center leading-6">
                FlowMail securely connects to your Google account to summarize Gmail emails, organize messages, generate AI replies, 
                detect meetings, search emails intelligently, and manage your Google Calendar.
                Google account access is requested only after your permission through Google OAuth.
              </p>

              <p className="mt-3 text-[11px] text-zinc-500 text-center">
                Gmail access is granted only after your permission through Google OAuth.
              </p>
            </div>

            {/* Email Login */}
            <div className="mt-8 space-y-3">
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                      setMagicLinkSent(false);
                    }}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleMagicLink}
                disabled={isLoading}
                className={`w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-3 transition-all ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:scale-[1.02] active:scale-[0.98]"
                } shadow-lg shadow-purple-500/25`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>

                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Magic Link
                  </>
                )}
              </button>

              {magicLinkSent && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-sm text-emerald-400">
                  Magic link sent! Check your email.
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-zinc-500">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className={`w-full h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-center gap-3 transition-all ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              <Mail size={20} />
              {isLogin ? "Continue with Google" : "Sign Up with Google"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400">
                {isLogin ? "New to FlowMail?" : "Already have an account?"}
                <button
                  onClick={() => setActiveTab(isLogin ? "signup" : "login")}
                  className="ml-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  disabled={isLoading}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center text-[11px] text-zinc-500">
              By continuing, you agree to our{" "}
              <a href="/privacy" className="text-indigo-400 hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="/terms" className="text-indigo-400 hover:underline">
                Terms of Service
              </a>.
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500 text-sm border-t border-white/5 pt-6">
              <Sparkles size={15} className="text-indigo-400" />
              <span>Powered by AI</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  );
}