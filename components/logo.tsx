"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Logo() {
  const [error, setError] = useState(false);

  return (
    <Link href="/dashboard" className="flex items-center gap-3 select-none mb-8">
      {/* Logo with fallback */}
      <div className="relative w-10 h-10">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="absolute inset-0 rounded-[12px] shadow-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
        >
          {!error ? (
            <Image
              src="/logo.png"
              alt="FlowMail Logo"
              width={40}
              height={40}
              className="object-contain [&_img]:!bg-transparent"
              priority
              onError={() => setError(true)}
            />
          ) : (
            <span className="text-white font-bold text-lg">F</span>
          )}
        </motion.div>
      </div>

      {/* Brand Name */}
      <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
        Flow<span className="text-indigo-500 dark:text-indigo-400">Mail</span>
      </span>
    </Link>
  );
}