const express = require("express");
const router = express.Router();

/**
 * Setup email routes with dependency injection
 * @param {EmailController} emailController - The email controller instance
 * @returns {express.Router} - Configured router
 */
function setupEmailRoutes(emailController) {
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
   *                   pastIllnesses:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: List of past illnesses
   *                   chronicDiseases:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: List of chronic diseases
   *                   implants:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: List of implants
   *                   infectionHistory:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: History of infections
   *                   cut_bleed:
   *                     type: boolean
   *                     description: Does patient bleed longer after cuts
   *                   allergies:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: List of allergies
   *                   bleedingDisorders:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: List of bleeding disorders
   *                   blood_clot:
   *                     type: boolean
   *                     description: Excessive blood clotting
   *                   asthma:
   *                     type: boolean
   *                     description: Does patient have bronchial asthma
   *                   tuberculosisHistory:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: Tuberculosis history
   *                   pepticUlcerSites:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: Peptic ulcer sites
   *                   otherDiseases:
   *                     type: string
   *                     description: Other diseases
   *                   medications:
   *                     type: string
   *                     description: Current medications
   *                   surgeries:
   *                     type: string
   *                     description: Surgery history
   *                   cigarettes:
   *                     type: number
   *                     description: Cigarettes per day
   *                   alcohol:
   *                     type: boolean
   *                     description: Drinks alcohol daily
   *                   drugs:
   *                     type: boolean
   *                     description: Uses drugs
   *                   details:
   *                     type: string
   *                     description: Additional details
   *                   hipaaConsent:
   *                     type: boolean
   *                     description: HIPAA consent given
   *                   treatmentConsent:
   *                     type: boolean
   *                     description: Treatment consent given
   *                   signature:
   *                     type: string
   *                     description: Digital signature
   *               lang:
   *                 type: string
   *                 description: Form language
   *                 example: "en"
   *     responses:
   *       200:
   *         description: Form submitted successfully
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
   *         description: Bad request - Form data is required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 error:
   *                   type: string
   */
  router.post("/send-medical-form", (req, res) =>
    emailController.sendMedicalForm(req, res)
  );

  /**
   * @swagger
   * /api/send-patient-questionnaire:
   *   post:
   *     summary: Send patient questionnaire data via email
   *     description: Receives patient questionnaire data and sends it via email
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
   *                     example: "John"
   *                   lastName:
   *                     type: string
   *                     description: Patient's last name
   *                     example: "Doe"
   *                   dateOfBirth:
   *                     type: string
   *                     description: Patient's date of birth
   *                     example: "1990-01-01"
   *                   gender:
   *                     type: string
   *                     description: Patient's gender
   *                     example: "Male"
   *                   phone:
   *                     type: string
   *                     description: Patient's phone number
   *                     example: "555-0123"
   *                   email:
   *                     type: string
   *                     description: Patient's email address
   *                     example: "john.doe@example.com"
   *                   address:
   *                     type: string
   *                     description: Patient's street address
   *                     example: "123 Main St"
   *                   city:
   *                     type: string
   *                     description: Patient's city
   *                     example: "Anytown"
   *                   state:
   *                     type: string
   *                     description: Patient's state
   *                     example: "CA"
   *                   zipCode:
   *                     type: string
   *                     description: Patient's ZIP code
   *                     example: "12345"
   *                   emergencyName:
   *                     type: string
   *                     description: Emergency contact name
   *                     example: "Jane Doe"
   *                   emergencyPhone:
   *                     type: string
   *                     description: Emergency contact phone number
   *                     example: "555-0124"
   *                   emergencyRelationship:
   *                     type: string
   *                     description: Relationship with emergency contact
   *                     example: "Spouse"
   *                   hasInsurance:
   *                     type: string
   *                     description: Whether patient has insurance
   *                     example: "Yes"
   *                   insuranceProvider:
   *                     type: string
   *                     description: Patient's insurance provider
   *                     example: "Blue Cross Blue Shield"
   *                   policyNumber:
   *                     type: string
   *                     description: Patient's insurance policy number
   *                     example: "BC123456789"
   *                   hearAboutUs:
   *                     type: string
   *                     description: How patient heard about the practice
   *                     example: "Google Search"
   *                   referralDetails:
   *                     type: string
   *                     description: Additional referral details
   *                     example: "Found through online search"
   *                   hipaaConsent:
   *                     type: boolean
   *                     description: HIPAA consent given
   *                     example: true
   *                   treatmentConsent:
   *                     type: boolean
   *                     description: Treatment consent given
   *                     example: true
   *                   signature:
   *                     type: string
   *                     description: Patient's signature
   *                     example: "John Doe"
   *               lang:
   *                 type: string
   *                 description: Form language
   *                 example: "en"
   *     responses:
   *       200:
   *         description: Patient questionnaire submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Patient registration submitted and email sent successfully"
   *                 messageId:
   *                   type: string
   *                   example: "1234567890@example.com"
   *       400:
   *         description: Bad request - Patient data is required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Patient data is required"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Failed to send patient registration email"
   *                 error:
   *                   type: string
   *                   example: "SMTP connection failed"
   */
  router.post("/send-patient-questionnaire", (req, res) =>
    emailController.sendPatientQuestionnaire(req, res)
  );

  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: Health check endpoint
   *     description: Check if the email service is running and responsive
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is running
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Email service is running"
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                   example: "2025-10-01T12:00:00.000Z"
   *                 configured:
   *                   type: boolean
   *                   example: true
   *                   description: Whether email service is properly configured
   *                 connected:
   *                   type: boolean
   *                   example: true
   *                   description: Whether email service can connect to email server
   */
  router.get("/health", (req, res) => emailController.healthCheck(req, res));

  return router;
}

module.exports = setupEmailRoutes;
