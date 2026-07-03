"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Calendar,
  Sparkles,
  Star,
  CheckCheck,
  X,
} from "lucide-react";

interface Notification {
  id?: string;
  title: string;
  type: string;
  read?: boolean;
}

interface NotificationDropdownProps {
  onClose?: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();

      const list = (data.notifications || []).map((n: Notification) => ({
        ...n,
        read: false,
      }));

      setNotifications(list);
    } catch (err) {
      console.error(err);
    }
  }

  function markAllRead() {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  }

  function getIcon(type: string) {
    switch (type) {
      case "mail":
        return <Mail className="w-4 h-4 text-blue-500" />;
      case "meeting":
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case "important":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "ai":
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      default:
        return <Mail className="w-4 h-4 text-blue-500" />;
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] md:hidden"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div
        className="
          fixed
          top-16
          right-4
          left-auto
          w-[95vw]
          max-w-[420px]
          sm:max-w-[380px]
          md:absolute
          md:left-auto
          md:right-4
          md:top-14
          md:translate-x-0
          rounded-2xl
          border
          border-white/10
          bg-[#08101f]
          shadow-2xl
          shadow-black/50
          backdrop-blur-xl
          overflow-hidden
          z-[999]
          animate-in
          fade-in
          slide-in-from-top-4
          duration-300
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-5 py-4">
          <div>
            <h2 className="font-semibold text-white text-base">
              Notifications
            </h2>
            <p className="text-xs text-zinc-400">
              {unreadCount} unread
            </p>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <CheckCheck size={15} />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-sm">No notifications</p>
            <p className="text-xs text-zinc-600 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="max-h-[70vh] md:max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {notifications.map((item, index) => (
              <div
                key={item.id || index}
                className={`
                  flex items-start gap-4 px-4 sm:px-5 py-4 
                  border-b border-white/5 
                  hover:bg-white/5 transition-colors
                  ${item.read ? "opacity-50" : ""}
                  last:border-b-0
                `}
              >
                <div className="mt-1 flex-shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white break-words leading-5 line-clamp-2">
                    {item.title}
                  </p>
                  
                  {!item.read && (
                    <div className="mt-2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </div>

                {!item.read && (
                  <div className="flex-shrink-0 mt-1">
                    <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}