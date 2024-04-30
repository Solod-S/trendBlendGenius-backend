-- CreateEnum
CREATE TYPE "Tones" AS ENUM ('Excited', 'Happy', 'Gracious', 'Supportive', 'Polite', 'Respectful', 'Provocative', 'Controversial', 'Disappointed', 'Sad', 'Frustrated', 'Sarcastic', 'Angry', 'Nasty');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "endWithQuestion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "useEmojis" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tone" "Tones";
