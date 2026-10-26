import { createAppwriteHandlers } from "@appwrite.io/react/handlers/next";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

function createHandlers() {
  if (!endpoint || !projectId || !apiKey) {
    throw new Error(
      "Appwrite configuration is incomplete. Check the required Vercel environment variables."
    );
  }

  return createAppwriteHandlers({
    endpoint,
    projectId,
    apiKey,
    basePath: "/api/appwrite",
  });
}

export const { GET, POST } = createHandlers();
