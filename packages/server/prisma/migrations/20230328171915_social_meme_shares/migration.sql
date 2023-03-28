-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('Twitter', 'Reddit');

-- CreateTable
CREATE TABLE "SocialMemeShares" (
    "id" SERIAL NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "memeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialMemeShares_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialMemeShares" ADD CONSTRAINT "SocialMemeShares_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
