import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function detectIntent(message: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(`
You are FlowMail AI.

Classify the user's request.

Possible intents:

meeting
email
question
other

Return ONLY JSON.

Example:

{
 "intent":"meeting"
}

User:

${message}
`);

  const text = result.response.text();

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}