-- CreateEnum
CREATE TYPE "RatingSystem" AS ENUM ('DAM_AI_HEART', 'DAM_AI', 'DAM_DXG', 'JOYSOUND_MASTER', 'JOYSOUND_AI', 'OTHER');

-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "ratingSystem" "RatingSystem" NOT NULL DEFAULT 'OTHER';
