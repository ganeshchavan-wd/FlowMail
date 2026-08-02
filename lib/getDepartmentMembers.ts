import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDepartmentMembers(
  departmentName: string
) {
  const department = await prisma.department.findFirst({
    where: {
      name: {
        equals: departmentName,
        mode: "insensitive",
      },
    },
    include: {
      members: true,
    },
  });

  if (!department) {
    throw new Error(`Department "${departmentName}" not found.`);
  }

  return department.members.map((member) => member.email);
}