import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";

interface CategoryData {
  urgent: Array<{ subject: string; sender: string; reason: string }>;
  important: Array<{ subject: string; sender: string }>;
  jobs: Array<{ subject: string; company: string }>;
  meetings: Array<{ subject: string; time: string }>;
  promotions: Array<{ subject: string }>;
  social: Array<{ subject: string }>;
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

    const list = await gmail.users.messages.list({ userId: "me", maxResults: 15 });
    const messages = list.data.messages || [];

    if (messages.length === 0) {
      return Response.json({
        success: true,
        data: { urgent: [], important: [], jobs: [], meetings: [], promotions: [], social: [] },
      });
    }

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({ userId: "me", id: msg.id! });
        const headers = email.data.payload?.headers || [];
        return {
          from: headers.find((h) => h.name === "From")?.value || "",
          subject: headers.find((h) => h.name === "Subject")?.value || "",
          snippet: email.data.snippet || "",
        };
      })
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are FlowMail AI. Analyze these emails and return ONLY valid JSON.

Use EXACTLY this structure:
{
  "urgent": [{ "subject": "", "sender": "", "reason": "" }],
  "important": [{ "subject": "", "sender": "" }],
  "jobs": [{ "subject": "", "company": "" }],
  "meetings": [{ "subject": "", "time": "" }],
  "promotions": [{ "subject": "" }],
  "social": [{ "subject": "" }]
}

Rules:
- Return ONLY JSON. Never return markdown. Never explain anything.
- Put every email into the most appropriate category.
- Leave arrays empty if there are no matching emails.

Emails:
${JSON.stringify(emails, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Log AI activity using singleton db client (fixes issue #9)
    if (session?.user?.email) {
      await db.aIActivity.create({ data: { type: "CHAT", userEmail: session.user.email } });
    }

    let categoryData: CategoryData;
    let warning: string | null = null;

    try {
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      categoryData = JSON.parse(cleaned);

      const requiredFields = ["urgent", "important", "jobs", "meetings", "promotions", "social"];
      if (!requiredFields.every((f) => f in categoryData)) {
        throw new Error("Missing required fields in response");
      }
    } catch {
      console.error("Invalid JSON from Gemini. Raw response:", text);
      categoryData = { urgent: [], important: [], jobs: [], meetings: [], promotions: [], social: [] };
      warning = "Failed to parse AI response, using fallback data";
    }

    // Persist notification using singleton db client (fixes issue #9)
    try {
      await db.notification.create({
        data: { title: "Emails categorized successfully", type: "ai", userEmail: session.user.email || "" },
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    return Response.json({ success: true, data: categoryData, warning });
  } catch (error: any) {
    console.error("Error in taxonomy categorization:", error);
    return Response.json({ success: false, error: error.message || "Failed to categorize emails" });
  }
}
