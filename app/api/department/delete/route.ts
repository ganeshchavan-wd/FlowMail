export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Find current user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const { departmentId } = await req.json();

    if (!departmentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Department ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // Verify the department belongs to this user
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        userId: user.id,
      },
    });

    if (!department) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found or access denied",
        },
        {
          status: 404,
        }
      );
    }

    // Store department name for notification
    const departmentName = department.name;

    // ✅ Create notification BEFORE deletion
    try {
      await prisma.notification.create({
        data: {
          title: `Department "${departmentName}" deleted`,
          type: "department",
          userEmail: session.user.email,
        },
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
      // Don't fail the request if notification fails
    }

    // Delete related records
    await prisma.departmentMember.deleteMany({
      where: {
        departmentId,
      },
    });

    await prisma.departmentDocument.deleteMany({
      where: {
        departmentId,
      },
    });

    await prisma.department.delete({
      where: {
        id: departmentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Department "${departmentName}" deleted successfully`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete department",
      },
      {
        status: 500,
      }
    );
  }
}