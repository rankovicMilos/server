const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
require("dotenv").config();

// Import services and controllers
const DatabaseService = require("./services/DatabaseService");
const PatientService = require("./services/PatientService");
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

// Initialize services with dependency injection
async function initializeServices() {
  try {
    // Initialize database service
    const databaseService = new DatabaseService();
    await databaseService.initialize();

    // Initialize patient service with database dependency
    const patientService = new PatientService(databaseService);

    // Initialize email service with patient service dependency
    const emailService = new EmailService(patientService);

    // Verify email configuration
    const emailConfigured = emailService.isConfigured();
    const emailConnected = await emailService.verifyConnection();

    console.log("🔧 Service Status:");
    console.log(`   📧 Email configured: ${emailConfigured ? "✅" : "❌"}`);
    console.log(`   📧 Email connected: ${emailConnected ? "✅" : "❌"}`);

    // Check database health
    const dbHealth = await databaseService.healthCheck();
    console.log(
      `   🗄️  Database: ${dbHealth.status === "healthy" ? "✅" : "❌"}`
    );

    // Initialize controller with email service
    const emailController = new EmailController(emailService);

    return { emailController, databaseService };
  } catch (error) {
    console.error("❌ Failed to initialize services:", error);
    throw error;
  }
}

// Setup routes and start server
async function startServer() {
  try {
    const { emailController, databaseService } = await initializeServices();

    // Setup routes
    app.use("/api", setupEmailRoutes(emailController));

    // Add database health endpoint
    app.get("/api/db-health", async (req, res) => {
      try {
        const health = await databaseService.healthCheck();
        const stats = await databaseService.getPatientStats();

        res.json({
          database: health,
          statistics: stats,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        res.status(500).json({
          database: { status: "unhealthy", error: error.message },
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Root endpoint
    app.get("/", (req, res) => {
      res.json({
        message: "Dental Email Sender API with Database",
        version: "2.0.0",
        features: [
          "Patient registration with database storage",
          "Medical history tracking",
          "HIPAA-compliant audit logging",
          "Email communication tracking",
        ],
        endpoints: {
          health: "/api/health",
          databaseHealth: "/api/db-health",
          sendMedicalForm: "/api/send-medical-form",
          sendPatientQuestionnaire: "/api/send-patient-questionnaire",
          documentation: "/swagger",
        },
      });
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("🔄 SIGTERM received, shutting down gracefully...");
      await databaseService.close();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("🔄 SIGINT received, shutting down gracefully...");
      await databaseService.close();
      process.exit(0);
    });

    app.listen(PORT, () => {
      console.log(`\n🚀 Dental Email Sender API running on port ${PORT}`);
      console.log(`   📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(
        `   🗄️  Database health: http://localhost:${PORT}/api/db-health`
      );
      console.log(`   📚 API Documentation: http://localhost:${PORT}/swagger`);
      console.log(`   🌐 Root endpoint: http://localhost:${PORT}/\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
