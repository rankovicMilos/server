export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      patient_audit_logs: {
        Row: {
          action: string
          description: string | null
          id: string
          ipAddress: string | null
          newValues: Json | null
          oldValues: Json | null
          patientId: string
          recordId: string | null
          tableName: string
          timestamp: string
          userAgent: string | null
          userId: string | null
          userName: string | null
        }
        Insert: {
          action: string
          description?: string | null
          id: string
          ipAddress?: string | null
          newValues?: Json | null
          oldValues?: Json | null
          patientId: string
          recordId?: string | null
          tableName: string
          timestamp?: string
          userAgent?: string | null
          userId?: string | null
          userName?: string | null
        }
        Update: {
          action?: string
          description?: string | null
          id?: string
          ipAddress?: string | null
          newValues?: Json | null
          oldValues?: Json | null
          patientId?: string
          recordId?: string | null
          tableName?: string
          timestamp?: string
          userAgent?: string | null
          userId?: string | null
          userName?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_audit_logs_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_documents: {
        Row: {
          accessLevel: string
          description: string | null
          documentType: string
          fileName: string
          filePath: string
          fileSize: number
          fileType: string
          id: string
          isEncrypted: boolean
          originalName: string
          patientId: string
          uploadedAt: string
          uploadedBy: string | null
        }
        Insert: {
          accessLevel?: string
          description?: string | null
          documentType: string
          fileName: string
          filePath: string
          fileSize: number
          fileType: string
          id: string
          isEncrypted?: boolean
          originalName: string
          patientId: string
          uploadedAt?: string
          uploadedBy?: string | null
        }
        Update: {
          accessLevel?: string
          description?: string | null
          documentType?: string
          fileName?: string
          filePath?: string
          fileSize?: number
          fileType?: string
          id?: string
          isEncrypted?: boolean
          originalName?: string
          patientId?: string
          uploadedAt?: string
          uploadedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_medical_data: {
        Row: {
          bleedingDisorders: string
          bleedsLongerAfterCuts: string
          bronchialAsthma: boolean
          chronicDiseases: string
          cigarettesPerDay: number
          createdAt: string
          currentMedications: string
          dateOfBirth: string | null
          drinksAlcoholDaily: boolean
          email: string | null
          epilepsy: boolean
          firstName: string
          hypercoagulableState: boolean
          hypertension: boolean
          id: string
          implants: string
          infectionHistory: string
          jaundice: boolean
          lastName: string
          otherDiseases: string
          pastIllnesses: string
          pepticUlcerSites: string
          phone: string | null
          surgeriesHistory: string
          tuberculosisHistory: string
          updatedAt: string
          usesDrugs: boolean
        }
        Insert: {
          bleedingDisorders?: string
          bleedsLongerAfterCuts?: string
          bronchialAsthma?: boolean
          chronicDiseases?: string
          cigarettesPerDay?: number
          createdAt?: string
          currentMedications?: string
          dateOfBirth?: string | null
          drinksAlcoholDaily?: boolean
          email?: string | null
          epilepsy?: boolean
          firstName: string
          hypercoagulableState?: boolean
          hypertension?: boolean
          id: string
          implants?: string
          infectionHistory?: string
          jaundice?: boolean
          lastName: string
          otherDiseases?: string
          pastIllnesses?: string
          pepticUlcerSites?: string
          phone?: string | null
          surgeriesHistory?: string
          tuberculosisHistory?: string
          updatedAt: string
          usesDrugs?: boolean
        }
        Update: {
          bleedingDisorders?: string
          bleedsLongerAfterCuts?: string
          bronchialAsthma?: boolean
          chronicDiseases?: string
          cigarettesPerDay?: number
          createdAt?: string
          currentMedications?: string
          dateOfBirth?: string | null
          drinksAlcoholDaily?: boolean
          email?: string | null
          epilepsy?: boolean
          firstName?: string
          hypercoagulableState?: boolean
          hypertension?: boolean
          id?: string
          implants?: string
          infectionHistory?: string
          jaundice?: boolean
          lastName?: string
          otherDiseases?: string
          pastIllnesses?: string
          pepticUlcerSites?: string
          phone?: string | null
          surgeriesHistory?: string
          tuberculosisHistory?: string
          updatedAt?: string
          usesDrugs?: boolean
        }
        Relationships: []
      }
      patients: {
        Row: {
          city: string
          country: string
          createdAt: string
          dateOfBirth: string | null
          email: string
          emergencyContactName: string
          emergencyContactPhone: string
          emergencyContactRelationship: string
          firstName: string
          gender: string | null
          id: string
          isActive: boolean
          isHipaaConsent: boolean
          isTermsAccepted: boolean
          lastName: string
          phone: string | null
          referralChannel: string
          referralChannelDetails: string
          streetAddress: string
          updatedAt: string
          zipCode: string
        }
        Insert: {
          city: string
          country: string
          createdAt?: string
          dateOfBirth?: string | null
          email: string
          emergencyContactName: string
          emergencyContactPhone: string
          emergencyContactRelationship: string
          firstName: string
          gender?: string | null
          id: string
          isActive?: boolean
          isHipaaConsent: boolean
          isTermsAccepted: boolean
          lastName: string
          phone?: string | null
          referralChannel: string
          referralChannelDetails: string
          streetAddress: string
          updatedAt: string
          zipCode: string
        }
        Update: {
          city?: string
          country?: string
          createdAt?: string
          dateOfBirth?: string | null
          email?: string
          emergencyContactName?: string
          emergencyContactPhone?: string
          emergencyContactRelationship?: string
          firstName?: string
          gender?: string | null
          id?: string
          isActive?: boolean
          isHipaaConsent?: boolean
          isTermsAccepted?: boolean
          lastName?: string
          phone?: string | null
          referralChannel?: string
          referralChannelDetails?: string
          streetAddress?: string
          updatedAt?: string
          zipCode?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
