-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('CONFIRMING', 'CONFIRMED', 'FAILED', 'INVALID');

-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "status" "RewardStatus";
