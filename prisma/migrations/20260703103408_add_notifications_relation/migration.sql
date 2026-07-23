/*
  Warnings:

  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "color" TEXT NOT NULL DEFAULT 'indigo';

-- AlterTable
ALTER TABLE "DepartmentDocument" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "DepartmentMember" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
