-- AlterTable
ALTER TABLE "users" ALTER COLUMN "newsCategory" SET NOT NULL,
ALTER COLUMN "newsCategory" SET DATA TYPE "NewsCategories",
ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "language" SET DATA TYPE "Languages",
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "country" SET DATA TYPE "Countries";
