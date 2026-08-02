import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return Response.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });
const tokenInfo = await oauth2Client.getTokenInfo(session.accessToken);

console.log("Token Info:", tokenInfo);
    const event = await calendar.events.insert({
      calendarId: "primary",

      sendUpdates: "all",

      requestBody: {
        summary: body.title,

        description: body.description,

        start: {
          dateTime: new Date(body.start).toISOString(),
          timeZone: "Asia/Kolkata",
        },

        end: {
          dateTime: new Date(body.end).toISOString(),
          timeZone: "Asia/Kolkata",
        },

        attendees: body.attendees.map((email: string) => ({
          email,
        })),
      },
    });

    return Response.json({
      success: true,
      eventId: event.data.id,
      htmlLink: event.data.htmlLink,
    });
  } catch (error: any) {
    console.error("CALENDAR ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}