/*
  Warnings:

  - The `description` column on the `Amenities` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `foodId` on the `Package` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Amenities" DROP COLUMN "description",
ADD COLUMN     "description" TEXT[];

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "foodId",
ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
