"use client";

import { useEffect, useState } from "react";
import { Mail, Calendar, Sparkles, Star } from "lucide-react";

interface Notification {
  title: string;
  type: string;
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

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    }
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
        return <Mail className="w-4 h-4" />;
    }
  }

  return (
    <div className="absolute right-0 top-14 w-80 rounded-2xl border border-white/10 bg-[#08101f] shadow-2xl backdrop-blur-xl overflow-hidden z-50">

      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="font-semibold text-white">
          Notifications
        </h2>
      </div>

      {notifications.length === 0 ? (
        <div className="p-6 text-center text-zinc-500">
          No notifications
        </div>
      ) : (
        notifications.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b border-white/5 px-5 py-4 hover:bg-white/5 transition"
          >
            {getIcon(item.type)}

            <span className="text-sm text-white">
              {item.title}
            </span>
          </div>
        ))
      )}

    </div>
  );
}