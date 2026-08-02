export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use singleton db client (fixes issue #9)
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, emails, filename }: { name: string; emails: string[]; filename?: string } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Department name is required" },
        { status: 400 }
      );
    }

    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { success: false, message: "No emails found" },
        { status: 400 }
      );
    }

    const existing = await db.department.findFirst({
      where: { name, userId: user.id },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Department already exists" },
        { status: 400 }
      );
    }

    const department = await db.department.create({
      data: { name, userId: user.id },
    });

    await db.notification.create({
      data: {
        title: `Department "${name}" created successfully`,
        type: "department",
        userEmail: session.user.email,
      },
    });

    await db.departmentMember.createMany({
      data: emails.map((email) => ({ email, departmentId: department.id })),
    });

    if (filename) {
      await db.departmentDocument.create({
        data: { filename, departmentId: department.id },
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
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
