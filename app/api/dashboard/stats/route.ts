import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return Response.json({ success: false, error: "Not authenticated" });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Fire all Gmail list queries in parallel for speed
    const [totalEmails, unreadEmails, importantEmails, starredEmails, recentList] =
      await Promise.all([
        gmail.users.messages.list({ userId: "me", maxResults: 500 }),
        gmail.users.messages.list({ userId: "me", q: "is:unread", maxResults: 500 }),
        gmail.users.messages.list({ userId: "me", q: "is:important", maxResults: 500 }),
        gmail.users.messages.list({ userId: "me", q: "is:starred", maxResults: 500 }),
        gmail.users.messages.list({ userId: "me", maxResults: 5 }),
      ]);

    // Today's calendar events
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [events, aiActions] = await Promise.all([
      calendar.events.list({
        calendarId: "primary",
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: "startTime",
      }),
      // Use singleton db client (fixes issue #9)
      db.aIActivity.count({
        where: {
          userEmail: session.user.email,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    const hoursSaved = `${Math.floor(aiActions * 0.5)}h`;

    // Fetch recent email details in parallel
    const recentEmailData: Array<{ from: string; subject: string; snippet: string }> = [];
    if (recentList.data.messages) {
      const details = await Promise.all(
        recentList.data.messages.slice(0, 5).map((msg) =>
          gmail.users.messages.get({ userId: "me", id: msg.id! }).catch(() => null)
        )
      );
      for (const email of details) {
        if (!email) continue;
        const headers = email.data.payload?.headers || [];
        recentEmailData.push({
          from: headers.find((h) => h.name === "From")?.value || "",
          subject: headers.find((h) => h.name === "Subject")?.value || "",
          snippet: email.data.snippet || "",
        });
      }
    }

    return Response.json({
      success: true,
      emails: totalEmails.data.resultSizeEstimate || 0,
      unread: unreadEmails.data.resultSizeEstimate || 0,
      important: importantEmails.data.resultSizeEstimate || 0,
      starred: starredEmails.data.resultSizeEstimate || 0,
      meetings: events.data.items?.length || 0,
      aiActions,
      hoursSaved,
      recentEmails: recentEmailData,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return Response.json({
      success: false,
      error: error.message || "Failed to fetch dashboard stats",
    });
  }
}
