import { askGemini } from "@/lib/gemini";
import { extractMeeting } from "@/lib/extractMeeting";
import { createMeeting } from "@/lib/createMeeting";
import { findDepartment } from "@/lib/findDepartment";
import { sendEmail } from "@/lib/sendEmail";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import { db } from "@/lib/db";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const isMeetingRequest =
      message.toLowerCase().includes("meeting") ||
      message.toLowerCase().includes("schedule") ||
      message.toLowerCase().includes("meet");

    if (isMeetingRequest) {
      const session: any = await getServerSession(authOptions);

      if (!session?.accessToken || !session?.user?.email) {
        return Response.json({
          reply: "❌ Google Calendar access not found. Please sign in again.",
        });
      }

      // Find logged-in user — use singleton db client (fixes issue #9)
      const user = await db.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return Response.json({ reply: "❌ User not found." });
      }

      const meeting = await extractMeeting(message);

      let attendees: string[] = [];
      const departmentsFound: string[] = [];

      if (meeting.attendees?.length) {
        attendees.push(...meeting.attendees);
      }

      if (meeting.departments?.length) {
        for (const deptName of meeting.departments) {
          const department = await findDepartment(deptName, user.id);

          if (!department) {
            console.warn(`Department '${deptName}' not found for this user.`);
            continue;
          }

          attendees.push(...department.members.map((member) => member.email));
          departmentsFound.push(department.name);
        }
      }

      // Remove duplicates and validate emails
      attendees = [...new Set(attendees)].filter((email) =>
        EMAIL_REGEX.test(email)
      );

      if (attendees.length === 0) {
        return Response.json({
          reply: "❌ Please provide a valid department or email address.",
        });
      }

      const departmentName =
        departmentsFound.length > 0
          ? departmentsFound.join(", ")
          : "Direct Invitation";

      const start = new Date(`${meeting.date}T${meeting.time}:00`);
      const end = new Date(
        start.getTime() + (meeting.duration || 30) * 60 * 1000
      );

      try {
        const event = await createMeeting(
          session.accessToken,
          meeting.title,
          "Created by FlowMail AI",
          start.toISOString(),
          end.toISOString(),
          attendees
        );

        // Persist notification using singleton db client (fixes issue #9)
        await db.notification.create({
          data: {
            title: `Meeting "${meeting.title}" scheduled`,
            type: "meeting",
            userEmail: session.user.email,
            isRead: false,
          },
        });

        // Send invite emails directly — no internal HTTP fetch (fixes issue #5)
        const meetLink =
          event.conferenceData?.entryPoints?.[0]?.uri ?? "N/A";

        await Promise.all(
          attendees.map((email) =>
            sendEmail(
              session.accessToken,
              email,
              `Meeting Invitation: ${meeting.title}`,
              `Hello,

You have been invited to a meeting.

Title: ${meeting.title}
Date: ${meeting.date}
Time: ${meeting.time}
Duration: ${meeting.duration || 30} minutes
Google Meet: ${meetLink}
Calendar Event: ${event.htmlLink}

Regards,
FlowMail AI`
            ).catch((err) =>
              // Log individual send failures but don't abort the whole flow
              console.error(`Failed to send invite to ${email}:`, err)
            )
          )
        );

        return Response.json({
          type: "meeting",
          meeting: {
            title: meeting.title,
            department: departmentName,
            departments: departmentsFound,
            date: meeting.date,
            time: meeting.time,
            duration: meeting.duration || 30,
            attendees,
            meetLink: event.conferenceData?.entryPoints?.[0]?.uri ?? "",
            calendarLink: event.htmlLink,
          },
        });
      } catch (err: any) {
        console.error(err);
        return Response.json({
          reply: `❌ Calendar Error\n\n${JSON.stringify(
            err?.response?.data || err?.message,
            null,
            2
          )}`,
        });
      }
    }

    // Normal Gemini chat
    const reply = await askGemini(message);

    const session: any = await getServerSession(authOptions);

    // Persist notification using singleton db client (fixes issue #9)
    await db.notification.create({
      data: {
        title: "AI Assistant responded to your query",
        type: "ai",
        userEmail: session?.user?.email || "",
      },
    });

    return Response.json({ reply });
  } catch (error: any) {
    console.error(error);
    return Response.json({
      reply: `❌ Error\n\n${error.message}`,
    });
  }
}
