import { Tables } from "../types/supabase";
import { EmailFormData } from "../models/EmailFormData";
import DatabaseService from "./DatabaseService";
import { decodeBase64DataUrl } from "../lib/utils";

type PatientMarketingData = Tables<"patients">;

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
  private readonly db: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.db = databaseService;
  }

  // Process patient registration from form data
  async processPatientRegistration(
    formData: EmailFormData,
  ): Promise<PatientRegistrationResult> {
    try {
      // Check if patient already exists
      let patient = await this.db.findPatientByEmail(formData.email);
      const isNewPatient = !patient;

      if (!patient) {
        patient = await this.db.createPatient({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || "",
          gender: formData.gender || "",
          dateOfBirth: formData.dateOfBirth
            ? new Date(formData.dateOfBirth).toISOString()
            : undefined,
          emergencyContactName: formData.emergencyContactName || "",
          emergencyContactPhone: formData.emergencyContactPhone || "",
          emergencyContactRelationship:
            formData.emergencyContactRelationship || "",
          streetAddress: formData.address || "",
          city: formData.city || "",
          country: formData.country || "",
          zipCode: formData.zipCode || "",
          referralChannel: formData.hearAboutUs || "",
          referralChannelDetails: formData.referralDetails || "",
          isHipaaConsent: formData.hipaaConsent,
          isTermsAccepted: formData.treatmentConsent,
        });
      }

      // Create signature document if provided
      if (formData.signature && patient?.id) {
        try {
          const { buffer, contentType } = decodeBase64DataUrl(
            formData.signature,
          );
          const fileName = `signature_${patient.firstName}_${patient.lastName}_${Date.now()}.png`;

          await this.db.createDocument(
            patient.id,
            {
              fileName,
              originalName: fileName,
              fileType: contentType,
              fileSize: buffer.length,
              filePath: `signatures/${patient.id}/${fileName}`,
              documentType: "signature",
            },
            buffer,
          );
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
    medicalHistory?: any,
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
            ? new Date(patient.dateOfBirth).toDateString()
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
          value: patient.emergencyContactRelationship || "Not provided",
        },
      ],
    });

    // Address
    if (patient.streetAddress || patient.city || patient.country) {
      sections.push({
        title: "Address",
        data: [
          {
            label: "Street Address",
            value: patient.streetAddress || "Not provided",
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
