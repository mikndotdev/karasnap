-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "autoShareAttempts" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 25,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "profileHidden" BOOLEAN NOT NULL DEFAULT true;
