const nodemailer = require("nodemailer");
const {
  formatPatientDataForEmail,
  formatPatientQuestionnaireForEmail,
} = require("../lib/utils");

class EmailService {
  constructor(patientService = null) {
    this.transporter = null;
    this.patientService = patientService;
    this.initializeTransporter();
  }

  /**
   * Initialize the email transporter
   */
  initializeTransporter() {
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
   * @param {Object} formData - The form data
   * @param {string} lang - The form language
   * @returns {Promise<Object>} - Email send result
   */
  async sendMedicalFormEmail(formData, lang) {
    try {
      if (!formData) {
        throw new Error("Form data is required");
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: formData.email || process.env.RECIPIENT_EMAIL,
        subject: `New Dental Medical Form - ${
          formData.firstName || "Unknown"
        } ${formData.lastName || "Patient"}`,
        html: formatPatientDataForEmail({ formData, lang }),
        replyTo: process.env.RECIPIENT_EMAIL,
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
   * @param {Object} patientData - The patient registration data
   * @param {string} lang - The form language
   * @returns {Promise<Object>} - Email send result
   */
  async sendPatientQuestionnaireEmail(patientData, lang) {
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

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL || "dentist@example.com",
        subject: `New Patient Registration - ${
          patientData.firstName || "Unknown"
        } ${patientData.lastName || "Patient"}`,
        html: formatPatientQuestionnaireForEmail({ patientData }, lang),
        replyTo: patientData.email,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        "Patient registration email sent successfully:",
        info.messageId
      );

      // Record email communication in database if patient service is available
      if (this.patientService && dbResult?.patient) {
        try {
          await this.patientService.recordEmailCommunication(
            dbResult.patient.id,
            {
              subject: mailOptions.subject,
              html: mailOptions.html,
              from: mailOptions.from,
              to: mailOptions.to,
            }
          );
        } catch (commError) {
          console.error("Failed to record email communication:", commError);
          // Don't throw error for communication logging failures
        }
      }

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
   * @returns {boolean} - True if configured, false otherwise
   */
  isConfigured() {
    return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
  }

  /**
   * Verify the email transporter connection
   * @returns {Promise<boolean>} - True if connection is successful
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email transporter verification failed:", error);
      return false;
    }
  }
}

module.exports = EmailService;
