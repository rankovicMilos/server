import mysql, { Connection, Pool } from "mysql2/promise";
import dotenv from "dotenv";
import PatientMarketingData from "../models/PatientMarketingData";

dotenv.config();

interface HealthCheckResult {
  status: "healthy" | "unhealthy";
  timestamp: string;
  error?: string;
}

interface PatientDocument {
  id: string;
  patientId: string;
  documentType: string;
  documentPath: string;
  fileName?: string;
  originalName?: string;
  fileType?: string;
  fileSize?: number;
  filePath?: string;
  uploadedAt?: Date;
  createdAt: Date;
}

export default class MySqlMarketingDatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT || "3306"),
      user: process.env.DATABASE_USER || "",
      password: process.env.DATABASE_PASSWORD || "",
      database: process.env.DATABASE_NAME || "",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // Initialize database connection
  async initialize(): Promise<void> {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      console.log("✅ MySQL Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  // Close database connection
  async close(): Promise<void> {
    await this.pool.end();
  }

  // Patient operations
  async createPatient(
    patientData: PatientMarketingData
  ): Promise<PatientMarketingData> {
    const connection = await this.pool.getConnection();
    try {
      const query = `
        INSERT INTO patient_marketing_data 
        (id, firstName, lastName, email, phone, dateOfBirth, gender, streetAddress, city, country, zipCode, emergencyContactName, emergencyContactPhone, emergencyContactRelationship, referralChannel, referralChannelDetails, isHipaaConsent, isTermsAccepted, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const id = require("crypto").randomUUID();
      await connection.execute(query, [
        id,
        patientData.firstName,
        patientData.lastName,
        patientData.email,
        patientData.phone || null,
        patientData.dateOfBirth || null,
        patientData.gender || null,
        patientData.address || null,
        patientData.city || null,
        patientData.country || null,
        patientData.zipCode || null,
        patientData.emergencyContactName || null,
        patientData.emergencyContactPhone || null,
        patientData.emergencyContactRelation || null,
        patientData.referralChannel || null,
        patientData.referralChannelDetails || null,
        patientData.isHipaaConsent ? true : false,
        patientData.isTermsAccepted ? true : false,
      ]);

      await this.logPatientAction(
        id,
        "create",
        "patient_marketing_data",
        id,
        null,
        patientData
      );

      return patientData;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async findPatientByEmail(
    email: string
  ): Promise<PatientMarketingData | null> {
    const connection = await this.pool.getConnection();
    try {
      const query = `
        SELECT * FROM patient_marketing_data WHERE email = ?
      `;
      const [rows] = await connection.execute(query, [email]);

      if (!rows || (rows as any[]).length === 0) {
        return null;
      }

      return (rows as PatientMarketingData[])[0];
    } catch (error) {
      console.error("Error finding patient by email:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async updatePatient(
    id: string,
    updateData: Partial<PatientMarketingData>
  ): Promise<PatientMarketingData> {
    const connection = await this.pool.getConnection();
    try {
      // Get old patient data for audit log
      const oldQuery = `SELECT * FROM patient_marketing_data WHERE id = ?`;
      const [oldRows] = await connection.execute(oldQuery, [id]);
      const oldPatient = (oldRows as PatientMarketingData[])[0] || null;

      // Build dynamic update query
      const updates: string[] = [];
      const values: any[] = [];

      Object.entries(updateData).forEach(([key, value]) => {
        updates.push(`${key} = ?`);
        values.push(value);
      });

      updates.push(`updatedAt = NOW()`);
      values.push(id);

      const query = `UPDATE patient_marketing_data SET ${updates.join(
        ", "
      )} WHERE id = ?`;

      await connection.execute(query, values);

      await this.logPatientAction(
        id,
        "update",
        "patient_marketing_data",
        id,
        oldPatient,
        updateData
      );

      return { ...oldPatient, ...updateData } as PatientMarketingData;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async createDocument(
    patientId: string,
    documentData: Omit<PatientDocument, "id" | "createdAt">
  ): Promise<PatientDocument> {
    const connection = await this.pool.getConnection();
    try {
      const id = require("crypto").randomUUID();
      const query = `
        INSERT INTO patient_documents 
        (id, patientId, documentType, documentPath, createdAt) 
        VALUES (?, ?, ?, ?, NOW())
      `;

      await connection.execute(query, [
        id,
        patientId,
        documentData.documentType,
        documentData.documentPath,
      ]);

      return {
        id,
        ...documentData,
        patientId,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async logPatientAction(
    patientId: string,
    action: string,
    tableName: string,
    recordId: string,
    oldValues: any = null,
    newValues: any = null,
    userId: string | null = null
  ): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      const logId = require("crypto").randomUUID();
      const query = `
        INSERT INTO audit_logs 
        (id, patientId, action, tableName, recordId, oldValues, newValues, userId, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      await connection.execute(query, [
        logId,
        patientId,
        action,
        tableName,
        recordId,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        userId || null,
      ]);
    } catch (error) {
      console.error("Error logging action:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();

      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
