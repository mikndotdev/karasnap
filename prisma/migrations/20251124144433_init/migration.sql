-- CreateEnum
CREATE TYPE "Manufacturer" AS ENUM ('DAM', 'JOYSOUND', 'OTHER');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('PREMIUM', 'FREE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "coverArt" TEXT,
    "spotifyId" TEXT,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "score" DECIMAL(65,30) NOT NULL,
    "bonus" DECIMAL(65,30),
    "manufacturer" "Manufacturer" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
