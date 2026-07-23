export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
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

    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Department id is required",
        },
        {
          status: 400,
        }
      );
    }

    // Load ONLY the logged-in user's department
    const department = await prisma.department.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        members: true,
        documents: true,
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

    return NextResponse.json({
      success: true,
      department,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}