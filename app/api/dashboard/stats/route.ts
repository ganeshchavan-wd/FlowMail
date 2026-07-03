import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return Response.json({
        success: false,
        error: "Not authenticated",
      });
    }

    const oauth2Client = new google.auth.OAuth2();
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

    // Get total emails - using resultSizeEstimate or messages count
    const totalEmails = await gmail.users.messages.list({
      userId: "me",
      maxResults: 500, // Gmail API max is 500 per request
    });

    // Get unread emails
    const unreadEmails = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: 500,
    });

    // Get important emails
    const importantEmails = await gmail.users.messages.list({
      userId: "me",
      q: "is:important",
      maxResults: 500,
    });

    // Get starred emails
    const starredEmails = await gmail.users.messages.list({
      userId: "me",
      q: "is:starred",
      maxResults: 500,
    });

    // Get today's meetings from calendar
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    // Get AI actions from database
    const aiActions = await prisma.aIActivity.count({
      where: {
        userEmail: session.user.email,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    });

    // Calculate hours saved (estimate based on AI actions)
    const hoursSaved = `${Math.floor(aiActions * 0.5)}h`;

    // Get recent emails for activity feed
    const recentEmails = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5,
    });

    const recentEmailData = [];
    if (recentEmails.data.messages) {
      for (const msg of recentEmails.data.messages.slice(0, 5)) {
        try {
          const email = await gmail.users.messages.get({
            userId: "me",
            id: msg.id!,
          });
          const headers = email.data.payload?.headers || [];
          const subject = headers.find((h) => h.name === "Subject")?.value || "";
          const from = headers.find((h) => h.name === "From")?.value || "";
          
          recentEmailData.push({
            from: from,
            subject: subject,
            snippet: email.data.snippet || "",
          });
        } catch (e) {
          console.error("Error fetching email details:", e);
        }
      }
    }

    // Get actual counts from the response
    const totalCount = totalEmails.data.resultSizeEstimate || 0;
    const unreadCount = unreadEmails.data.resultSizeEstimate || 0;
    const importantCount = importantEmails.data.resultSizeEstimate || 0;
    const starredCount = starredEmails.data.resultSizeEstimate || 0;
    const meetingsToday = events.data.items?.length || 0;

    return Response.json({
      success: true,
      emails: totalCount,
      unread: unreadCount,
      important: importantCount,
      starred: starredCount,
      meetings: meetingsToday,
      aiActions: aiActions,
      hoursSaved: hoursSaved,
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