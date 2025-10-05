/*
  Warnings:

  - You are about to drop the column `category` on the `patient_documents` table. All the data in the column will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `communications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medical_histories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isHipaaConsent` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isTermsAccepted` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralChannel` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralChannelDetails` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetAddress` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."communications" DROP CONSTRAINT "communications_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."medical_histories" DROP CONSTRAINT "medical_histories_patientId_fkey";

-- AlterTable
ALTER TABLE "patient_documents" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "isHipaaConsent" BOOLEAN NOT NULL,
ADD COLUMN     "isTermsAccepted" BOOLEAN NOT NULL,
ADD COLUMN     "referralChannel" TEXT NOT NULL,
ADD COLUMN     "referralChannelDetails" TEXT NOT NULL,
ADD COLUMN     "streetAddress" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."appointments";

-- DropTable
DROP TABLE "public"."communications";

-- DropTable
DROP TABLE "public"."medical_histories";
