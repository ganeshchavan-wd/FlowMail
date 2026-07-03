import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.accessToken || !session?.user?.email) {
      return Response.json({
        success: false,
        error: "Not authenticated",
      });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.to || !body.subject || !body.message) {
      return Response.json({
        success: false,
        error: "Missing required fields: to, subject, message",
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

    // Create email with proper headers
    const email = [
      `To: ${body.to}`,
      `Subject: ${body.subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "",
      body.message,
    ].join("\n");

    const encodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send email
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    // ✅ Create notification for email sent
    try {
      await prisma.notification.create({
        data: {
          title: `Email sent to ${body.to}`,
          type: "mail",
          userEmail: session.user.email,
        },
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
      // Don't fail the request if notification fails
    }

    return Response.json({
      success: true,
      message: `Email sent to ${body.to}`,
    });
  } catch (error: any) {
    console.error("Send email error:", error);
    
    return Response.json({
      success: false,
      error: error.message || "Failed to send email",
    });
  }
}