-- AlterEnum
ALTER TYPE "TokenType" ADD VALUE 'ETH';

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "coverMediaId" INTEGER;

-- AlterTable
ALTER TABLE "Currency" ALTER COLUMN "contractAddress" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CompetitionVotingRule" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "competitionId" INTEGER NOT NULL,
    "currencyId" INTEGER NOT NULL,

    CONSTRAINT "CompetitionVotingRule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionVotingRule" ADD CONSTRAINT "CompetitionVotingRule_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionVotingRule" ADD CONSTRAINT "CompetitionVotingRule_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
