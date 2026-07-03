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

    const { departmentId, email } = await req.json();

    if (!departmentId || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Department ID and email are required",
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

    // Check if email already exists
    const exists = await prisma.departmentMember.findFirst({
      where: {
        departmentId,
        email,
      },
    });

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.departmentMember.create({
      data: {
        departmentId,
        email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email added successfully",
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