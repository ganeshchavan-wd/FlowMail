export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { departmentId, email } = await req.json();

    if (!departmentId || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Department ID and email are required",
        },
        { status: 400 }
      );
    }

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
        { status: 400 }
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