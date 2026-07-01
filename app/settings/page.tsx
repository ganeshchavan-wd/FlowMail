"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { useTheme } from "@/contexts/ThemeContext";
import {
  User,
  Bell,
  Palette,
  Plug,
  AlertTriangle,
  Shield,
  Mail,
  Zap,
  Moon,
  Sun,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// ✅ MOVED OUTSIDE – no longer defined inside the component
const ToggleSwitch = ({
  enabled,
  onChange,
  size = "md",
}: {
  enabled: boolean;
  onChange: () => void;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: "w-10 h-6",
    md: "w-12 h-7",
    lg: "w-14 h-8",
  };
  const dotSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={() => {
        console.log("ToggleSwitch clicked, enabled before:", enabled);
        onChange();
      }}
      className={`relative rounded-full transition-all duration-300 ease-in-out ${sizes[size]} ${
        enabled
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30"
          : "bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out ${dotSizes[size]} ${
          enabled ? "right-1 translate-x-0" : "left-1 -translate-x-0"
        }`}
      />
    </button>
  );
};

// ✅ MOVED OUTSIDE
const SettingCard = ({
  icon: Icon,
  title,
  children,
  className = "",
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-zinc-800/50 hover:border-gray-300 dark:hover:border-zinc-700/50 transition-all duration-300 shadow-md dark:shadow-xl dark:shadow-black/20 ${className}`}
  >
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-200 dark:border-indigo-500/10">
        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
    </div>
    {children}
  </div>
);

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  useEffect(() => {
    setMounted(true);
    console.log("Settings mounted, theme from context:", theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Navbar />
        <main className="p-6 md:p-8 lg:p-10 w-full">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-200 dark:border-indigo-500/10">
                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                Settings
              </h1>
            </div>
            <p className="text-gray-500 dark:text-zinc-400 text-sm ml-1">
              Manage your account preferences and application settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile */}
            <div className="lg:col-span-2">
              <SettingCard icon={User} title="Profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-zinc-400 block mb-1.5 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-gray-100 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700/50 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-zinc-400 block mb-1.5 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-gray-100 dark:bg-zinc-800/80 border border-gray-300 dark:border-zinc-700/50 focus:border-indigo-500/50 rounded-xl px-4 py-3.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 text-white">
                  Save Changes
                </button>
              </SettingCard>
            </div>

            {/* Notifications */}
            <SettingCard icon={Bell} title="Notifications">
              <div className="space-y-1">
                <div className="flex items-center justify-between py-3 px-1 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800/30 transition-colors duration-150">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                      <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-white">
                      Email Notifications
                    </span>
                  </div>
                  <ToggleSwitch
                    enabled={emailNotifications}
                    onChange={() => {
                      console.log("Toggling email notifications");
                      setEmailNotifications(!emailNotifications);
                    }}
                    size="md"
                  />
                </div>

                <div className="flex items-center justify-between py-3 px-1 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800/30 transition-colors duration-150">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10">
                      <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-white">
                      AI Suggestions
                    </span>
                  </div>
                  <ToggleSwitch
                    enabled={aiSuggestions}
                    onChange={() => {
                      console.log("Toggling AI suggestions");
                      setAiSuggestions(!aiSuggestions);
                    }}
                    size="md"
                  />
                </div>
              </div>
            </SettingCard>

            {/* Appearance */}
            <SettingCard icon={Palette} title="Appearance">
              <div className="flex items-center justify-between py-3 px-1 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800/30 transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                    {mounted && (theme === "dark" ? (
                      <Moon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-white">
                    Dark Mode
                  </span>
                </div>
                <ToggleSwitch
                  enabled={mounted ? theme === "dark" : false}
                  onChange={() => {
                    console.log("Dark mode toggle clicked, current theme:", theme);
                    toggleTheme();
                  }}
                  size="md"
                />
              </div>

              {/* Debug button – wrapped in JSX comment correctly */}
              <div className="mt-4 p-4 border border-dashed border-red-500/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">
                  Debug – click to toggle directly:
                </p>
                <button
                  onClick={() => {
                    console.log("🔴 Manual toggle clicked");
                    toggleTheme();
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
                >
                  Force Toggle
                </button>
                <span className="ml-3 text-xs text-gray-500 dark:text-zinc-400">
                  Current theme: <strong>{theme}</strong>
                </span>
              </div>
            </SettingCard>

            {/* Integrations */}
            <div className="lg:col-span-2">
              <SettingCard icon={Plug} title="Integrations">
                <div className="space-y-2">
                  {[
                    { icon: "📧", name: "Gmail", status: "Connected", color: "text-emerald-600 dark:text-emerald-400" },
                    { icon: "📅", name: "Google Calendar", status: "Connected", color: "text-emerald-600 dark:text-emerald-400" },
                    { icon: "🤖", name: "Gemini AI", status: "Active", color: "text-emerald-600 dark:text-emerald-400" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-100 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-800/80 rounded-xl px-4 py-3.5 transition-all duration-200 border border-gray-200 dark:border-zinc-700/30 hover:border-gray-300 dark:hover:border-zinc-600/50 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-white">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${item.color} bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full`}
                        >
                          {item.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-zinc-600 group-hover:text-gray-600 dark:group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </SettingCard>
            </div>

            {/* Danger Zone */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-2xl border border-red-300 dark:border-red-800/30 bg-red-50 dark:bg-gradient-to-br from-red-950/40 to-red-950/10 backdrop-blur-sm p-6 shadow-md dark:shadow-xl dark:shadow-red-900/10">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
                      Danger Zone
                    </h2>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-5 max-w-md">
                    Permanently disconnect your account from all services. This action cannot be undone.
                  </p>

                  <button className="group relative overflow-hidden px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/30">
                    <span className="relative z-10 flex items-center gap-2 text-white">
                      Disconnect Account
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}