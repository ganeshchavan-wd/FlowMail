import { getServerSession } from "next-auth";
// ✅ Fix: Use the correct path with @/ alias
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    console.log(`📝 Marking all notifications as read for: ${session.user.email}`);

    // Update all unread notifications for this user
    const result = await prisma.notification.updateMany({
      where: {
        userEmail: session.user.email,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    console.log(`✅ Marked ${result.count} notifications as read`);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      count: result.count,
    });
  } catch (error) {
    console.error("❌ Error marking notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}