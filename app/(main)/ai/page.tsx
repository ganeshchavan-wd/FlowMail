"use client";


import { apiFetch } from "@/lib/api";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Calendar, 
  Video, 
  Layers, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Shield,
  XCircle
} from "lucide-react";
import AIActions from "@/components/ai-actions";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content?: string;
  type?: string;
  meeting?: {
    title: string;
    department: string;
    date: string;
    time: string;
    attendees: string[];
    meetLink: string;
    calendarLink: string;
  };
  isError?: boolean;
  isRestricted?: boolean;
};

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat.length > 0) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [chat]);

  const startListening = useCallback(() => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Browser does not support native voice recognition.");
      
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => setMessage(event.results[0][0].transcript);
      recognition.start();
    } catch (err) {
      console.error("Speech parsing failure:", err);
    }
  }, []);

  // Check if the message is email-related
  const isEmailRelated = (text: string): boolean => {
    const emailKeywords = [
      // Email actions
      "email", "mail", "inbox", "gmail", "outlook",
      "send", "reply", "forward", "compose", "draft",
      "schedule", "meeting", "calendar", "invite",
      "summarize", "categorize", "organize", "filter",
      // Email content
      "subject", "recipient", "cc", "bcc", "attachment",
      "greeting", "signature", "thread", "conversation",
      // Email status
      "unread", "read", "starred", "important", "urgent",
      "spam", "trash", "archive", "folder", "label",
      // Department/team related
      "department", "team", "member", "colleague",
      // Meeting related
      "meeting", "call", "conference", "zoom", "google meet",
      "schedule", "reschedule", "cancel", "attendee",
      // Actions on emails
      "archive", "delete", "move", "copy", "mark as",
      "flag", "follow up", "reminder",
      // Common email phrases
      "send an email", "write an email", "draft an email",
      "check my email", "read my email", "new email",
      "email from", "email to", "email about",
    ];

    // Also check for email-like patterns (contains @ or "email" context)
    const hasEmailPattern = /[\w\.-]+@[\w\.-]+\.\w+/.test(text);
    const hasEmailWord = /\bemail\b|\bmail\b|\binbox\b|\bgmail\b/i.test(text);

    // Check if any keyword matches
    const hasKeyword = emailKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );

    // Additional check: meeting scheduling phrases
    const hasMeetingPhrase = /\b(schedule|set up|arrange|book)\s+(a|an)?\s*(meeting|call|appointment|event)\b/i.test(text);
    const hasTimePhrase = /\b(at|on)\s+(\d{1,2}(:\d{2})?\s*(am|pm)?|\d{1,2}\s*(am|pm))\b/i.test(text);
    const hasDatePhrase = /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next|this)\s+(week|month|day|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(text);

    return hasKeyword || hasEmailPattern || hasEmailWord || hasMeetingPhrase || (hasTimePhrase && hasDatePhrase);
  };

  // Check if the message is restricted (non-email related)
  const isRestrictedTopic = (text: string): boolean => {
    const restrictedKeywords = [
      // General knowledge
      "who is", "what is", "when is", "where is", "why is", "how to",
      "tell me about", "explain", "define", "meaning of",
      // Personal questions
      "how are you", "what's your name", "who are you", "hello", "hi",
      // General chat
      "weather", "news", "sports", "politics", "movie", "music",
      "food", "recipe", "travel", "history", "science",
      "math", "calculator", "translate", "language",
      // Programming
      "code", "programming", "python", "javascript", "react",
      "nextjs", "tailwind", "css", "html", "sql",
      // General questions
      "what", "who", "where", "when", "why", "how",
    ];

    // Check if the text is too short (likely not email-related)
    if (text.trim().length < 10) {
      return true;
    }

    // Check if any restricted keyword matches
    return restrictedKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    
    const userMessage = message;
    const newUserMsg: ChatMessage = { id: Date.now(), role: "user", content: userMessage };
    
    setChat((prev) => [...prev, newUserMsg]);
    setMessage("");
    setLoading(true);

    // Check if the message is email-related
    const isEmailRelatedPrompt = isEmailRelated(userMessage);
    const isRestrictedPrompt = isRestrictedTopic(userMessage);

    // If the message is restricted (general chat), return a focused response
    if (isRestrictedPrompt && !isEmailRelatedPrompt) {
      setChat((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "🤖 I'm FlowMail AI, your email and productivity assistant. I can help you with:\n\n📧 **Email Management** - Read, send, organize, and summarize emails\n📅 **Meeting Scheduling** - Schedule meetings with Google Calendar\n🏢 **Department Management** - Manage team departments and members\n📊 **Email Analysis** - Summarize and categorize your inbox\n\nI'm specifically designed for email-related tasks. Feel free to ask me about anything related to your emails, calendar, or productivity!",
          isRestricted: true,
        },
      ]);
      setLoading(false);
      return;
    }

    // If the message is not email-related at all
    if (!isEmailRelatedPrompt) {
      setChat((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "❌ I'm specifically designed to help with email and productivity tasks. I can assist you with:\n\n• Reading and managing your emails\n• Scheduling meetings and calendar events\n• Summarizing and categorizing your inbox\n• Managing departments and team members\n\nPlease ask me something related to email management or calendar scheduling!",
          isRestricted: true,
        },
      ]);
      setLoading(false);
      return;
    }

    // If email-related, proceed with the API call
    try {
      const response = await apiFetch("/api/chat", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ message: userMessage }) 
      });
      const data = await response.json();

      if (data.type === "meeting") {
        setChat((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            type: "meeting",
            meeting: data.meeting,
          },
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: data.reply,
          },
        ]);
      }
    } catch { 
      setChat((prev) => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          role: "assistant", 
          content: "An unexpected error occurred. Please try again.",
          isError: true,
        }
      ]); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#060608] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100/50 dark:from-indigo-950/20 via-gray-50 dark:via-[#060608] to-gray-100/30 dark:to-[#010103] text-gray-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors duration-300">
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Floating background ambient glow – only in dark mode */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0 hidden lg:block dark:block" />

        <main className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-8 pt-6 sm:pt-10 lg:pt-8 pb-36 w-full z-10 custom-scrollbar">
          
          {/* Welcoming Interactive Hero Header */}
          <AnimatePresence>
            {chat.length === 0 && (
              <motion.header 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 sm:mb-12 pt-6 sm:pt-10 lg:pt-20"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-medium mb-4 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Email & Productivity AI
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-6xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
                  How can I help with your email workflow?
                </h1>
                <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base lg:text-lg max-w-2xl font-light leading-relaxed mb-8">
                  I'm your email assistant. Ask me about managing emails, scheduling meetings, or organizing your inbox.
                </p>
                <AIActions onSelect={(p) => setMessage(p)} />
              </motion.header>
            )}
          </AnimatePresence>

          {/* Conversation Stream */}
          <div className="flex flex-col gap-6 mt-4 max-w-4xl mx-auto">
            <AnimatePresence initial={false}>
              {chat.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, y: 12 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-4 sm:p-5 lg:p-6 rounded-2xl w-full max-w-full sm:max-w-[88%] shadow-2xl transition-all ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-medium border border-indigo-500/30 shadow-indigo-900/20" 
                      : msg.isRestricted
                        ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/20 backdrop-blur-md text-gray-800 dark:text-zinc-200"
                        : msg.isError
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 backdrop-blur-md text-gray-800 dark:text-zinc-200"
                          : "bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-white/[0.08] backdrop-blur-md text-gray-800 dark:text-zinc-200"
                  }`}>
                    {msg.type === "meeting" && msg.meeting ? (
                      // Meeting card
                      <div className="space-y-5 w-full min-w-0">
                        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-200 dark:border-white/[0.08]">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 rounded-xl">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-widest font-bold">System Automator</span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Meeting Confirmed</h3>
                          </div>
                        </div>

                        <div className="space-y-3.5 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-0.5">Topic Architecture</p>
                            <p className="font-semibold text-gray-800 dark:text-zinc-100 text-base">{msg.meeting.title}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div className="bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] rounded-xl p-2.5">
                              <p className="text-xs text-gray-500 dark:text-zinc-500 flex items-center gap-1.5 mb-1">
                                <Layers className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" /> Dept.
                              </p>
                              <p className="font-medium text-gray-700 dark:text-zinc-200 truncate">{msg.meeting.department}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] rounded-xl p-2.5">
                              <p className="text-xs text-gray-500 dark:text-zinc-500 flex items-center gap-1.5 mb-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" /> Timeline
                              </p>
                              <p className="font-medium text-gray-700 dark:text-zinc-200 text-xs truncate">{msg.meeting.date} ({msg.meeting.time})</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-zinc-500 flex items-center gap-1.5 mb-2">
                              <Users className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" /> Invited Attendees
                            </p>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                              {msg.meeting.attendees.map((email: string) => (
                                <span key={email} className="text-xs bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/[0.06] text-gray-700 dark:text-zinc-300 px-2.5 py-1 rounded-md tracking-tight break-all">
                                  {email}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <a
                            href={msg.meeting.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 shadow-lg shadow-emerald-950/40 transition-all active:scale-[0.98]"
                          >
                            <Video className="w-4 h-4" /> Join Google Meet
                          </a>
                          <a
                            href={msg.meeting.calendarLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-300 dark:border-white/[0.08] text-gray-800 dark:text-zinc-200 font-semibold py-3 px-4 transition-all active:scale-[0.98]"
                          >
                            <Calendar className="w-4 h-4" /> Open Calendar
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base tracking-wide">
                        {msg.isRestricted ? (
                          <span className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{msg.content}</span>
                          </span>
                        ) : msg.isError ? (
                          <span className="flex items-start gap-2 text-rose-600 dark:text-rose-400 font-medium">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{msg.content}</span>
                          </span>
                        ) : (
                          msg.content
                        )}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing/Thinking State Indicator */}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-white/[0.06] backdrop-blur-md text-gray-600 dark:text-zinc-400 py-3.5 px-5 rounded-2xl flex items-center gap-3 shadow-xl">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs tracking-wider font-medium bg-gradient-to-r from-gray-600 to-gray-400 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">Processing your request...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Fixed Floating Input Command Box */}
          <div className="fixed bottom-3 left-3 right-3 lg:left-[340px] lg:right-12 z-30">
            <div className={`p-1.5 sm:p-2 rounded-2xl bg-white/90 dark:bg-zinc-950/70 border backdrop-blur-2xl flex items-center gap-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 ${
              isListening ? "border-red-500/40 ring-1 ring-red-500/20" : "border-gray-300 dark:border-white/[0.08] focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/20"
            }`}>
              <button 
                onClick={startListening} 
                type="button"
                className={`p-3 sm:p-3.5 rounded-xl transition-all flex items-center justify-center relative group active:scale-95 ${
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-gray-100 dark:bg-white/[0.03] text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 border border-gray-300 dark:border-white/[0.02] hover:bg-gray-200 dark:hover:bg-white/5"
                }`}
                title={isListening ? "Listening active..." : "Trigger voice transcription input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="absolute -top-10 bg-gray-900 dark:bg-zinc-900 border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">Voice Input</span>
              </button>

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Ask me about emails, meetings, or inbox management..."
                className="flex-1 bg-transparent px-3 py-3 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 text-sm sm:text-base tracking-wide"
                disabled={loading}
              />

              <button 
                onClick={sendMessage} 
                type="button"
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-300 dark:disabled:bg-zinc-800 text-white p-3 sm:p-3.5 rounded-xl font-bold transition-all disabled:opacity-30 flex items-center justify-center active:scale-95 shadow-md shadow-indigo-900/20 disabled:shadow-none disabled:pointer-events-none"
                disabled={!message.trim() || loading}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="hidden sm:block text-[10px] text-center text-gray-500 dark:text-zinc-600 tracking-wide mt-2">
              💡 I'm your email assistant. Ask me about emails, meetings, or calendar management.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}