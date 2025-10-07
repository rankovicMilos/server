-- CreateTable
CREATE TABLE "patient_medical_data" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "phone" TEXT,
    "email" TEXT,
    "epilepsy" BOOLEAN NOT NULL DEFAULT false,
    "jaundice" BOOLEAN NOT NULL DEFAULT false,
    "hypertenion" BOOLEAN NOT NULL DEFAULT false,
    "pastIllnesses" TEXT NOT NULL DEFAULT '',
    "chronicDiseases" TEXT NOT NULL DEFAULT '',
    "implants" TEXT NOT NULL DEFAULT '',
    "infectionHistory" TEXT NOT NULL DEFAULT '',
    "bleedsLongerAfterCuts" TEXT NOT NULL DEFAULT '',
    "bleedingDisorders" TEXT NOT NULL DEFAULT '',
    "hypercoagulableState" BOOLEAN NOT NULL DEFAULT false,
    "bronchialAsthma" BOOLEAN NOT NULL DEFAULT false,
    "tuberculosisHistory" TEXT NOT NULL DEFAULT '',
    "pepticUlcerSites" TEXT NOT NULL DEFAULT '',
    "otherDiseases" TEXT NOT NULL DEFAULT '',
    "currentMedications" TEXT NOT NULL DEFAULT '',
    "surgeriesHistory" TEXT NOT NULL DEFAULT '',
    "cigarettesPerDay" INTEGER NOT NULL DEFAULT 0,
    "drinksAlcoholDaily" BOOLEAN NOT NULL DEFAULT false,
    "usesDrugs" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_medical_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_medical_data_email_key" ON "patient_medical_data"("email");

-- CreateIndex
CREATE INDEX "patient_medical_data_id_idx" ON "patient_medical_data"("id");

-- CreateIndex
CREATE INDEX "patient_medical_data_email_idx" ON "patient_medical_data"("email");

-- CreateIndex
CREATE INDEX "patient_medical_data_lastName_firstName_idx" ON "patient_medical_data"("lastName", "firstName");
