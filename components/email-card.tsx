"use client";

import { motion } from "framer-motion";

interface EmailCardProps {
  sender: string;
  subject: string;
  preview: string;
  onClick?: () => void;
}

export default function EmailCard({ sender, subject, preview, onClick }: EmailCardProps) {
  return (
    <motion.div 
      onClick={onClick}
      className="cursor-pointer"
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
        {sender}
      </h4>
      <p className="text-xs font-medium text-gray-700 dark:text-neutral-300 truncate">
        {subject}
      </p>
      <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
        {preview}
      </p>
    </motion.div>
  );
}