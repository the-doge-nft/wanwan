-- CreateTable
CREATE TABLE "MemeLikes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL DEFAULT 0,
    "memeId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "MemeLikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemeLikes" ADD CONSTRAINT "MemeLikes_memeId_fkey" FOREIGN KEY ("memeId") REFERENCES "Meme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemeLikes" ADD CONSTRAINT "MemeLikes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
