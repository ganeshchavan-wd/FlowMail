import { google } from "googleapis";

export async function createMeeting(
  accessToken: string,
  title: string,
  description: string,
  start: string,
  end: string,
  attendees: string[]
) {
  const oauth2Client = new google.auth.OAuth2();

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const event = await calendar.events.insert({
    calendarId: "primary",

    sendUpdates: "all",

    conferenceDataVersion: 1,

    requestBody: {
      summary: title,

      description,

      start: {
        dateTime: start,
        timeZone: "Asia/Kolkata",
      },

      end: {
        dateTime: end,
        timeZone: "Asia/Kolkata",
      },

      attendees: attendees.map((email) => ({
        email,
      })),

      conferenceData: {
        createRequest: {
          requestId: Date.now().toString(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  return event.data;
}