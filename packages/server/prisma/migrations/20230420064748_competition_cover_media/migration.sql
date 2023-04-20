-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "coverMediaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
