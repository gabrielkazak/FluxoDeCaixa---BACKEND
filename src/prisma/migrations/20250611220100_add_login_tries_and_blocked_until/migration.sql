-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockedUntil" TIMESTAMP(3),
ADD COLUMN     "loginTries" INTEGER NOT NULL DEFAULT 0;
