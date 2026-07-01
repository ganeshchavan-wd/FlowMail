"use client";

import Link from "next/link";
import type { Transition } from "framer-motion";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import Logo from "@/components/logo";
import {
  LayoutDashboard,
  Inbox,
  Bot,
  Building2,
  Settings,
} from "lucide-react";

const links = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    borderColor: "border-blue-400",
    glowColor: "shadow-blue-500/40",
  },
  { 
    name: "Inbox", 
    href: "/inbox", 
    icon: Inbox,
    borderColor: "border-emerald-400",
    glowColor: "shadow-emerald-400/40",
  },
  { 
    name: "AI Assistant", 
    href: "/ai", 
    icon: Bot,
    borderColor: "border-purple-400",
    glowColor: "shadow-purple-400/40",
  },
  { 
    name: "Departments", 
    href: "/department", 
    icon: Building2,
    borderColor: "border-amber-400",
    glowColor: "shadow-amber-400/40",
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings,
    borderColor: "border-zinc-400",
    glowColor: "shadow-zinc-400/20",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const premiumSpring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
};

  return (
    <aside className="relative w-64 h-screen bg-white dark:bg-[#070709] border-r border-gray-200 dark:border-white/[0.04] p-5 flex flex-col sticky top-0 shadow-[4px_0_32px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_32px_rgba(0,0,0,0.4)] overflow-hidden select-none transition-colors duration-300">
      {/* Background glow – only in dark mode */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none opacity-0 dark:opacity-30 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 75%)",
        }}
      />

      {/* Logo – with explicit width constraint and overflow hidden */}
     <div className="w-full max-w-full overflow-hidden">
  <Logo />
</div>

      {/* Navigation */}
      <LayoutGroup id="sidebar-navigation">
        <nav className="space-y-1 relative z-10 flex-1 overflow-y-auto">
          {links.map(({ name, href, icon: Icon, borderColor, glowColor }) => {
            const isActive = pathname === href;

            return (
              <Link key={name} href={href} className="relative block outline-none group">
                <motion.div
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className={`
                    relative flex items-center gap-4 px-4 py-3 rounded-xl 
                    transition-all duration-200
                    ${isActive 
                      ? "text-gray-900 dark:text-zinc-50 font-semibold" 
                      : "text-gray-500 dark:text-zinc-400 font-medium hover:text-gray-700 dark:hover:text-zinc-100"
                    }
                    ${isActive 
                      ? `border-l-[3px] ${borderColor} shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]` 
                      : "border-l-[3px] border-transparent hover:border-l-[3px] hover:border-gray-300 dark:hover:border-white/[0.08]"
                    }
                    ${isActive 
                      ? "border-b border-gray-200 dark:border-white/[0.04]" 
                      : "border-b border-transparent hover:border-b hover:border-gray-200 dark:hover:border-white/[0.03]"
                    }
                  `}
                >
                  {/* Active bottom glow line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomGlow"
                      className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gray-400/40 dark:via-white/20 to-transparent"
                      transition={premiumSpring}
                    />
                  )}

                  {/* Icon Container */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`
                        w-9 h-9 rounded-xl flex items-center justify-center 
                        border-2 ${borderColor} 
                        bg-white/10 dark:bg-black/30 backdrop-blur-sm
                        transition-all duration-300
                        ${isActive 
                          ? `scale-110 border-opacity-100 ${glowColor} shadow-lg` 
                          : "border-opacity-40 group-hover:border-opacity-80 group-hover:scale-105"
                        }
                      `}
                      style={{
                        boxShadow: isActive
                          ? `0 8px 24px -6px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
                          : `0 4px 12px -4px rgba(0,0,0,0.1)`,
                      }}
                    >
                      <Icon
                        size={18}
                        strokeWidth={2}
                        className="text-gray-800 dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </div>
                    {/* Subtle edge highlight */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none opacity-0 dark:opacity-30" />
                  </div>

                  {/* Label – with truncation */}
                  <span className="text-sm tracking-tight relative z-10 truncate min-w-0">
                    {name}
                  </span>

                  {/* Active status dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-[0_0_12px_rgba(99,102,241,0.6)] relative z-10 flex-shrink-0"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>

      {/* Footer status */}
      <div className="mt-auto relative overflow-hidden p-4 border border-gray-200 dark:border-white/[0.03] rounded-xl bg-gradient-to-b from-white/30 to-white/10 dark:from-white/[0.01] dark:to-white/[0.03] shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] flex-shrink-0">
        <div className="absolute inset-0 bg-gray-100/40 dark:bg-zinc-950/40 backdrop-blur-md -z-10" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500 font-bold">
          System Status
        </p>
        <div className="flex items-center gap-2.5 mt-2.5">
          <div className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-25 duration-1000" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-zinc-300 tracking-tight truncate min-w-0">
            All Systems Operational
          </span>
        </div>
      </div>
    </aside>
  );
}