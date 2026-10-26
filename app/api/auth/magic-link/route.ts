import { NextResponse } from "next/server";
import { Client, Account, ID } from "node-appwrite";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const account = new Account(client);

    await account.createMagicURLToken({
      userId: ID.unique(),
      email,
      url: "http://localhost:3000/auth/verify",
    });

    return NextResponse.json({
      success: true,
      message: "Magic link sent successfully",
    });
  } catch (error: any) {
    console.error("Magic URL Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to send magic link",
      },
      { status: 500 }
    );
  }
}