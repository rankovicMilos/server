import nodemailer from "nodemailer";
import PatientService from "./PatientService";
import {
  formatPatientDataForEmail,
  formatPatientQuestionnaireForEmail,
} from "../lib/utils";

interface EmailResult {
  success: boolean;
  message: string;
  messageId: string;
  patient?: any;
  isNewPatient?: boolean;
  savedToDatabase?: boolean;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export default class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly patientService: PatientService | null;

  constructor(patientService: PatientService | null = null) {
    this.patientService = patientService;
    this.initializeTransporter();
  }

  /**
   * Initialize the email transporter
   */
  private initializeTransporter(): void {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
      },
    });
  }

  /**
   * Send dental form data via email
   * @param formData - The form data
   * @param lang - The form language
   * @returns Email send result
   */
  async sendMedicalFormEmail(
    formData: any,
    lang?: string
  ): Promise<EmailResult> {
    try {
      if (!formData) {
        throw new Error("Form data is required");
      }

      const mailOptions: MailOptions = {
        from: process.env.EMAIL_USER || "",
        to: formData.email || process.env.RECIPIENT_EMAIL || "",
        subject: `New Dental Medical Form - ${
          formData.firstName || "Unknown"
        } ${formData.lastName || "Patient"}`,
        html: formatPatientDataForEmail({ formData }, lang || "en"),
        replyTo: process.env.RECIPIENT_EMAIL || "",
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);

      return {
        success: true,
        message: "Form submitted and email sent successfully",
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  /**
   * Send patient registration data via email with database integration
   * @param patientData - The patient registration data
   * @param lang - The form language
   * @returns Email send result
   */
  async sendPatientQuestionnaireEmail(
    patientData: any,
    lang?: string
  ): Promise<EmailResult> {
    try {
      if (!patientData) {
        throw new Error("Patient data is required");
      }

      let dbResult = null;

      // If patient service is available, process and save to database
      if (this.patientService) {
        try {
          dbResult = await this.patientService.processPatientRegistration(
            patientData
          );
          console.log("Patient data saved to database:", {
            patientId: dbResult.patient.id,
            isNewPatient: dbResult.isNewPatient,
          });
        } catch (dbError) {
          console.error(
            "Database save failed, but continuing with email:",
            dbError
          );
          // Continue with email even if database save fails
        }
      }

      const mailOptions: MailOptions = {
        from: process.env.EMAIL_USER || "",
        to: process.env.RECIPIENT_EMAIL || "dentist@example.com",
        subject: `New Patient Registration - ${
          patientData.firstName || "Unknown"
        } ${patientData.lastName || "Patient"}`,
        html: formatPatientQuestionnaireForEmail({ patientData }, lang || "en"),
        replyTo: patientData.email,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        "Patient registration email sent successfully:",
        info.messageId
      );

      return {
        success: true,
        message: "Patient registration submitted and email sent successfully",
        messageId: info.messageId,
        patient: dbResult?.patient || null,
        isNewPatient: dbResult?.isNewPatient || false,
        savedToDatabase: !!dbResult,
      };
    } catch (error) {
      console.error("Error sending patient registration email:", error);
      throw error;
    }
  }

  /**
   * Check if the email service is configured properly
   * @returns True if configured, false otherwise
   */
  isConfigured(): boolean {
    return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
  }

  /**
   * Verify the email transporter connection
   * @returns True if connection is successful
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email transporter verification failed:", error);
      return false;
    }
  }
}
