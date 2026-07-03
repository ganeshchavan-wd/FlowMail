import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Store last checked email IDs
let lastCheckedEmailIds: string[] = [];
let lastCheckTime: Date = new Date();

export async function GET() {
  try {
    console.log("📧 Email check API called");
    
    const session: any = await getServerSession(authOptions);

    if (!session?.accessToken || !session?.user?.email) {
      console.log("❌ Unauthorized");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log(`✅ User: ${session.user.email}`);

    // Setup Gmail client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    // Get latest emails
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      q: "is:inbox -is:spam",
    });

    const messages = response.data.messages || [];
    console.log(`📥 Found ${messages.length} emails`);

    if (messages.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: "No emails found",
      });
    }

    const currentIds = messages.map(msg => msg.id!).filter(id => id !== undefined);

    // First check - store initial IDs
    if (lastCheckedEmailIds.length === 0) {
      lastCheckedEmailIds = currentIds;
      lastCheckTime = new Date();
      
      await prisma.notification.create({
        data: {
          title: "📧 Email monitoring started!",
          type: "mail",
          userEmail: session.user.email,
          isRead: false,
        },
      });
      
      return NextResponse.json({
        success: true,
        count: 0,
        message: "Monitoring started!",
      });
    }

    // Find new emails
    const newIds = currentIds.filter(id => !lastCheckedEmailIds.includes(id));
    console.log(`🆕 Found ${newIds.length} new email(s)`);

    let createdCount = 0;

    if (newIds.length > 0) {
      for (const id of newIds) {
        try {
          const email = await gmail.users.messages.get({
            userId: "me",
            id: id,
          });

          const headers = email.data.payload?.headers || [];
          const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject";
          const from = headers.find((h) => h.name === "From")?.value || "Unknown";
          
          let senderName = from;
          const nameMatch = from.match(/^"?(.+?)"?\s*</);
          if (nameMatch) {
            senderName = nameMatch[1].trim();
          }

          await prisma.notification.create({
            data: {
              title: `📧 New email from ${senderName}: "${subject}"`,
              type: "mail",
              userEmail: session.user.email,
              isRead: false,
            },
          });
          
          createdCount++;
          console.log(`✅ Created notification for: ${subject}`);
        } catch (error) {
          console.error(`❌ Error fetching email:`, error);
        }
      }

      lastCheckedEmailIds = currentIds;
      lastCheckTime = new Date();
    }

    return NextResponse.json({
      success: true,
      count: createdCount,
      message: createdCount > 0 ? `Found ${createdCount} new email(s)` : "No new emails",
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check emails" },
      { status: 500 }
    );
  }
}