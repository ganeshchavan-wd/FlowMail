import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { google } from "googleapis";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Get session & tokens
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const accessToken = (session as any).accessToken;

    if (!accessToken) {
  return NextResponse.json(
    { error: "Access token missing" },
    { status: 401 }
  );
}

    // 2. Set up OAuth clients
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // 3. Gmail stats (all in parallel for speed)
    const [inboxRes, unreadRes, importantRes, starredRes] = await Promise.all([
      gmail.users.messages.list({ userId: "me", maxResults: 500 }),
      gmail.users.messages.list({ userId: "me", q: "is:unread" }),
      gmail.users.messages.list({ userId: "me", q: "is:important" }),
      gmail.users.messages.list({ userId: "me", q: "is:starred" }),
    ]);

    const emails = inboxRes.data.resultSizeEstimate || 0;
    const unread = unreadRes.data.resultSizeEstimate || 0;
    const important = importantRes.data.resultSizeEstimate || 0;
    const starred = starredRes.data.resultSizeEstimate || 0;

    const recentEmails = await Promise.all(
  (inboxRes.data.messages || []).slice(0, 5).map(async (message) => {
    const email = await gmail.users.messages.get({
      userId: "me",
      id: message.id!,
    });

    const headers = email.data.payload?.headers || [];

    return {
      from:
        headers.find((h) => h.name === "From")?.value || "Unknown",
      subject:
        headers.find((h) => h.name === "Subject")?.value || "No Subject",
      snippet: email.data.snippet || "",
    };
  })
);
    // 4. Calendar: today's meetings (from now until midnight)
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const meetingsRes = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: endOfDay.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    const todayMeetings = meetingsRes.data.items || [];
    const meetingsCount = todayMeetings.length;

    // 5. AI stats
    const aiActions = await prisma.aIActivity.count({
      where: { userEmail },
    });
    const hoursSaved = ((aiActions * 3) / 60).toFixed(1) + "h";

    // 6. Response (matches your existing frontend fields + extras)
   return NextResponse.json({
  emails,
  unread,
  important,
  starred,
  meetings: meetingsCount,
  todayMeetings,
  recentEmails,
  aiActions,
  hoursSaved,
});
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      {
        emails: 0,
        unread: 0,
        important: 0,
        starred: 0,
        meetings: 0,
        todayMeetings: [],
        aiActions: 0,
        hoursSaved: "0h",
      },
      { status: 500 }
    );
  }
}