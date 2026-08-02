import { db } from "@/lib/db";

// Uses the singleton db client instead of a new PrismaClient() (fixes issue #9)
export async function findDepartment(userInput: string, userId: string) {
  const departments = await db.department.findMany({
    where: { userId },
    include: { members: true },
  });

  const input = userInput.toLowerCase();

  const match = departments.find((department) =>
    input.includes(department.name.toLowerCase())
  );

  return match || null;
}
