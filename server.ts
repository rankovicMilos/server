import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";
import dotenv from "dotenv";

// Import services and controllers;
import EmailController from "./controllers/EmailController";
import DatabaseService from "./services/DatabaseService";
import PatientService from "./services/PatientService";
import MedicalService from "./services/MedicalService";
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
      "https://dental-form-vert.vercel.app",
      "https://intake-form.confidentclinic.com",
      "https://medical-form.confidentclinic.com",
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
  const databaseService = new DatabaseService();

  try {
    await databaseService.initialize();
    const dbHealth = await databaseService.healthCheck();
    console.log(
      `   🗄️  Database: ${dbHealth.status === "healthy" ? "✅" : "❌"}`,
    );
  } catch (error) {
    console.error("❌ Database init failed:", error);
  }

  const patientService = new PatientService(databaseService);
  const medicalService = new MedicalService(databaseService);
  const emailService = new EmailService(patientService, medicalService);

  try {
    emailService.isConfigured();
    await emailService.verifyConnection();
  } catch (error) {
    console.error("❌ Email service init failed:", error);
  }

  const emailController = new EmailController(emailService);
  return { emailController, databaseService };
}

function setupRoutes(
  emailController: EmailController,
  databaseService: DatabaseService,
) {
  app.use("/api", setupEmailRoutes(emailController));

  app.get("/api/db-health", async (_req: Request, res: Response) => {
    try {
      const health = await databaseService.healthCheck();
      res.json({ database: health, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({
        database: { status: "unhealthy", error: (error as Error).message },
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.get("/", (_req: Request, res: Response) => {
    res.json({
      message: "Dental Email Sender API with Database",
      version: "2.0.0",
      endpoints: {
        health: "/api/health",
        databaseHealth: "/api/db-health",
        sendMedicalForm: "/api/send-medical-form",
        sendPatientQuestionnaire: "/api/send-patient-questionnaire",
        documentation: "/swagger",
      },
    });
  });
}

// Lazy initialization for serverless environments
let initPromise: Promise<void> | null = null;

function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = initializeServices()
      .then(({ emailController, databaseService }) => {
        setupRoutes(emailController, databaseService);

        process.on("SIGTERM", async () => {
          await databaseService.close();
          process.exit(0);
        });
        process.on("SIGINT", async () => {
          await databaseService.close();
          process.exit(0);
        });
      })
      .catch((error) => {
        initPromise = null; // allow retry on next request
        throw error;
      });
  }
  return initPromise;
}

// Vercel serverless export — CORS middleware always runs even if init fails
export default async function handler(req: Request, res: Response) {
  try {
    await ensureInitialized();
  } catch (error) {
    console.error("❌ Initialization failed:", error);
  }
  return app(req as any, res as any);
}

// Local development — start the HTTP server directly
if (!process.env.VERCEL) {
  ensureInitialized()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`\n🚀 Dental Email Sender API running on port ${PORT}`);
        console.log(`   📊 Health check: http://localhost:${PORT}/api/health`);
        console.log(
          `   🗄️  Database health: http://localhost:${PORT}/api/db-health`,
        );
        console.log(
          `   📚 API Documentation: http://localhost:${PORT}/swagger`,
        );
        console.log(`   🌐 Root endpoint: http://localhost:${PORT}/\n`);
      });
    })
    .catch((error) => {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    });
}
