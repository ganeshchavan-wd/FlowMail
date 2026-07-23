import { askGemini } from "@/lib/gemini";

export async function GET() {
  const reply = await askGemini(
    "Say hello to Ganesh in one sentence."
  );

  return Response.json({
    reply,
  });
}