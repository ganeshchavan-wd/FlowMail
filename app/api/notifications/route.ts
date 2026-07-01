import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({
        notifications: [],
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

    // Gmail
    const unread = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
    });

    const important = await gmail.users.messages.list({
      userId: "me",
      q: "is:important",
    });

    // Calendar
    const meetings = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime",
    });

    // AI Activity
    const aiActions = await prisma.aIActivity.count({
      where: {
        userEmail: session.user.email,
      },
    });

    const notifications = [];

    if ((unread.data.resultSizeEstimate || 0) > 0) {
      notifications.push({
        title: `${unread.data.resultSizeEstimate} unread emails`,
        type: "mail",
      });
    }

    if ((important.data.resultSizeEstimate || 0) > 0) {
      notifications.push({
        title: `${important.data.resultSizeEstimate} important emails`,
        type: "important",
      });
    }

    if ((meetings.data.items?.length || 0) > 0) {
      notifications.push({
        title: `${meetings.data.items?.length} upcoming meetings`,
        type: "meeting",
      });
    }

    if (aiActions > 0) {
      notifications.push({
        title: `${aiActions} AI actions completed`,
        type: "ai",
      });
    }

    return NextResponse.json({
      notifications,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      notifications: [],
    });
  }
}