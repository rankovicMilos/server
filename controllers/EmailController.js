/**
 * Email Controller
 * Handles HTTP requests related to email operations
 */
class EmailController {
  constructor(emailService) {
    this.emailService = emailService;
  }

  /**
   * Handle sending dental form data via email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendMedicalForm(req, res) {
    try {
      const { formData, lang } = req.body;

      if (!formData) {
        return res.status(400).json({
          success: false,
          message: "Form data is required",
        });
      }

      const result = await this.emailService.sendMedicalFormEmail(
        formData,
        lang
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: error.message,
      });
    }
  }

  /**
   * Handle sending patient questionnaire data via email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async sendPatientQuestionnaire(req, res) {
    try {
      const { patientData, lang } = req.body;

      if (!patientData) {
        return res.status(400).json({
          success: false,
          message: "Patient data is required",
        });
      }

      const result = await this.emailService.sendPatientQuestionnaireEmail(
        patientData,
        lang
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send patient registration email",
        error: error.message,
      });
    }
  }

  /**
   * Handle health check request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async healthCheck(req, res) {
    try {
      const isConfigured = this.emailService.isConfigured();
      const isConnected = await this.emailService.verifyConnection();

      res.json({
        success: true,
        message: "Email service is running",
        timestamp: new Date().toISOString(),
        configured: isConfigured,
        connected: isConnected,
      });
    } catch (error) {
      console.error("Error in healthCheck controller:", error);
      res.status(500).json({
        success: false,
        message: "Health check failed",
        error: error.message,
      });
    }
  }

  /**
   * Handle test email request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
}

module.exports = EmailController;
