export interface EmailFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  hearAboutUs: string;
  referralDetails?: string;
  hipaaConsent: boolean;
  treatmentConsent: boolean;
  signature: string; // Base64 encoded image
}
