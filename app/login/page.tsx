"use client";

import { signIn } from "next-auth/react";
import { Mail, Sparkles, User, UserPlus } from "lucide-react";
import Logo from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleGoogleAuth = () => {
    signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  const isLogin = activeTab === "login";

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

            <button
              onClick={handleGoogleAuth}
              className="mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25"
            >
              <Mail size={20} />
              {isLogin ? "Login with Google" : "Sign Up with Google"}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400">
                {isLogin ? "New to FlowMail?" : "Already have an account?"}
                <button
                  onClick={() => setActiveTab(isLogin ? "signup" : "login")}
                  className="ml-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                {isLogin
                  ? "Sign in with your Google account"
                  : "Your account will be created automatically on first sign in"}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-zinc-500 text-sm border-t border-white/5 pt-6">
              <Sparkles size={15} className="text-indigo-400" />
              <span>Powered by Gemini AI</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  );
}