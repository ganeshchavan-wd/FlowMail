import "./globals.css";
import Providers from "../components/providers";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata = {
  title: "FlowMail AI",
  description: "AI Powered Email & Calendar Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#030303] text-gray-900 dark:text-white transition-colors duration-300">
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}