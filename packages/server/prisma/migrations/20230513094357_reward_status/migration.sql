-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('CONFIRMING', 'SETTLED', 'FAILED', 'INVALID');

-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "status" "RewardStatus";
