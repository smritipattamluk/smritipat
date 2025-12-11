-- CreateEnum
CREATE TYPE "FloorType" AS ENUM ('GROUND', 'FIRST', 'BOTH');

-- AlterTable
ALTER TABLE "halls" ADD COLUMN     "floor" "FloorType" NOT NULL DEFAULT 'GROUND';
