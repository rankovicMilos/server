const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
require("dotenv").config();

// Import services and controllers
const EmailService = require("./services/EmailService");
const EmailController = require("./controllers/EmailController");
const setupEmailRoutes = require("./routes/emailRoutes");

/**
 * @swagger
 * tags:
 *   - name: Forms
 *     description: Dental medical form operations
 *   - name: Patient Questionnaire
 *     description: Patient questionnaire operations
 *   - name: Health
 *     description: Health check operations
 */

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Dependency injection setup
const emailService = new EmailService();
const emailController = new EmailController(emailService);

// Setup routes
app.use("/api", setupEmailRoutes(emailController));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Dental Email Sender API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      sendMedicalForm: "/api/send-medical-form",
      sendPatientQuestionnaire: "/api/send-patient-questionnaire",
      documentation: "/swagger",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API Documentation: http://localhost:${PORT}/swagger`);
});
