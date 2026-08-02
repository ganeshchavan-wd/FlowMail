import { askGemini } from "./gemini";

export async function extractMeeting(message: string) {
  const tomorrowDate = getTomorrowDate();

  const prompt = `
Extract meeting details from this message:

"${message}"

Return ONLY a valid JSON object with this exact structure:

{
  "title": "Meeting title",
  "departments": ["Department1", "Department2"],
  "attendees": ["email1@example.com", "email2@example.com"],
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "duration": 30
}

Rules:
- title: Extract the main purpose of the meeting. If not specified, use "Meeting".
- departments: Array of department names mentioned. If no departments, use [].
- attendees: Array of email addresses mentioned. If no emails, use [].
- date: Use YYYY-MM-DD format. If not specified, use tomorrow's date (${tomorrowDate}).
- time: Use HH:MM format (24-hour). If not specified, use "10:00".
- duration: Meeting duration in minutes. Default to 30 if not specified.

Important:
- departments should contain ONLY department names (not emails).
- attendees should contain ONLY email addresses (not department names).
- Extract ALL departments and emails mentioned in the message.

Return ONLY the JSON object. No additional text, explanation, or markdown code blocks.
`;

  // Fix issue #6: single variable so the catch block can log the real response
  let rawResponse = "";
  try {
    rawResponse = await askGemini(prompt);

    let cleaned = rawResponse.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/```json\s*/, "").replace(/```\s*$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/```\s*/, "").replace(/```\s*$/, "");
    }

    const parsed = JSON.parse(cleaned);

    return {
      title: parsed.title || "Meeting",
      departments: parsed.departments || [],
      attendees: parsed.attendees || [],
      date: parsed.date || tomorrowDate,
      time: parsed.time || "10:00",
      duration: parsed.duration || 30,
    };
  } catch (error) {
    console.error("Failed to parse meeting data:", error);
    console.error("Raw Gemini response:", rawResponse); // now actually logs the response

    return {
      title: "Meeting",
      departments: [],
      attendees: [],
      date: tomorrowDate,
      time: "10:00",
      duration: 30,
    };
  }
}

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}
