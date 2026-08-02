import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";

interface SummaryData {
  overview: { totalEmails: number; summary: string };
  important: Array<{ subject: string; sender: string; reason: string }>;
  urgent: Array<{ task: string }>;
  meetings: Array<{ title: string; time: string }>;
  summary: string[];
}

export async function GET() {
  const session: any = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json({ success: false, error: "Not authenticated" });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const list = await gmail.users.messages.list({ userId: "me", maxResults: 10 });
    const messages = list.data.messages || [];

    if (messages.length === 0) {
      return Response.json({
        success: true,
        data: {
          overview: { totalEmails: 0, summary: "No emails found in your inbox." },
          important: [],
          urgent: [],
          meetings: [],
          summary: ["Your inbox is empty!"],
        },
      });
    }

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({ userId: "me", id: msg.id! });
        const headers = email.data.payload?.headers || [];
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";
        return `\nFrom: ${from}\nSubject: ${subject}\nSnippet: ${email.data.snippet}\n`;
      })
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are FlowMail AI. Analyze the following emails and return ONLY valid JSON.

The JSON MUST follow this structure exactly:
{
  "overview": { "totalEmails": 0, "summary": "" },
  "important": [{ "subject": "", "sender": "", "reason": "" }],
  "urgent": [{ "task": "" }],
  "meetings": [{ "title": "", "time": "" }],
  "summary": [""]
}

Rules:
- overview.totalEmails = total emails analyzed.
- overview.summary = 2 concise sentences.
- important = maximum 5 emails.
- urgent = only urgent tasks.
- meetings = only meeting invitations.
- summary = 5-7 short bullet points.
- Return ONLY JSON. Do NOT wrap in markdown.

Emails:
${emails.join("\n")}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let summaryData: SummaryData;
    let warning: string | null = null;

    try {
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      summaryData = JSON.parse(cleaned);

      const requiredFields = ["overview", "important", "urgent", "meetings", "summary"];
      if (!requiredFields.every((f) => f in summaryData)) {
        throw new Error("Missing required fields in response");
      }
    } catch {
      console.error("Invalid JSON from Gemini. Raw response:", text);
      summaryData = {
        overview: { totalEmails: emails.length, summary: "AI response parsing failed. Please try again." },
        important: [],
        urgent: [],
        meetings: [],
        summary: ["Unable to generate summary. Please refresh and try again."],
      };
      warning = "Failed to parse AI response, using fallback data";
    }

    // Persist notification using singleton db client (fixes issue #9)
    try {
      await db.notification.create({
        data: { title: "Inbox summarized successfully", type: "ai", userEmail: session.user.email || "" },
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    return Response.json({ success: true, data: summaryData, warning });
  } catch (error: any) {
    console.error("Error in email analysis:", error);
    return Response.json({ success: false, error: error.message || "Failed to analyze emails" });
  }
}
