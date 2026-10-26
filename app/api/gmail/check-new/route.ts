
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Track checked Gmail message IDs separately for each user.
// Note: in-memory state resets when a server instance restarts.
const checkedEmailsByUser = new Map<string, Set<string>>();

export async function GET() {
  try {
    console.log("Email check API called");

    const session = await getServerSession(authOptions);

    if (!session?.accessToken || !session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email.toLowerCase();

    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      q: "is:inbox -is:spam",
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: "No emails found",
      });
    }

    const currentIds = messages
      .map((message) => message.id)
      .filter((id): id is string => Boolean(id));

    const previousIds = checkedEmailsByUser.get(userEmail);

    // First check for this user: record the current inbox IDs.
    // Do not create an "Email monitoring started!" notification.
    if (!previousIds) {
      checkedEmailsByUser.set(
        userEmail,
        new Set(currentIds)
      );

      console.log(`Initialized email checking for ${userEmail}`);

      return NextResponse.json({
        success: true,
        count: 0,
        message: "Email checking initialized",
      });
    }

    const newIds = currentIds.filter(
      (id) => !previousIds.has(id)
    );

    let createdCount = 0;

    for (const id of newIds) {
      try {
        const email = await gmail.users.messages.get({
          userId: "me",
          id,
          format: "metadata",
          metadataHeaders: ["Subject", "From"],
        });

        const headers = email.data.payload?.headers || [];

        const subject =
          headers.find(
            (header) =>
              header.name?.toLowerCase() === "subject"
          )?.value || "No Subject";

        const from =
          headers.find(
            (header) =>
              header.name?.toLowerCase() === "from"
          )?.value || "Unknown Sender";

        const nameMatch = from.match(/^"?(.+?)"?\s*</);
        const senderName = nameMatch
          ? nameMatch[1].trim()
          : from;

        // Store a notification for the newly detected email.
        await prisma.notification.create({
          data: {
            title: `📧 New email from ${senderName}: "${subject}"`,
            type: "mail",
            userEmail,
            isRead: false,
          },
        });

        createdCount++;

        console.log(
          `Created new-email notification for ${userEmail}`
        );
      } catch (error) {
        console.error(
          `Failed to process Gmail message ${id}:`,
          error
        );
      }
    }

    // Record the IDs we've seen so they aren't processed again
    // by this server instance.
    const updatedIds = new Set([
      ...previousIds,
      ...currentIds,
    ]);

    checkedEmailsByUser.set(userEmail, updatedIds);

    return NextResponse.json({
      success: true,
      count: createdCount,
      message:
        createdCount > 0
          ? `Found ${createdCount} new email(s)`
          : "No new emails",
    });
  } catch (error) {
    console.error("Email check failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check emails",
      },
      { status: 500 }
    );
  }
}
