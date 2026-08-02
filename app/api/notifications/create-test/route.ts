import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create test notifications
    const testNotifications = [
      {
        title: "🎉 Welcome to FlowMail AI!",
        type: "ai",
        userEmail: session.user.email,
        isRead: false,
      },
      {
        title: "📧 You have 3 unread emails",
        type: "mail",
        userEmail: session.user.email,
        isRead: false,
      },
      {
        title: "🤖 AI summarized your inbox",
        type: "ai",
        userEmail: session.user.email,
        isRead: false,
      },
      {
        title: "📅 Meeting scheduled: Design Review",
        type: "meeting",
        userEmail: session.user.email,
        isRead: false,
      },
      {
        title: "🏢 Department 'Engineering' created",
        type: "department",
        userEmail: session.user.email,
        isRead: false,
      },
    ];

    // Delete existing notifications for this user (optional)
    await prisma.notification.deleteMany({
      where: {
        userEmail: session.user.email,
      },
    });

    // Create new notifications
    const created = await prisma.notification.createMany({
      data: testNotifications,
    });

    return NextResponse.json({
      success: true,
      message: `Created ${created.count} test notifications`,
      count: created.count,
      notifications: testNotifications,
    });
  } catch (error) {
    console.error("Error creating test notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create test notifications", details: String(error) },
      { status: 500 }
    );
  }
}