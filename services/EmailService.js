const nodemailer = require("nodemailer");
const {
  formatPatientDataForEmail,
  formatPatientQuestionnaireForEmail,
} = require("../lib/utils");

class EmailService {
  constructor() {
    this.transporter = null;
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
   * Send patient registration data via email
   * @param {Object} patientData - The patient registration data
   * @param {string} lang - The form language
   * @returns {Promise<Object>} - Email send result
   */
  async sendPatientQuestionnaireEmail(patientData, lang) {
    try {
      if (!patientData) {
        throw new Error("Patient data is required");
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

      return {
        success: true,
        message: "Patient registration submitted and email sent successfully",
        messageId: info.messageId,
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
