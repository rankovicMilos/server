class PatientService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  // Process patient registration from form data
  async processPatientRegistration(formData) {
    try {
      const {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phone,
        email,
        address,
        city,
        country,
        zipCode,
        emergencyName,
        emergencyPhone,
        emergencyRelationship,
        hearAboutUs,
        referralDetails,
        hipaaConsent,
        treatmentConsent,
        signature,
      } = formData;
      console.log("Processing registration for:", formData);

      // Check if patient already exists
      let patient = await this.db.findPatientByEmail(email);

      // Prepare emergency contact data
      const emergencyContact = emergencyContactName
        ? {
            name: emergencyName,
            phone: emergencyPhone,
            relationship: emergencyRelationship,
          }
        : null;

      const isNewPatient = !patient;

      if (!patient) {
        // Create new patient
        patient = await this.db.createPatient({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          emergencyContact: emergencyContact,
          streetAddress: address,
          city: city,
          country: country,
          zipCode: zipCode,
          gender: gender,
          referralChannel: hearAboutUs,
          referralChannelDetails: referralDetails,
          isHipaaConsent: hipaaConsent,
          isTermsAccepted: treatmentConsent,
        });
      } else {
        // Update existing patient if needed
        const updateData = {
          phone: phone || patient.phone,
          dateOfBirth: dateOfBirth
            ? new Date(dateOfBirth)
            : patient.dateOfBirth,
          emergencyContact: emergencyContact || patient.emergencyContact,
          streetAddress: address || patient.streetAddress,
          city: city || patient.city,
          country: country || patient.country,
          referralChannel: referralChannel || patient.referralChannel,
          referralChannelDetails:
            referralChannelDetails || patient.referralChannelDetails,
          isHipaaConsent: isHipaaConsent || patient.isHipaaConsent,
          isTermsAccepted: isTermsAccepted || patient.isTermsAccepted,
        };

        patient = await this.db.updatePatient(patient.id, updateData);
      }

      // Create signature document if provided
      if (signature && patient.id) {
        try {
          await this.db.createDocument({
            patientId: patient.id,
            documentType: "signature",
            fileName: `signature_${patient.firstName}_${
              patient.lastName
            }_${Date.now()}.png`,
            originalName: `signature_${patient.firstName}_${
              patient.lastName
            }_${Date.now()}.png`,
            fileType: "image/png",
            fileSize: signature.length,
            filePath: `/signatures/${patient.id}/`,
            isEncrypted: false,
            accessLevel: "private",
            description: "Patient registration signature",
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

  // Get patient with full medical history
  async getPatientProfile(email) {
    try {
      const patient = await this.db.findPatientByEmail(email);
      if (!patient) {
        return null;
      }

      // Get latest medical history
      const latestMedicalHistory = await this.db.findLatestMedicalHistory(
        patient.id
      );

      return {
        ...patient,
        latestMedicalHistory,
      };
    } catch (error) {
      console.error("Error getting patient profile:", error);
      throw error;
    }
  }

  // Utility methods
  parseArrayField(fieldValue) {
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
  formatPatientDataForEmail(patient, medicalHistory) {
    const sections = [];

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
    if (patient.emergencyContact) {
      sections.push({
        title: "Emergency Contact",
        data: [
          { label: "Name", value: patient.emergencyContact.name },
          { label: "Phone", value: patient.emergencyContact.phone },
          {
            label: "Relationship",
            value: patient.emergencyContact.relationship,
          },
        ],
      });
    }
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

    //Signature
    if (patient.signature) {
      sections.push({
        title: "Signature",
        data: [
          { label: "Signature", value: patient.signature || "Not provided" },
        ],
      });
    }

    return sections;
  }
}

module.exports = PatientService;
