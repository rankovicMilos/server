import { Tables } from "../types/supabase";
import DatabaseService from "./DatabaseService";

type PatientMedicalData = Tables<"patient_medical_data">;

interface MedicalFormSubmissionResult {
  record: PatientMedicalData;
  isNewRecord: boolean;
}

function toListString(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;
  return "";
}

export default class MedicalService {
  private readonly db: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService;
  }

  // Persist a medical questionnaire submission, keyed by email when available
  async processMedicalFormSubmission(
    formData: any
  ): Promise<MedicalFormSubmissionResult> {
    const email: string | undefined = formData.email || undefined;

    const data = {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      dateOfBirth: formData.dateOfBirth
        ? new Date(formData.dateOfBirth).toISOString()
        : undefined,
      phone: formData.phone || "",
      email,
      epilepsy: !!formData.epilepsy,
      jaundice: !!formData.jaundice,
      hypertension: !!formData.hypertension,
      pastIllnesses: toListString(formData.pastIllnesses),
      chronicDiseases: toListString(formData.chronicDiseases),
      implants: toListString(formData.implants),
      infectionHistory: toListString(formData.infectionHistory),
      bleedsLongerAfterCuts: toListString(formData.cut_bleed),
      bleedingDisorders: toListString(formData.bleedingDisorders),
      hypercoagulableState: !!formData.blood_clot,
      bronchialAsthma: !!formData.asthma,
      tuberculosisHistory: toListString(formData.tuberculosisHistory),
      pepticUlcerSites: toListString(formData.pepticUlcerSites),
      otherDiseases: formData.details || formData.otherDiseases || "",
      currentMedications: formData.medications || "",
      surgeriesHistory: formData.surgeries || "",
      cigarettesPerDay: Number(formData.cigarettes) || 0,
      drinksAlcoholDaily: !!formData.alcohol,
      usesDrugs: !!formData.drugs,
    };

    const existing = email
      ? await this.db.findMedicalDataByEmail(email)
      : null;

    const record = existing
      ? await this.db.updateMedicalData(existing.id, data)
      : await this.db.createMedicalData(data);

    return { record, isNewRecord: !existing };
  }
}
