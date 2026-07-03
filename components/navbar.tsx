"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  title: string;
  type: string;
  isRead: boolean;
  time: string;
  createdAt: string;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingEmails, setCheckingEmails] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      console.log("🔔 Fetching notifications...");
      const response = await fetch("/api/notifications");
      console.log("📡 Response status:", response.status);
      
      const data = await response.json();
      console.log("📦 Response data:", data);
      
      if (data.success) {
        console.log(`✅ Setting ${data.notifications?.length || 0} notifications`);
        setNotifications(data.notifications || []);
      } else {
        console.error("❌ API returned error:", data.error);
      }
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
    }
  };

  // Check for new emails
  const checkNewEmails = async () => {
    if (checkingEmails) return;
    
    try {
      setCheckingEmails(true);
      console.log("📧 Checking for new emails...");
      const response = await fetch("/api/gmail/check-new");
      const data = await response.json();
      console.log("📧 Email check response:", data);
      
      if (data.success && data.count > 0) {
        console.log(`📧 ${data.count} new email(s) detected`);
        // New emails found, refresh notifications
        await fetchNotifications();
      } else {
        console.log("📧 No new emails found");
      }
    } catch (error) {
      console.error("❌ Failed to check new emails:", error);
    } finally {
      setCheckingEmails(false);
    }
  };

  // Load notifications on mount
  useEffect(() => {
    console.log("🔔 Navbar mounted - fetching initial notifications...");
    fetchNotifications();

    // Check for new emails every 30 seconds
    const emailCheckInterval = setInterval(checkNewEmails, 30000);
    
    // Refresh notifications every 60 seconds
    const notificationInterval = setInterval(fetchNotifications, 60000);

    return () => {
      clearInterval(emailCheckInterval);
      clearInterval(notificationInterval);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/")[1] || "dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark all notifications as read
  const markAllRead = async () => {
    try {
      console.log("📝 Marking all notifications as read...");
      const response = await fetch("/api/notifications/read", {
        method: "POST",
      });
      const data = await response.json();
      
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            isRead: true,
          }))
        );
        console.log("✅ All notifications marked as read");
      }
    } catch (error) {
      console.error("❌ Failed to mark all as read:", error);
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ai":
        return "🤖";
      case "mail":
        return "📧";
      case "meeting":
        return "📅";
      case "department":
        return "🏢";
      default:
        return "📌";
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left section - Menu and title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 lg:hidden transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {getPageTitle()}
                </h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {pathname === "/dashboard" ? "Welcome back!" : "Manage your workspace"}
                </p>
              </div>
            </div>
          </div>

          {/* Right section - Search, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-1.5 transition focus-within:border-indigo-500/50">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 w-32 lg:w-48"
              />
            </div>

            {/* Notifications */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => {
                  console.log("🔔 Bell clicked - toggling notifications");
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    // Refresh notifications and check for new emails when opening
                    console.log("🔔 Opening notifications - refreshing...");
                    fetchNotifications();
                    checkNewEmails();
                  }
                }}
                className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
                {/* Small dot to indicate checking emails */}
                {checkingEmails && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="
                    absolute
                    right-2
                    top-12
                    w-[92vw]
                    max-w-sm
                    sm:w-80
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-white/10
                    bg-white
                    dark:bg-[#111]
                    shadow-2xl
                    overflow-hidden
                    z-50
                  "
                >
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 px-4 py-3">
                    <h3 className="font-semibold text-sm">
                      Notifications
                      {notifications.length > 0 && (
                        <span className="ml-1 text-xs font-normal text-gray-500">
                          ({notifications.length})
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          console.log("🔄 Manual refresh triggered");
                          fetchNotifications();
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                        title="Refresh notifications"
                      >
                        🔄
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <div className="text-3xl mb-2">🔔</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Click the refresh button to check for new emails
                        </p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border-b border-gray-200 dark:border-white/5 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-white/5 ${
                            notification.isRead
                              ? "opacity-50"
                              : "bg-indigo-50/50 dark:bg-indigo-500/10"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-gray-200 dark:border-white/10 px-4 py-2 text-center">
                    <button 
                      onClick={() => {
                        console.log("🔄 Checking for new emails from button...");
                        checkNewEmails();
                      }}
                      disabled={checkingEmails}
                      className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 transition-colors disabled:opacity-50"
                    >
                      {checkingEmails ? "⏳ Checking..." : "🔄 Check for new emails"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 md:gap-3 bg-gray-100 dark:bg-white/[0.04] border border-gray-300 dark:border-white/[0.08] py-1.5 pl-1.5 pr-3 md:pr-4 rounded-full hover:bg-gray-200 dark:hover:bg-white/[0.07] transition-all duration-200"
                aria-label="Profile menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                    {session?.user?.email || "user@email.com"}
                  </p>
                </div>
                <User className="hidden md:block h-4 w-4 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session?.user?.email || "user@email.com"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      About FlowMail AI
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 dark:border-white/10" />

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      signOut({
                        callbackUrl: "/login",
                      });
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}