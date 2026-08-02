import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";

export async function GET() {
  try {
    const session: any =
      await getServerSession(authOptions);

    const oauth2Client =
      new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const event = await calendar.events.insert({
      calendarId: "primary",

      requestBody: {
        summary: "FlowMail Test Meeting",

        start: {
          dateTime: new Date(
            Date.now() + 60 * 60 * 1000
          ).toISOString(),
        },

        end: {
          dateTime: new Date(
            Date.now() + 2 * 60 * 60 * 1000
          ).toISOString(),
        },
      },
    });

    return Response.json({
      success: true,
      event: event.data,
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
      details: error,
    });
  }
}