import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session: any = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json({
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

  try {
    const list = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = list.data.messages || [];

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
        });

        const headers = email.data.payload?.headers || [];

        const subject =
          headers.find((h) => h.name === "Subject")?.value || "";

        const from =
          headers.find((h) => h.name === "From")?.value || "";

        return {
          id: msg.id,
          subject,
          from,
          snippet: email.data.snippet,
        };
      })
    );

    return Response.json({
      success: true,
      emails,
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}