import { Request, Response } from "express";
import EmailService from "../services/EmailService";

/**
 * Email Controller
 * Handles HTTP requests related to email operations
 */
export default class EmailController {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  /**
   * Handle sending dental form data via email
   * @param req - Express request object
   * @param res - Express response object
   */
  async sendMedicalForm(req: Request, res: Response): Promise<Response> {
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
      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: (error as Error).message,
      });
    }
  }

  /**
   * Handle sending patient questionnaire data via email
   * @param req - Express request object
   * @param res - Express response object
   */
  async sendPatientQuestionnaire(
    req: Request,
    res: Response
  ): Promise<Response> {
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
      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send patient registration email",
        error: (error as Error).message,
      });
    }
  }

  /**
   * Handle health check request
   * @param req - Express request object
   * @param res - Express response object
   */
  async healthCheck(req: Request, res: Response): Promise<Response> {
    try {
      const isConfigured = this.emailService.isConfigured();
      const isConnected = await this.emailService.verifyConnection();

      return res.json({
        success: true,
        message: "Email service is running",
        timestamp: new Date().toISOString(),
        configured: isConfigured,
        connected: isConnected,
      });
    } catch (error) {
      console.error("Error in healthCheck controller:", error);
      return res.status(500).json({
        success: false,
        message: "Health check failed",
        error: (error as Error).message,
      });
    }
  }
}
