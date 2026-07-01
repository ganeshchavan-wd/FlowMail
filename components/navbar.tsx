"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Search, Bell, ChevronDown, Sparkles } from "lucide-react";
import Logo from "@/components/logo";
import NotificationDropdown from "./notification-dropdown";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-20 w-full border-b border-gray-200 dark:border-white/[0.06] flex items-center justify-between px-6 md:px-10 bg-white/80 dark:bg-gradient-to-b dark:from-[#0a0a0f]/90 dark:to-[#030303]/90 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.6)] transition-colors duration-300"
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Logo />
        <span className="hidden md:inline-block text-[10px] uppercase tracking-[0.3em] text-gray-500 dark:text-zinc-500 font-bold ml-2 border-l border-gray-200 dark:border-white/[0.06] pl-3">
          AI Suite
        </span>
      </div>

      {/* Center: Search Bar with Icon */}
      <div className="flex-1 max-w-xl mx-4 md:mx-8 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-gray-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search emails, contacts, or commands..."
            className="w-full bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/[0.08] rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500/50 focus:bg-gray-50 dark:focus:bg-white/[0.06] transition-all duration-300 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:placeholder:text-gray-500 dark:focus:placeholder:text-zinc-500 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            suppressHydrationWarning
          />
          <kbd className="absolute right-3 hidden md:flex items-center gap-1 text-[10px] font-mono text-gray-400 dark:text-zinc-500 bg-gray-200 dark:bg-white/[0.05] px-2 py-1 rounded border border-gray-300 dark:border-white/[0.06]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications + User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with Badge */}
      <div className="relative">

  <button
    onClick={() =>
      setShowNotifications(!showNotifications)
    }
    className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/[0.06] transition-colors group"
  >
    <Bell className="w-5 h-5 text-gray-400 dark:text-zinc-400" />

    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
  </button>

  {showNotifications && <NotificationDropdown />}
  <Link
  href="/about"
  className="rounded-xl border border-gray-300 dark:border-white/10 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 transition hover:border-cyan-500 hover:text-cyan-500"
>
  About
</Link>

</div>

        {/* User Profile Card */}
        {session ? (
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/[0.08] py-1.5 pl-1.5 pr-4 rounded-full hover:bg-gray-200 dark:hover:bg-white/[0.07] transition-all duration-200 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] group">
            <img
              src={session.user?.image || ""}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-white/[0.1] group-hover:border-indigo-400/50 transition-colors"
            />
           <div className="flex flex-col leading-tight">

  <span className="text-sm font-bold text-gray-900 dark:text-white">
    {session?.user?.name || "User"}
  </span>

  <span className="text-[11px] text-gray-500 dark:text-zinc-400 truncate max-w-[170px]">
    {session?.user?.email}
  </span>

</div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 group-hover:text-gray-700 dark:group-hover:text-zinc-300 ml-1 transition-colors" />

            <button
              onClick={() => signOut()}
              className="ml-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
              suppressHydrationWarning
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
            suppressHydrationWarning
          >
            <span className="relative z-10">Sign In</span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </button>
        )}
      </div>
    </motion.nav>
  );
}