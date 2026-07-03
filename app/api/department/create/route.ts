export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Get logged in user
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

    // Find user in database
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

    const body = await req.json();

    const {
      name,
      emails,
      filename,
    }: {
      name: string;
      emails: string[];
      filename?: string;
    } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Department name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!emails || emails.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No emails found",
        },
        {
          status: 400,
        }
      );
    }

    // Check duplicate department ONLY for this user
    const existing = await prisma.department.findFirst({
      where: {
        name,
        userId: user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Department already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Create Department
    const department = await prisma.department.create({
      data: {
        name,
        userId: user.id,
      },
    });

    await prisma.notification.create({
  data: {
    title: `Department "${name}" created successfully`,
    type: "department",
    userEmail: session.user.email,
  },
});

    // Save Members
    await prisma.departmentMember.createMany({
      data: emails.map((email) => ({
        email,
        departmentId: department.id,
      })),
    });

    // Save Uploaded File
    if (filename) {
      await prisma.departmentDocument.create({
        data: {
          filename,
          departmentId: department.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Department created successfully",
      department,
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