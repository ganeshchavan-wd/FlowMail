import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      maxResults: 15,
    });

    const messages = list.data.messages || [];

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
        });

        const headers = email.data.payload?.headers || [];

        return {
          from:
            headers.find((h) => h.name === "From")?.value || "",
          subject:
            headers.find((h) => h.name === "Subject")?.value || "",
          snippet: email.data.snippet || "",
        };
      })
    );

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Categorize these emails into:

🔥 Urgent
⭐ Important
💼 Jobs
📅 Meetings
📢 Promotions
👥 Social

Return clean markdown.

Emails:

${JSON.stringify(emails, null, 2)}
`;

    const result = await model.generateContent(prompt);
  if (session?.user?.email) {
  await prisma.aIActivity.create({
    data: {
      type: "CHAT",
      userEmail: session.user.email,
    },
  });
}
    return Response.json({
      success: true,
      categories: result.response.text(),
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}