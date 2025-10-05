const { PrismaClient } = require("@prisma/client");

class DatabaseService {
  constructor() {
    this.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }

  // Initialize database connection
  async initialize() {
    try {
      await this.prisma.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  // Close database connection
  async close() {
    await this.prisma.$disconnect();
  }

  // Patient operations
  async createPatient(patientData) {
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

  async findPatientByEmail(email) {
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

  async updatePatient(id, updateData) {
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
  async createDocument(documentData) {
    try {
      const document = await this.prisma.patientDocument.create({
        data: documentData,
      });
      await this.logPatientAction(
        documentData.patientId,
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
    patientId,
    action,
    tableName,
    recordId,
    oldValues,
    newValues,
    userId = null
  ) {
    try {
      await this.prisma.patientAuditLog.create({
        data: {
          patientId,
          action,
          tableName,
          recordId,
          oldValues: oldValues ? JSON.stringify(oldValues) : null,
          newValues: newValues ? JSON.stringify(newValues) : null,
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
  async getPatientStats() {
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
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "healthy", timestamp: new Date().toISOString() };
    } catch (error) {
      console.error("Database health check failed:", error);
      return {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

module.exports = DatabaseService;
