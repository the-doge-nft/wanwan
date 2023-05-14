/*
  Warnings:

  - A unique constraint covering the columns `[createdById,memeId]` on the table `MemeLikes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MemeLikes_createdById_memeId_key" ON "MemeLikes"("createdById", "memeId");
