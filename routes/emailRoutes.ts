import express from "express";
import EmailController from "../controllers/EmailController";

const router = express.Router();

/**
 * Setup email routes with dependency injection
 * @param emailController - The email controller instance
 * @returns Configured router
 */
function setupEmailRoutes(emailController: EmailController): express.Router {
  /**
   * @swagger
   * /api/send-medical-form:
   *   post:
   *     summary: Send dental medical form data via email
   *     description: Receives dental medical form data and sends it via email to the configured recipient
   *     tags: [Forms]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - formData
   *             properties:
   *               formData:
   *                 type: object
   *                 properties:
   *                   firstName:
   *                     type: string
   *                     description: Patient's first name
   *                   lastName:
   *                     type: string
   *                     description: Patient's last name
   *                   dateOfBirth:
   *                     type: string
   *                     description: Patient's date of birth
   *                   phone:
   *                     type: string
   *                     description: Patient's phone number
   *                   email:
   *                     type: string
   *                     description: Patient's email address
   *                   epilepsy:
   *                     type: boolean
   *                     description: Does patient have epilepsy
   *                   jaundice:
   *                     type: boolean
   *                     description: Does patient have jaundice
   *                   hypertension:
   *                     type: boolean
   *                     description: Does patient have hypertension
   *               lang:
   *                 type: string
   *                 description: Form language (optional)
   *     responses:
   *       200:
   *         description: Email sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 messageId:
   *                   type: string
   *       400:
   *         description: Bad request - missing form data
   *       500:
   *         description: Server error
   */
  router.post(
    "/send-medical-form",
    emailController.sendMedicalForm.bind(emailController)
  );

  /**
   * @swagger
   * /api/send-patient-questionnaire:
   *   post:
   *     summary: Send patient questionnaire data via email
   *     description: Receives patient registration data, saves to database, and sends via email
   *     tags: [Patient Questionnaire]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - patientData
   *             properties:
   *               patientData:
   *                 type: object
   *                 properties:
   *                   firstName:
   *                     type: string
   *                     description: Patient's first name
   *                   lastName:
   *                     type: string
   *                     description: Patient's last name
   *                   email:
   *                     type: string
   *                     description: Patient's email address
   *                   phone:
   *                     type: string
   *                     description: Patient's phone number
   *                   dateOfBirth:
   *                     type: string
   *                     description: Patient's date of birth
   *                   address:
   *                     type: string
   *                     description: Patient's street address
   *                   city:
   *                     type: string
   *                     description: Patient's city
   *                   country:
   *                     type: string
   *                     description: Patient's country
   *                   zipCode:
   *                     type: string
   *                     description: Patient's zip code
   *                   emergencyContactName:
   *                     type: string
   *                     description: Emergency contact name
   *                   emergencyContactPhone:
   *                     type: string
   *                     description: Emergency contact phone
   *                   emergencyContactRelationship:
   *                     type: string
   *                     description: Emergency contact relationship
   *                   hearAboutUs:
   *                     type: string
   *                     description: How patient heard about us
   *                   referralDetails:
   *                     type: string
   *                     description: Referral details
   *                   hipaaConsent:
   *                     type: boolean
   *                     description: HIPAA consent given
   *                   treatmentConsent:
   *                     type: boolean
   *                     description: Treatment consent given
   *                   signature:
   *                     type: string
   *                     description: Digital signature data
   *               lang:
   *                 type: string
   *                 description: Form language (optional)
   *     responses:
   *       200:
   *         description: Patient data processed and email sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 messageId:
   *                   type: string
   *                 patient:
   *                   type: object
   *                 isNewPatient:
   *                   type: boolean
   *                 savedToDatabase:
   *                   type: boolean
   *       400:
   *         description: Bad request - missing patient data
   *       500:
   *         description: Server error
   */
  router.post(
    "/send-patient-questionnaire",
    emailController.sendPatientQuestionnaire.bind(emailController)
  );

  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: Health check endpoint
   *     description: Check the health and configuration of the email service
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service health information
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                 configured:
   *                   type: boolean
   *                 connected:
   *                   type: boolean
   *       500:
   *         description: Health check failed
   */
  router.get("/health", emailController.healthCheck.bind(emailController));

  return router;
}

export default setupEmailRoutes;
