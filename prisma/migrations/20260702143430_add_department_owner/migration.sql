/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Department_name_key";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_userId_key" ON "Department"("name", "userId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
