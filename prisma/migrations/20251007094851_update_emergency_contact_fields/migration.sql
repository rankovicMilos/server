/*
  Warnings:

  - You are about to drop the column `emergencyName` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyPhone` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyRelationship` on the `patients` table. All the data in the column will be lost.
  - Added the required column `emergencyContactName` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactPhone` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactRelationship` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "emergencyName",
DROP COLUMN "emergencyPhone",
DROP COLUMN "emergencyRelationship",
ADD COLUMN     "emergencyContactName" TEXT NOT NULL,
ADD COLUMN     "emergencyContactPhone" TEXT NOT NULL,
ADD COLUMN     "emergencyContactRelationship" TEXT NOT NULL;
