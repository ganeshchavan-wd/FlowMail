import { askGemini } from "./gemini";

export async function extractMeeting(message: string) {
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
- date: Use YYYY-MM-DD format. If not specified, use tomorrow's date.
- time: Use HH:MM format (24-hour). If not specified, use "10:00".
- duration: Meeting duration in minutes. Default to 30 if not specified.

Important:
- departments should contain ONLY department names (not emails).
- attendees should contain ONLY email addresses (not department names).
- Extract ALL departments and emails mentioned in the message.

Examples:

Input: "Schedule meeting tomorrow at 4 PM with CSE Department and ganesh@gmail.com"
Output: {
  "title": "Meeting",
  "departments": ["CSE"],
  "attendees": ["ganesh@gmail.com"],
  "date": "2026-07-03",
  "time": "16:00",
  "duration": 30
}

Input: "Project review with Engineering and HR teams, invite john@company.com"
Output: {
  "title": "Project Review",
  "departments": ["Engineering", "HR"],
  "attendees": ["john@company.com"],
  "date": "2026-07-03",
  "time": "10:00",
  "duration": 30
}

Input: "Schedule meeting with Finance"
Output: {
  "title": "Meeting",
  "departments": ["Finance"],
  "attendees": [],
  "date": "2026-07-03",
  "time": "10:00",
  "duration": 30
}

Return ONLY the JSON object. No additional text or explanation.
`;

  try {
    const response = await askGemini(prompt);
    
    // Clean the response (remove markdown code blocks if present)
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, "").replace(/```\s*$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, "").replace(/```\s*$/, "");
    }
    
    const parsed = JSON.parse(cleanedResponse);
    
    // Ensure all required fields exist
    return {
      title: parsed.title || "Meeting",
      departments: parsed.departments || [],
      attendees: parsed.attendees || [],
      date: parsed.date || getTomorrowDate(),
      time: parsed.time || "10:00",
      duration: parsed.duration || 30,
    };
  } catch (error) {
    console.error("Failed to parse meeting data:", error);
    console.error("Raw response:", response);
    
    // Return defaults
    return {
      title: "Meeting",
      departments: [],
      attendees: [],
      date: getTomorrowDate(),
      time: "10:00",
      duration: 30,
    };
  }
}

// Helper function to get tomorrow's date in YYYY-MM-DD format
function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}