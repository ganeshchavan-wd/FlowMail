import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";

export async function GET() {
  try {
    const session: any =
      await getServerSession(authOptions);

    if (!session?.accessToken) {
      return Response.json({
        success: false,
        error: "No access token",
      });
    }

    const oauth2Client =
      new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const result =
      await calendar.calendarList.list();

    return Response.json({
      success: true,
      calendars: result.data.items,
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}