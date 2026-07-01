import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
Extract meeting information.

Return ONLY valid JSON.

Example:

{
  "title":"Project Review",
  "date":"2026-06-20",
  "time":"16:00",
  "duration":30,
  "attendees":["john@gmail.com"]
}

User Request:
${prompt}
`);

    const text = result.response.text();

    return Response.json({
      success: true,
      extracted: text,
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}