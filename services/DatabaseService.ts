import { randomUUID } from "crypto";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "../types/supabase";
import { createSupabaseClient } from "./supabaseClient";

type PatientMarketingData = Tables<"patients">;
type PatientMedicalData = Tables<"patient_medical_data">;
type PatientDocument = Tables<"patient_documents">;

interface HealthCheckResult {
  status: "healthy" | "unhealthy";
  timestamp: string;
  error?: string;
}

export default class DatabaseService {
  private readonly supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createSupabaseClient();
  }

  // Verify connectivity (called once per warm serverless instance)
  async initialize(): Promise<void> {
    const { error } = await this.supabase
      .from("patients")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
    console.log("✅ Database connected successfully");
  }

  // No persistent connection to tear down with the HTTP-based client
  async close(): Promise<void> {}

  // Patient operations
  async createPatient(
    patientData: Omit<
      TablesInsert<"patients">,
      "id" | "createdAt" | "updatedAt"
    >,
  ): Promise<PatientMarketingData> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("patients")
      .insert({
        id: randomUUID(),
        ...patientData,
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating patient:", error);
      throw error;
    }

    await this.logPatientAction(
      data.id,
      "create",
      "patients",
      data.id,
      null,
      data,
    );
    return data;
  }

  async findPatientByEmail(
    email: string,
  ): Promise<PatientMarketingData | null> {
    const { data, error } = await this.supabase
      .from("patients")
      .select()
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error finding patient by email:", error);
      throw error;
    }
    return data;
  }

  async updatePatient(
    id: string,
    updateData: TablesUpdate<"patients">,
  ): Promise<PatientMarketingData> {
    const { data: oldPatient } = await this.supabase
      .from("patients")
      .select()
      .eq("id", id)
      .maybeSingle();

    const { data, error } = await this.supabase
      .from("patients")
      .update({ ...updateData, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating patient:", error);
      throw error;
    }

    await this.logPatientAction(id, "update", "patients", id, oldPatient, data);
    return data;
  }

  // Medical data operations
  async createMedicalData(
    medicalData: Omit<
      TablesInsert<"patient_medical_data">,
      "id" | "createdAt" | "updatedAt"
    >,
  ): Promise<PatientMedicalData> {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase
      .from("patient_medical_data")
      .insert({
        id: randomUUID(),
        ...medicalData,
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating medical data:", error);
      throw error;
    }
    return data;
  }

  async findMedicalDataByEmail(
    email: string,
  ): Promise<PatientMedicalData | null> {
    const { data, error } = await this.supabase
      .from("patient_medical_data")
      .select()
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error finding medical data by email:", error);
      throw error;
    }
    return data;
  }

  async updateMedicalData(
    id: string,
    updateData: TablesUpdate<"patient_medical_data">,
  ): Promise<PatientMedicalData> {
    const { data, error } = await this.supabase
      .from("patient_medical_data")
      .update({ ...updateData, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating medical data:", error);
      throw error;
    }
    return data;
  }

  // Document operations
  // Upload the file to the storage bucket first, then record it in the database.
  async createDocument(
    patientId: string,
    documentData: Omit<
      TablesInsert<"patient_documents">,
      "id" | "patientId" | "uploadedAt"
    >,
    fileContent: Buffer,
  ): Promise<PatientDocument> {
    await this.uploadToBucket(
      documentData.filePath,
      fileContent,
      documentData.fileType,
    );

    const { data, error } = await this.supabase
      .from("patient_documents")
      .insert({ id: randomUUID(), patientId, ...documentData })
      .select()
      .single();

    if (error) {
      console.error("Error creating document:", error);
      throw error;
    }

    await this.logPatientAction(
      patientId,
      "create",
      "patient_documents",
      data.id,
      null,
      data,
    );
    return data;
  }

  // Audit logging
  async logPatientAction(
    patientId: string,
    action: string,
    tableName: string,
    recordId: string,
    oldValues: any = null,
    newValues: any = null,
    userId: string | null = null,
  ): Promise<void> {
    const { error } = await this.supabase.from("patient_audit_logs").insert({
      id: randomUUID(),
      patientId,
      action,
      tableName,
      recordId,
      oldValues: oldValues ?? null,
      newValues: newValues ?? null,
      userId,
      description: `${action.toUpperCase()} operation on ${tableName}`,
    });

    if (error) {
      console.error("Error logging patient action:", error);
      // Don't throw error for audit logging failures to avoid breaking main operations
    }
  }

  // Health check
  async healthCheck(): Promise<HealthCheckResult> {
    const { error } = await this.supabase
      .from("patients")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Database health check failed:", error);
      return {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
    return { status: "healthy", timestamp: new Date().toISOString() };
  }

  async uploadToBucket(
    filePath: string,
    fileContent: Buffer,
    contentType: string,
  ): Promise<void> {
    const bucketName = process.env.STORAGE_BUCKET_NAME || "signatures";
    const { error } = await this.supabase.storage
      .from(bucketName)
      .upload(filePath, fileContent, { contentType, upsert: true });

    if (error) {
      console.error("Error uploading file to storage bucket:", error);
      throw error;
    }
  }
}
