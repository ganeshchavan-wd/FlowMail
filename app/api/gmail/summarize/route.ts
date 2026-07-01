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

    const subject =
      headers.find((h) => h.name === "Subject")?.value || "";

    const from =
      headers.find((h) => h.name === "From")?.value || "";

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


You are an AI email assistant.

Analyze these emails and provide:

1. A short overview
2. Important emails
3. Action items
4. Urgent items
5. Bullet point summary

Emails:

${emails.join("\n")}
`;

const result = await model.generateContent(prompt);

const summary = result.response.text();

return Response.json({
  success: true,
  summary,
});

} catch (error: any) {
console.error(error);


return Response.json({
  success: false,
  error: error.message,
});
}
}
