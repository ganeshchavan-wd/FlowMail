import "./globals.css";
import Providers from "../components/providers";
import { ThemeProvider } from "@/contexts/ThemeContext";
import DevWarningSuppressor from "@/components/DevWarningSuppressor";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "FlowMail AI",
  description: "AI Powered Email & Calendar Assistant",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        suppressHydrationWarning 
        className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white transition-colors duration-300"
      >
        <DevWarningSuppressor />
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}