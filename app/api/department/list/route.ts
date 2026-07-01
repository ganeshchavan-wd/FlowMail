import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        members: true,
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(departments);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Unable to load departments" },
      { status: 500 }
    );
  }
}