import {
  PrismaClient,
  PatientMarketingData,
  PatientDocument,
  PatientAuditLog,
  Prisma,
} from "@prisma/client";

interface HealthCheckResult {
  status: "healthy" | "unhealthy";
  timestamp: string;
  error?: string;
}

interface PatientStats {
  totalPatients: number;
  activePatients: number;
  totalDocuments: number;
  totalAuditLogs: number;
}

interface PatientWithDocuments extends PatientMarketingData {
  documents: PatientDocument[];
}

export default class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }

  // Initialize database connection
  async initialize(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  // Close database connection
  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }

  // Patient operations
  async createPatient(
    patientData: Prisma.PatientMarketingDataCreateInput
  ): Promise<PatientMarketingData> {
    try {
      const patient = await this.prisma.patientMarketingData.create({
        data: patientData,
      });
      await this.logPatientAction(
        patient.id,
        "create",
        "patients",
        patient.id,
        null,
        patient
      );
      return patient;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  }

  async findPatientByEmail(
    email: string
  ): Promise<PatientWithDocuments | null> {
    try {
      return await this.prisma.patientMarketingData.findUnique({
        where: { email },
        include: {
          documents: true,
        },
      });
    } catch (error) {
      console.error("Error finding patient by email:", error);
      throw error;
    }
  }

  async updatePatient(
    id: string,
    updateData: Prisma.PatientMarketingDataUpdateInput
  ): Promise<PatientMarketingData> {
    try {
      const oldPatient = await this.prisma.patientMarketingData.findUnique({
        where: { id },
      });
      const updatedPatient = await this.prisma.patientMarketingData.update({
        where: { id },
        data: updateData,
      });
      await this.logPatientAction(
        id,
        "update",
        "patients",
        id,
        oldPatient,
        updatedPatient
      );
      return updatedPatient;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  }

  // Document operations
  async createDocument(
    patientId: string,
    documentData: Omit<
      Prisma.PatientDocumentCreateInput,
      "patientMarketingData"
    >
  ): Promise<PatientDocument> {
    try {
      const document = await this.prisma.patientDocument.create({
        data: {
          ...documentData,
          patientId,
        },
      });

      await this.logPatientAction(
        patientId,
        "create",
        "patient_documents",
        document.id,
        null,
        document
      );
      return document;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  // Audit logging
  async logPatientAction(
    patientId: string,
    action: string,
    tableName: string,
    recordId: string,
    oldValues: any = null,
    newValues: any = null,
    userId: string | null = null
  ): Promise<void> {
    try {
      await this.prisma.patientAuditLog.create({
        data: {
          patientId,
          action,
          tableName,
          recordId,
          oldValues: oldValues ? JSON.stringify(oldValues) : Prisma.JsonNull,
          newValues: newValues ? JSON.stringify(newValues) : Prisma.JsonNull,
          userId,
          description: `${action.toUpperCase()} operation on ${tableName}`,
        },
      });
    } catch (error) {
      console.error("Error logging patient action:", error);
      // Don't throw error for audit logging failures to avoid breaking main operations
    }
  }

  // Utility methods
  async getPatientStats(): Promise<PatientStats> {
    try {
      const [totalPatients, activePatients, totalDocuments, totalAuditLogs] =
        await Promise.all([
          this.prisma.patientMarketingData.count(),
          this.prisma.patientMarketingData.count({ where: { isActive: true } }),
          this.prisma.patientDocument.count(),
          this.prisma.patientAuditLog.count(),
        ]);

      return {
        totalPatients,
        activePatients,
        totalDocuments,
        totalAuditLogs,
      };
    } catch (error) {
      console.error("Error getting patient stats:", error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<HealthCheckResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "healthy", timestamp: new Date().toISOString() };
    } catch (error) {
      console.error("Database health check failed:", error);
      return {
        status: "unhealthy",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
