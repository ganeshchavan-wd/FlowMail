import { NextResponse } from "next/server";
import { createAppwriteServerClient } from "@/lib/appwrite/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const { client } = createAppwriteServerClient();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/users/${userId}`,
      {
        headers: {
          "X-Appwrite-Project":
            process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Appwrite user error:", error);

      return NextResponse.json(
        { error: "Unable to get Appwrite user" },
        { status: 500 }
      );
    }

    const appwriteUser = await response.json();

    const user = await db.user.upsert({
      where: {
        email: appwriteUser.email,
      },
      update: {
        name: appwriteUser.name || null,
      },
      create: {
        email: appwriteUser.email,
        name: appwriteUser.name || null,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Appwrite user sync error:", error);

    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}