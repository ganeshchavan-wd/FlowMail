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
      });
    }

    const oauth2Client =
      new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

   // Total Emails
const totalEmails = await gmail.users.messages.list({
  userId: "me",
});

// Unread Emails
const unreadEmails = await gmail.users.messages.list({
  userId: "me",
  q: "is:unread",
});

// Important Emails
const importantEmails = await gmail.users.messages.list({
  userId: "me",
  q: "is:important",
});

// Starred Emails
const starredEmails = await gmail.users.messages.list({
  userId: "me",
  q: "is:starred",
});

    const events =
      await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: "startTime",
      });

   return Response.json({
  success: true,

  emails:
    totalEmails.data.resultSizeEstimate || 0,

  unread:
    unreadEmails.data.resultSizeEstimate || 0,

  important:
    importantEmails.data.resultSizeEstimate || 0,

  starred:
    starredEmails.data.resultSizeEstimate || 0,

  meetings:
    events.data.items?.length || 0,
});
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}