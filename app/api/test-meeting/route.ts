import { extractMeeting } from "@/lib/extractMeeting";

export async function GET() {
  const data = await extractMeeting(
    "Schedule a project review tomorrow at 4 PM with ganesh598243@gmail.com"
  );

  return Response.json(data);
}