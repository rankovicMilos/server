/*
  Warnings:

  - You are about to drop the column `emergencyContact` on the `patients` table. All the data in the column will be lost.
  - Added the required column `emergencyName` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyPhone` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyRelationship` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "emergencyContact",
ADD COLUMN     "emergencyName" TEXT NOT NULL,
ADD COLUMN     "emergencyPhone" TEXT NOT NULL,
ADD COLUMN     "emergencyRelationship" TEXT NOT NULL;
