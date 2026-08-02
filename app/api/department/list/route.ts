import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get logged-in user
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
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
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Load ONLY this user's departments
    const departments = await prisma.department.findMany({
      where: {
        userId: user.id,
      },
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