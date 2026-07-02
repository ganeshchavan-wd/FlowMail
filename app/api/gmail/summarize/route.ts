import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session: any = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json({
      success: false,
      error: "Not authenticated",
    });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const list = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = list.data.messages || [];

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
        });

        const headers = email.data.payload?.headers || [];

        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";

        return `
From: ${from}
Subject: ${subject}
Snippet: ${email.data.snippet}
`;
      })
    );

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are FlowMail AI.

Analyze the following emails.

Return ONLY valid JSON.

The JSON MUST follow this structure exactly:

{
  "overview": {
    "totalEmails": 0,
    "summary": ""
  },

  "important": [
    {
      "subject": "",
      "sender": "",
      "reason": ""
    }
  ],

  "urgent": [
    {
      "task": ""
    }
  ],

  "meetings": [
    {
      "title": "",
      "time": ""
    }
  ],

  "summary": [
    ""
  ]
}

Rules:

- overview.totalEmails = total emails analyzed.
- overview.summary = 2 concise sentences.
- important = maximum 5 emails.
- urgent = only urgent tasks.
- meetings = only meeting invitations.
- summary = 5-7 short bullet points.
- Return ONLY JSON.
- Do NOT wrap JSON in markdown.

Emails:

${emails.join("\n")}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean and parse JSON
    try {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const summary = JSON.parse(cleaned);

      return Response.json({
        success: true,
        data: summary,
      });
    } catch (parseError) {
      console.error("Invalid JSON from Gemini");
      console.error("Raw response:", text);
      
      // Return a fallback structure if parsing fails
      return Response.json({
        success: true,
        data: {
          overview: {
            totalEmails: emails.length,
            summary: "Unable to parse AI response. Please try again.",
          },
          important: [],
          urgent: [],
          meetings: [],
          summary: ["Error processing emails. Please refresh and try again."],
        },
        warning: "Failed to parse AI response, using fallback data",
      });
    }
  } catch (error: any) {
    console.error("Error in email analysis:", error);
    
    return Response.json({
      success: false,
      error: error.message || "Failed to analyze emails",
    });
  }
}