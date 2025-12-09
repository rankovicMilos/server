import { EmailFormData } from "../models/EmailFormData";
import PatientMarketingData from "../models/PatientMarketingData";
import MySqlDatabaseService from "./MySqlMarketingDatabaseService";

interface PatientRegistrationResult {
  patient: PatientMarketingData;
  isNewPatient: boolean;
}

interface EmailSection {
  title: string;
  data: Array<{
    label: string;
    value: string;
  }>;
}

export default class PatientService {
  private readonly db: MySqlDatabaseService;

  constructor(databaseService: MySqlDatabaseService) {
    this.db = databaseService;
  }

  // Process patient registration from form data
  async processPatientRegistration(
    formData: EmailFormData
  ): Promise<PatientRegistrationResult> {
    try {
      console.log("Processing registration for:", formData);

      // Check if patient already exists
      let patient = await this.db.findPatientByEmail(formData.email);

      // Prepare emergency contact data

      const isNewPatient = true;

      if (!patient) {
        // Create new patient
        const newPatient = await this.db.createPatient({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || "",
          gender: formData.gender || "",
          dateOfBirth: new Date(formData.dateOfBirth),
          emergencyContactName: formData.emergencyContactName || "",
          emergencyContactPhone: formData.emergencyContactPhone || "",
          emergencyContactRelation: formData.emergencyContactRelationship || "",
          address: formData.address || "",
          city: formData.city || "",
          country: formData.country || "",
          zipCode: formData.zipCode || "",
          referralChannel: formData.hearAboutUs || "",
          referralChannelDetails: formData.referralDetails || "",
          isHipaaConsent: formData.hipaaConsent,
          isTermsAccepted: formData.treatmentConsent,
        });
        patient = newPatient;
      }

      // Create signature document if provided
      if (formData.signature && patient?.id) {
        try {
          await this.db.createDocument(patient.id, {
            documentType: "signature",
            fileName: `signature_${patient.firstName}_${
              patient.lastName
            }_${Date.now()}.png`,
            originalName: `signature_${patient.firstName}_${
              patient.lastName
            }_${Date.now()}.png`,
            fileType: "image/png",
            fileSize: formData.signature.length,
            filePath: `/signatures/${patient.id}/`,
            patientId: "",
            documentPath: "",
          });
        } catch (docError) {
          console.error("Error creating signature document:", docError);
          // Don't fail the registration if signature document creation fails
        }
      }

      return {
        patient,
        isNewPatient,
      };
    } catch (error) {
      console.error("Error processing patient registration:", error);
      throw error;
    }
  }

  // Utility methods
  parseArrayField(fieldValue: any): string[] | null {
    if (!fieldValue) return null;

    if (Array.isArray(fieldValue)) {
      return fieldValue;
    }

    if (typeof fieldValue === "string") {
      // Handle comma-separated values
      return fieldValue
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    return null;
  }

  // Format patient data for email
  formatPatientDataForEmail(
    patient: PatientMarketingData,
    medicalHistory?: any
  ): EmailSection[] {
    const sections: EmailSection[] = [];

    // Patient Information
    sections.push({
      title: "Patient Information",
      data: [
        { label: "Name", value: `${patient.firstName} ${patient.lastName}` },
        { label: "Email", value: patient.email },
        { label: "Phone", value: patient.phone || "Not provided" },
        {
          label: "Date of Birth",
          value: patient.dateOfBirth
            ? patient.dateOfBirth.toDateString()
            : "Not provided",
        },
      ],
    });

    // Emergency Contact

    sections.push({
      title: "Emergency Contact",
      data: [
        {
          label: "Name",
          value: patient.emergencyContactName || "Not provided",
        },
        {
          label: "Phone",
          value: patient.emergencyContactPhone || "Not provided",
        },
        {
          label: "Relationship",
          value: patient.emergencyContactRelation || "Not provided",
        },
      ],
    });

    // Address
    if (patient.address || patient.city || patient.country) {
      sections.push({
        title: "Address",
        data: [
          {
            label: "Street Address",
            value: patient.address || "Not provided",
          },
          { label: "City", value: patient.city || "Not provided" },
          { label: "Country", value: patient.country || "Not provided" },
          { label: "Zip Code", value: patient.zipCode || "Not provided" },
        ],
      });
    }

    // Referral Information
    if (patient.referralChannel) {
      sections.push({
        title: "Referral Information",
        data: [
          {
            label: "Referral Channel",
            value: patient.referralChannel || "Not provided",
          },
          {
            label: "Referral Channel Details",
            value: patient.referralChannelDetails || "Not provided",
          },
        ],
      });
    }

    // Consents
    sections.push({
      title: "Consents",
      data: [
        {
          label: "HIPAA Consent",
          value: patient.isHipaaConsent ? "Yes" : "No",
        },
        {
          label: "Terms and Conditions",
          value: patient.isTermsAccepted ? "Accepted" : "Not Accepted",
        },
      ],
    });

    return sections;
  }
}
