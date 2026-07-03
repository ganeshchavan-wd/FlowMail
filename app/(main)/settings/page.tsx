"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Bell, 
  Mail, 
  Calendar, 
  Sparkles, 
  Database,
  CheckCircle2,
  Loader2
} from "lucide-react";
import ToggleSwitch from "@/components/ToggleSwitch";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notifications, setNotifications] = useState(true);
  const [emailSync, setEmailSync] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);
  const [aiAssist, setAiAssist] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("flowmail-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setTheme(settings.theme || "system");
        setNotifications(settings.notifications !== undefined ? settings.notifications : true);
        setEmailSync(settings.emailSync !== undefined ? settings.emailSync : true);
        setCalendarSync(settings.calendarSync !== undefined ? settings.calendarSync : true);
        setAiAssist(settings.aiAssist !== undefined ? settings.aiAssist : true);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    
    // Apply theme immediately
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    const settings = { theme, notifications, emailSync, calendarSync, aiAssist };
    localStorage.setItem("flowmail-settings", JSON.stringify(settings));

    await new Promise(resolve => setTimeout(resolve, 800));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/3 h-[500px] w-[700px] rounded-full bg-purple-500/15 blur-[120px] dark:block hidden" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px] dark:block hidden" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Manage your FlowMail AI preferences and integrations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-xl transition hover:border-gray-300 dark:hover:border-white/10"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                  <Monitor className="h-4.5 w-4.5 text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
              </div>

              <div className="space-y-3">
                {[
                  { value: "light", icon: Sun, label: "Light Mode" },
                  { value: "dark", icon: Moon, label: "Dark Mode" },
                  { value: "system", icon: Monitor, label: "System Default" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value as typeof theme)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 transition ${
                      theme === option.value
                        ? "border-purple-500/50 bg-purple-500/10 dark:bg-purple-500/5"
                        : "border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10"
                    }`}
                  >
                    <option.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-white/80">{option.label}</span>
                    {theme === option.value && (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-xl transition hover:border-gray-300 dark:hover:border-white/10"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                  <Bell className="h-4.5 w-4.5 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
              </div>

              <ToggleSwitch
                enabled={notifications}
                onChange={setNotifications}
                size="md"
                label={notifications ? "Notifications On" : "Notifications Off"}
                description={notifications ? "You'll receive AI alerts and reminders" : "All notifications are muted"}
              />
            </div>
          </motion.div>

          {/* Integrations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-xl transition hover:border-gray-300 dark:hover:border-white/10"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                  <Database className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Integrations</h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "emailSync",
                    label: "Gmail Sync",
                    description: "Sync emails from your Gmail account",
                    icon: Mail,
                    value: emailSync,
                    setValue: setEmailSync,
                  },
                  {
                    key: "calendarSync",
                    label: "Calendar Sync",
                    description: "Sync events from Google Calendar",
                    icon: Calendar,
                    value: calendarSync,
                    setValue: setCalendarSync,
                  },
                  {
                    key: "aiAssist",
                    label: "AI Assistant",
                    description: "Enable AI-powered email assistance",
                    icon: Sparkles,
                    value: aiAssist,
                    setValue: setAiAssist,
                  },
                ].map((integration) => (
                  <div
                    key={integration.key}
                    className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <integration.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-white/80">
                          {integration.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={integration.value}
                      onChange={integration.setValue}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-sm text-gray-500 dark:text-zinc-400">
              {saved ? (
                <span className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  Settings saved successfully!
                </span>
              ) : (
                "Changes are saved locally and will persist across sessions"
              )}
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Saved!
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}