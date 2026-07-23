export async function GET() {
  const response = await fetch(
    "http://localhost:3000/api/calendar/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: "FlowMail Demo Meeting",

        description:
          "This meeting was created by FlowMail.",

        start: "2026-07-20T10:00:00+05:30",

        end: "2026-07-20T11:00:00+05:30",

        attendees: [
          "ganesh598243@gmail.com",
        ],
      }),
    }
  );

  return Response.json(await response.json());
}