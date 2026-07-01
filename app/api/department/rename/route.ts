export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { departmentId, name } = await req.json();

    if (!departmentId || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Department ID and name are required",
        },
        { status: 400 }
      );
    }

    // Check if another department already has this name
    const existing = await prisma.department.findFirst({
      where: {
        name,
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
        { status: 400 }
      );
    }

    const department = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Department renamed successfully",
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