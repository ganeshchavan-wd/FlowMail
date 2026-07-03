export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Get logged-in user
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

    const { departmentId, name } = await req.json();

    if (!departmentId || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Department ID and name are required",
        },
        {
          status: 400,
        }
      );
    }

    // Verify department belongs to current user
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

    // Check duplicate name ONLY for this user
    const existing = await prisma.department.findFirst({
      where: {
        name,
        userId: user.id,
        NOT: {
          id: departmentId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Department name already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Store the old name for notification
    const oldName = department.name;

    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        name,
      },
    });

    // ✅ Create notification for department rename
    try {
      await prisma.notification.create({
        data: {
          title: `Department renamed from "${oldName}" to "${name}"`,
          type: "department",
          userEmail: session.user.email,
        },
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      message: "Department renamed successfully",
      department: updatedDepartment,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}