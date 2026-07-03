"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Calendar,
  Sparkles,
  Star,
  CheckCheck,
} from "lucide-react";

interface Notification {
  id?: string;
  title: string;
  type: string;
  read?: boolean;
}

export default function NotificationDropdown() {
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
    <div
      className="
      absolute
      right-2
      top-14
      w-[92vw]
      max-w-sm
      sm:w-80
      rounded-2xl
      border
      border-white/10
      bg-[#08101f]
      shadow-2xl
      backdrop-blur-xl
      overflow-hidden
      z-[999]
    "
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="font-semibold text-white">
            Notifications
          </h2>

          <p className="text-xs text-zinc-400">
            {unreadCount} unread
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      {/* Empty */}
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-zinc-500">
          No notifications
        </div>
      ) : (
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition ${
                item.read ? "opacity-50" : ""
              }`}
            >
              <div className="mt-1">
                {getIcon(item.type)}
              </div>

              <div className="flex-1">
                <p className="text-sm text-white">
                  {item.title}
                </p>

                {!item.read && (
                  <div className="mt-2 w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}