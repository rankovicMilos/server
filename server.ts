import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";
import dotenv from "dotenv";

// Import services and controllers;
import EmailController from "./controllers/EmailController";
import DatabaseService from "./services/DatabaseService";
import PatientService from "./services/PatientService";
import EmailService from "./services/EmailService";
import setupEmailRoutes from "./routes/emailRoutes";
import swaggerSpec from "./swagger/swagger";

dotenv.config();

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

// CORS configuration for Vercel deployment
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://dental-form-vert.vercel.app", // ✅ add this
      process.env.FRONTEND_URL,
    ].filter(Boolean) as string[];

    console.log(`🌐 CORS Check - Origin: ${origin || "no origin"}`);
    console.log(`🌐 Allowed Origins: ${allowedOrigins.join(", ")}`);

    if (!origin) return callback(null, true); // Postman/curl etc.

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // (Optional) allow Vercel preview URLs
    const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
    if (vercelPreview.test(origin)) return callback(null, true);

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 200,
};

// ✅ apply the correct options
app.use(cors(corsOptions));

// (optional but nice) ensure Vary header for caches
app.use((req, res, next) => {
  res.header("Vary", "Origin");
  next();
});

// ✅ handle preflight quickly
app.options("*", cors(corsOptions));
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
    app.get("/api/db-health", async (req: Request, res: Response) => {
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
          database: { status: "unhealthy", error: (error as Error).message },
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Root endpoint
    app.get("/", (req: Request, res: Response) => {
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
