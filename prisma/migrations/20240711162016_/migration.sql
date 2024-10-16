/*
  Warnings:

  - You are about to drop the column `time` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `packageCategory` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedulePackage` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleStatus` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SCHEDULE_PACKAGE" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER');

-- CreateEnum
CREATE TYPE "SCHEDULE_STATUS" AS ENUM ('BLOCKED', 'MAINTENANCE', 'EXCLUSIVE', 'AVAILABLE');

-- CreateEnum
CREATE TYPE "PACKAGE_CATEGORY" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'EXCLUSIVE');

-- CreateEnum
CREATE TYPE "IMAGE_USE" AS ENUM ('PROD_FEATURED', 'PROD_THUMBNAIL', 'COMMON');

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "ImageUse" "IMAGE_USE"[] DEFAULT ARRAY['COMMON']::"IMAGE_USE"[];

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "packageCategory" "PACKAGE_CATEGORY" NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "time",
ADD COLUMN     "day" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "schedulePackage" "SCHEDULE_PACKAGE" NOT NULL,
ADD COLUMN     "scheduleStatus" "SCHEDULE_STATUS" NOT NULL;
