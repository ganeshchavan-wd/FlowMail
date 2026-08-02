import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/sendEmail";
import { db } from "@/lib/db";

// Email validation regex (fixes issue #3 — no recipient validation)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 50_000;

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.accessToken || !session?.user?.email) {
      return Response.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.to || !body.subject || !body.message) {
      return Response.json(
        { success: false, error: "Missing required fields: to, subject, message" },
        { status: 400 }
      );
    }

    // Validate recipient email format (fixes issue #3)
    if (!EMAIL_REGEX.test(body.to)) {
      return Response.json(
        { success: false, error: "Invalid recipient email address" },
        { status: 400 }
      );
    }

    // Validate field lengths to prevent oversized payloads
    if (body.subject.length > MAX_SUBJECT_LENGTH) {
      return Response.json(
        { success: false, error: `Subject must be ${MAX_SUBJECT_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }
    if (body.message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { success: false, error: "Message is too long" },
        { status: 400 }
      );
    }

    // Send email using shared utility (fixes issue #5 — no more internal fetch)
    await sendEmail(session.accessToken, body.to, body.subject, body.message);

    // Create notification using singleton db client (fixes issue #9)
    try {
      await db.notification.create({
        data: {
          title: `Email sent to ${body.to}`,
          type: "mail",
          userEmail: session.user.email,
        },
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    return Response.json({
      success: true,
      message: `Email sent to ${body.to}`,
    });
  } catch (error: any) {
    console.error("Send email error:", error);
    return Response.json(
      { success: false, error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
