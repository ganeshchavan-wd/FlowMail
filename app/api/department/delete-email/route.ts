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

    const { memberId } = await req.json();

    if (!memberId) {
      return NextResponse.json(
        {
          success: false,
          message: "Member ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // Find the member and its department
    const member = await prisma.departmentMember.findUnique({
      where: {
        id: memberId,
      },
      include: {
        department: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message: "Member not found",
        },
        {
          status: 404,
        }
      );
    }

    // Verify department belongs to logged-in user
    if (member.department.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        {
          status: 403,
        }
      );
    }

    // Delete member
    await prisma.departmentMember.delete({
      where: {
        id: memberId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete email",
      },
      {
        status: 500,
      }
    );
  }
}