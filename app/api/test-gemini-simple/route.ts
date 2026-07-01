import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result =
      await model.generateContent("Say hello");

    return Response.json({
      success: true,
      text: result.response.text(),
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}