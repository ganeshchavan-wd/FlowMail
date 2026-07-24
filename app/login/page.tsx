"use client";

import { signIn } from "next-auth/react";
import { Mail, Sparkles, User, UserPlus } from "lucide-react";
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
                Secure AI Gmail Assistant
              </h3>

              <p className="mt-2 text-xs text-zinc-400 text-center leading-6">
                FlowMail AI securely connects to your Gmail account to provide AI-powered
                email summaries, smart categorization, intelligent search, meeting
                detection, and reply assistance.
              </p>

              <p className="mt-3 text-[11px] text-zinc-500 text-center">
                Gmail access is granted only after your permission through Google OAuth.
              </p>
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className={`mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-3 transition-all ${
                isLoading 
                  ? "opacity-70 cursor-not-allowed" 
                  : "hover:scale-[1.02] active:scale-[0.98]"
              } shadow-lg shadow-purple-500/25`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting...
                </>
              ) : (
                <>
                  <Mail size={20} />
                  {isLogin ? "Login with Google" : "Sign Up with Google"}
                </>
              )}
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
