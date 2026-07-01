import { askGemini } from "@/lib/gemini";
import { extractMeeting } from "@/lib/extractMeeting";
import { createMeeting } from "@/lib/createMeeting";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { findDepartment } from "@/lib/findDepartment";

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

      console.log("========== CHAT DEBUG ==========");
      console.log("SESSION:", session);
      console.log("ACCESS TOKEN EXISTS:", !!session?.accessToken);
      console.log("ACCESS TOKEN:", session?.accessToken?.substring(0, 20));
      console.log("===============================");

      if (!session?.accessToken) {
        return Response.json({
          reply: "❌ Google Calendar access not found. Please sign in again.",
        });
      }

      const meeting = await extractMeeting(message);

      let attendees: string[] = [];
      const departmentsFound: string[] = [];

      // Add direct email attendees
      if (meeting.attendees?.length) {
        attendees.push(...meeting.attendees);
        console.log(`✅ Added ${meeting.attendees.length} direct email(s)`);
      }

      // Add department members
      if (meeting.departments?.length) {
        console.log(`📋 Processing ${meeting.departments.length} department(s):`, meeting.departments);
        
        for (const deptName of meeting.departments) {
          const department = await findDepartment(deptName);
          
          if (!department) {
            console.warn(`⚠️ Department '${deptName}' not found. Skipping.`);
            continue;
          }
          
          const members = department.members.map((member) => member.email);
          attendees.push(...members);
          departmentsFound.push(department.name);
          console.log(`✅ Added ${members.length} members from ${department.name}`);
        }
      }

      // Remove duplicate emails
      attendees = [...new Set(attendees)];

      // Validate and filter email addresses
      const invalidEmails: string[] = [];
      attendees = attendees.filter((email) => {
        const isValid = EMAIL_REGEX.test(email);
        if (!isValid) {
          invalidEmails.push(email);
        }
        return isValid;
      });

      if (invalidEmails.length > 0) {
        console.warn(`⚠️ Invalid email addresses skipped: ${invalidEmails.join(", ")}`);
      }

      // No attendees found
      if (attendees.length === 0) {
        let errorMessage = "❌ No valid attendees found. Please provide:\n";
        errorMessage += "• A department name, or\n";
        errorMessage += "• At least one valid email address";
        
        return Response.json({
          reply: errorMessage,
        });
      }

      // Generate department name for display
      const departmentName = departmentsFound.length > 0 
        ? departmentsFound.join(", ")
        : "Direct Invitation";

      console.log("✅ Final attendees:", attendees);
      console.log("📊 Meeting data:", meeting);

      const start = new Date(`${meeting.date}T${meeting.time}:00`);
      const end = new Date(start.getTime() + (meeting.duration || 30) * 60 * 1000);

      console.log("📅 Start:", start.toISOString());
      console.log("📅 End:", end.toISOString());

      try {
        const event = await createMeeting(
          session.accessToken,
          meeting.title,
          "Created by FlowMail AI",
          start.toISOString(),
          end.toISOString(),
          attendees
        );

        // Send email invitations
        await Promise.all(
          attendees.map(async (email: string) => {
            await fetch(`${process.env.NEXTAUTH_URL}/api/gmail/send`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: request.headers.get("cookie") || "",
              },
              body: JSON.stringify({
                to: email,
                subject: `Meeting Invitation: ${meeting.title}`,
                message: `
Hello,

You have been invited to a meeting.

Title: ${meeting.title}
Date: ${meeting.date}
Time: ${meeting.time}
Duration: ${meeting.duration || 30} minutes

Google Meet:
${event.conferenceData?.entryPoints?.[0]?.uri || "N/A"}

Calendar Event:
${event.htmlLink}

Regards,
FlowMail AI
`,
              }),
            });
          })
        );

        console.log("✅ Event created:", event.htmlLink);

        return Response.json({
          type: "meeting",
          meeting: {
            title: meeting.title,
            department: departmentName,
            departments: departmentsFound,
            date: meeting.date,
            time: meeting.time,
            duration: meeting.duration || 30,
            attendees: attendees,
            meetLink: event.conferenceData?.entryPoints?.[0]?.uri ?? "",
            calendarLink: event.htmlLink,
          },
        });
      } catch (err: any) {
        console.error("❌ CREATE MEETING ERROR:", err);
        console.error("❌ GOOGLE RESPONSE:", err?.response?.data);

        return Response.json({
          reply: `❌ Calendar Error\n\n${JSON.stringify(
            err?.response?.data || err?.message,
            null,
            2
          )}`,
        });
      }
    }

    // If not a meeting request, use Gemini
    const reply = await askGemini(message);

    return Response.json({
      reply,
    });
  } catch (error: any) {
    console.error("❌ CHAT ERROR:", error);

    return Response.json({
      reply: `❌ Error\n\n${error.message}`,
    });
  }
}