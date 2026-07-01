import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About FlowMail AI — AI-Powered Email Productivity",
  description:
    "FlowMail AI combines Gmail, Google Calendar and Google Gemini AI into one intelligent productivity platform. Meet the team and the technology.",
  openGraph: {
    title: "About FlowMail AI",
    description:
      "An AI-first productivity platform for smarter email, calendar and team workflows.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}