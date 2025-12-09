export default interface PatientMarketingData {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  referralChannel: string;
  referralChannelDetails: string;
  isHipaaConsent: boolean;
  isTermsAccepted: boolean;
}
