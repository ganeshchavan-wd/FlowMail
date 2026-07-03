"use client";

import { useEffect } from "react";

export default function DevWarningSuppressor() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === "development") {
      const originalError = console.error;
      console.error = (...args) => {
        // Suppress hydration warnings caused by browser extensions
        if (
          typeof args[0] === "string" &&
          (args[0].includes("Warning: Expected server HTML") ||
           args[0].includes("fdprocessedid") ||
           args[0].includes("hydrat"))
        ) {
          return;
        }
        originalError.call(console, ...args);
      };
      return () => {
        console.error = originalError;
      };
    }
  }, []);

  return null;
}