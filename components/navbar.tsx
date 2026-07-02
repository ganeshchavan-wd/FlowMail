"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Search, Bell, ChevronDown, Sparkles, Menu } from "lucide-react";
import Logo from "@/components/logo";
import NotificationDropdown from "./notification-dropdown";
import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-14 sm:h-16 lg:h-20 w-full border-b border-gray-200 dark:border-white/[0.06] flex items-center justify-between px-2 sm:px-4 md:px-10 bg-white/80 dark:bg-gradient-to-b dark:from-[#0a0a0f]/90 dark:to-[#030303]/90 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.6)] transition-colors duration-300"
    >
      {/* Left: Hamburger Menu + Logo */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Hamburger Menu - Mobile Only */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors -ml-1"
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-gray-700 dark:text-zinc-300" />
        </button>

        <Logo />
        <span className="hidden lg:inline-block text-[10px] uppercase tracking-[0.3em] text-gray-500 dark:text-zinc-500 font-bold ml-2 border-l border-gray-200 dark:border-white/[0.06] pl-3">
          AI Suite
        </span>
      </div>

      {/* Center: Search Bar with Icon */}
      <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block" />
        <div className="relative flex items-center w-full">
          <Search className="absolute left-4 w-4 h-4 text-gray-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search emails..."
            className="w-full bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/[0.08] rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500/50 focus:bg-gray-50 dark:focus:bg-white/[0.06] transition-all duration-300 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:placeholder:text-gray-500 dark:focus:placeholder:text-zinc-500 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
            suppressHydrationWarning
          />
          <kbd className="absolute right-3 hidden lg:flex items-center gap-1 text-[10px] font-mono text-gray-400 dark:text-zinc-500 bg-gray-200 dark:bg-white/[0.05] px-2 py-1 rounded border border-gray-300 dark:border-white/[0.06]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications + User Profile */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
        {/* Search Icon - Mobile Only */}
        <button className="md:hidden p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
          <Search size={18} className="text-gray-600 dark:text-zinc-400" />
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/[0.06] transition-colors group"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-400 dark:text-zinc-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotifications && (
            <div className="absolute right-2 md:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[360px]">
              <NotificationDropdown />
            </div>
          )}
        </div>

        {/* About Button - Hidden on Mobile */}
        <div className="hidden lg:block">
          <Link
            href="/about"
            className="rounded-xl border border-gray-300 dark:border-white/10 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 transition hover:border-cyan-500 hover:text-cyan-500"
          >
            About
          </Link>
        </div>

        {/* User Profile Card */}
        {session ? (
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/[0.08] py-1 pl-1 pr-2 sm:pr-3 md:pr-4 rounded-full hover:bg-gray-200 dark:hover:bg-white/[0.07] transition-all duration-200 shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] group max-w-fit">
            <img
              src={session.user?.image || ""}
              alt="Profile"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-2 border-gray-300 dark:border-white/[0.1] group-hover:border-indigo-400/50 transition-colors flex-shrink-0"
            />
            
            <div className="hidden sm:flex flex-col leading-tight min-w-0">
              <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-[110px]">
                {session?.user?.name || "User"}
              </span>
              <span className="hidden md:block text-[11px] text-gray-500 dark:text-zinc-400 truncate max-w-[170px]">
                {session?.user?.email}
              </span>
            </div>
            
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 group-hover:text-gray-700 dark:group-hover:text-zinc-300 ml-0.5 sm:ml-1 transition-colors flex-shrink-0" />

            <button
              onClick={() => signOut()}
              className="hidden lg:block ml-1 md:ml-2 text-[10px] uppercase tracking-[0.15em] text-gray-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium whitespace-nowrap"
              suppressHydrationWarning
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 whitespace-nowrap"
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