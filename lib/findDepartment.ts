import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findDepartment(
  userInput: string,
  userId: string
) {
  const departments = await prisma.department.findMany({
    where: {
      userId,
    },
    include: {
      members: true,
    },
  });

  const input = userInput.toLowerCase();

  const match = departments.find((department) =>
    input.includes(department.name.toLowerCase())
  );

  return match || null;
}