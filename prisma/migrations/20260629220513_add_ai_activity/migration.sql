-- CreateTable
CREATE TABLE "AIActivity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIActivity_pkey" PRIMARY KEY ("id")
);
