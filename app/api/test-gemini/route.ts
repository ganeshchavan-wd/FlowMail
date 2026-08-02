import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";

export async function GET() {
  const session: any = await getServerSession();

  if (!session?.accessToken) {
    return Response.json({
      success: false,
      error: "Not authenticated",
    });
  }

  const gmailResponse = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const gmailData = await gmailResponse.json();

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(
    `Summarize these Gmail messages:

${JSON.stringify(gmailData, null, 2)}
`
  );

  return Response.json({
    success: true,
    summary: result.response.text(),
  });
}