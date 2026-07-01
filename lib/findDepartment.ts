import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findDepartment(userInput: string) {
  const departments = await prisma.department.findMany({
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