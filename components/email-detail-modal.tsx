"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Reply, Forward, Archive, Trash2, Star, ArrowLeft } from "lucide-react";

interface EmailDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: {
    id: string;
    from: string;
    subject: string;
    snippet: string;
    body?: string;
  } | null;
}

export default function EmailDetailModal({ isOpen, onClose, email }: EmailDetailModalProps) {
  if (!email) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-[#0a0a0f] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-white/[0.06]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-md">
                  {email.subject}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors">
                  <Star className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors">
                  <Archive className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors">
                  <Trash2 className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Email Content */}
            <div className="overflow-y-auto p-6 max-h-[calc(90vh-8rem)]">
              {/* Email Metadata */}
              <div className="mb-6 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {email.from}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      &lt;{email.from.toLowerCase().replace(/\s/g, '')}@example.com&gt;
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      Today
                    </p>
                    <p className="text-sm text-gray-400 dark:text-neutral-500">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                  {email.body || email.snippet || "No content available."}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 p-4 border-t border-gray-200 dark:border-white/[0.06]">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20">
                <Reply className="w-4 h-4" />
                Reply
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors">
                <Forward className="w-4 h-4" />
                Forward
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}