export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { departmentId } = await req.json();

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