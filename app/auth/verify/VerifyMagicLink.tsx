"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite/client";

interface Props {
  userId?: string;
  secret?: string;
}

export default function VerifyMagicLink({
  userId,
  secret,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(
    "Verifying your magic link..."
  );

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout | undefined;

    const verify = async () => {
      // Check URL parameters
      if (!userId || !secret) {
        setStatus("Invalid or incomplete magic link.");
        return;
      }

      try {
        // --------------------------------------------------
        // 1. Check whether an Appwrite session already exists
        // --------------------------------------------------
        try {
          const existingUser = await account.get();

          if (existingUser) {
            console.log(
              "Existing Appwrite session:",
              existingUser
            );

            setStatus("Already signed in. Redirecting...");

            redirectTimer = setTimeout(() => {
              router.replace("/dashboard");
            }, 800);

            return;
          }
        } catch {
          // No active session.
          // Continue and create one from the Magic URL.
        }

        // --------------------------------------------------
        // 2. Create Appwrite session using Magic URL
        // --------------------------------------------------
        await account.createSession({
          userId,
          secret,
        });

        // --------------------------------------------------
        // 3. Get the authenticated Appwrite user
        // --------------------------------------------------
        const user = await account.get();

        console.log("Appwrite logged in user:", {
          id: user.$id,
          email: user.email,
          name: user.name,
        });

        // --------------------------------------------------
        // 4. Successful login
        // --------------------------------------------------
        setStatus("Login successful! Redirecting...");

        redirectTimer = setTimeout(() => {
          router.replace("/dashboard");
        }, 1000);
      } catch (error: any) {
        console.error(
          "Magic URL verification error:",
          error
        );

        // Handle already-active-session case
        if (
          error?.message?.includes(
            "Creation of a session is prohibited"
          )
        ) {
          setStatus(
            "You are already signed in. Redirecting..."
          );

          redirectTimer = setTimeout(() => {
            router.replace("/dashboard");
          }, 800);

          return;
        }

        setStatus(
          "This magic link is invalid, expired, or has already been used."
        );
      }
    };

    verify();

    // Cleanup timer when component unmounts
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [userId, secret, router]);

  const isError =
    status.includes("Invalid") ||
    status.includes("expired") ||
    status.includes("already been used");

  return (
    <main className="min-h-screen bg-[#05070d] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] top-[-200px] left-[-150px]" />

      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] bottom-[-200px] right-[-150px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-2xl">
        {/* Logo */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="text-2xl font-bold text-white">
            F
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white">
          FlowMail
        </h1>

        {/* Status */}
        <p className="mt-4 text-zinc-400">
          {status}
        </p>

        {/* Loading indicator */}
        {!isError && (
          <div className="mt-6 flex justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-indigo-500 animate-spin" />
          </div>
        )}

        {/* Error button */}
        {isError && (
          <button
            onClick={() => router.replace("/login")}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            Back to Login
          </button>
        )}
      </div>
    </main>
  );
}