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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      medical_records: {
        Row: {
          berat_badan: number | null
          catatan_dokter: string | null
          created_at: string | null
          dokter_id: string | null
          hasil_pemeriksaan: string | null
          id: string
          perawat_id: string | null
          tensi_darah: string | null
          tinggi_badan: number | null
          updated_at: string | null
          visit_id: string
        }
        Insert: {
          berat_badan?: number | null
          catatan_dokter?: string | null
          created_at?: string | null
          dokter_id?: string | null
          hasil_pemeriksaan?: string | null
          id?: string
          perawat_id?: string | null
          tensi_darah?: string | null
          tinggi_badan?: number | null
          updated_at?: string | null
          visit_id: string
        }
        Update: {
          berat_badan?: number | null
          catatan_dokter?: string | null
          created_at?: string | null
          dokter_id?: string | null
          hasil_pemeriksaan?: string | null
          id?: string
          perawat_id?: string | null
          tensi_darah?: string | null
          tinggi_badan?: number | null
          updated_at?: string | null
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_dokter_id_fkey"
            columns: ["dokter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_perawat_id_fkey"
            columns: ["perawat_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: true
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          created_at: string | null
          harga_satuan: number
          id: string
          nama_obat: string
          stok_sisa: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          harga_satuan: number
          id?: string
          nama_obat: string
          stok_sisa?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          harga_satuan?: number
          id?: string
          nama_obat?: string
          stok_sisa?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          alamat: string
          created_at: string | null
          id: string
          nama: string
          no_telp: string
          updated_at: string | null
        }
        Insert: {
          alamat: string
          created_at?: string | null
          id?: string
          nama: string
          no_telp: string
          updated_at?: string | null
        }
        Update: {
          alamat?: string
          created_at?: string | null
          id?: string
          nama?: string
          no_telp?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          admin_id: string | null
          biaya_obat: number
          biaya_pemeriksaan: number
          created_at: string | null
          id: string
          no_struk: string | null
          total_bayar: number
          visit_id: string
        }
        Insert: {
          admin_id?: string | null
          biaya_obat?: number
          biaya_pemeriksaan?: number
          created_at?: string | null
          id?: string
          no_struk?: string | null
          total_bayar: number
          visit_id: string
        }
        Update: {
          admin_id?: string | null
          biaya_obat?: number
          biaya_pemeriksaan?: number
          created_at?: string | null
          id?: string
          no_struk?: string | null
          total_bayar?: number
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: true
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_details: {
        Row: {
          created_at: string | null
          dosis: string
          id: string
          jumlah: number
          medicine_id: string
          prescription_id: string
        }
        Insert: {
          created_at?: string | null
          dosis: string
          id?: string
          jumlah: number
          medicine_id: string
          prescription_id: string
        }
        Update: {
          created_at?: string | null
          dosis?: string
          id?: string
          jumlah?: number
          medicine_id?: string
          prescription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_details_medicine_id_fkey"
            columns: ["medicine_id"]
            isOneToOne: false
            referencedRelation: "medicines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_details_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          apotek_id: string | null
          created_at: string | null
          id: string
          medical_record_id: string
          status: Database["public"]["Enums"]["prescription_status"] | null
          updated_at: string | null
        }
        Insert: {
          apotek_id?: string | null
          created_at?: string | null
          id?: string
          medical_record_id: string
          status?: Database["public"]["Enums"]["prescription_status"] | null
          updated_at?: string | null
        }
        Update: {
          apotek_id?: string | null
          created_at?: string | null
          id?: string
          medical_record_id?: string
          status?: Database["public"]["Enums"]["prescription_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_apotek_id_fkey"
            columns: ["apotek_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_medical_record_id_fkey"
            columns: ["medical_record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          nama: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id: string
          nama: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nama?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          pemilik_id: string | null
          tgl_laporan: string
          tipe: string
          total_pasien: number | null
          total_pendapatan: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pemilik_id?: string | null
          tgl_laporan: string
          tipe: string
          total_pasien?: number | null
          total_pendapatan?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pemilik_id?: string | null
          tgl_laporan?: string
          tipe?: string
          total_pasien?: number | null
          total_pendapatan?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_pemilik_id_fkey"
            columns: ["pemilik_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          admin_id: string | null
          created_at: string | null
          id: string
          keluhan: string | null
          patient_id: string
          status: Database["public"]["Enums"]["visit_status"] | null
          tgl_visit: string | null
          updated_at: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          keluhan?: string | null
          patient_id: string
          status?: Database["public"]["Enums"]["visit_status"] | null
          tgl_visit?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          keluhan?: string | null
          patient_id?: string
          status?: Database["public"]["Enums"]["visit_status"] | null
          tgl_visit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "dokter" | "perawat" | "apotek" | "pemilik"
      prescription_status: "menunggu" | "diproses" | "selesai"
      visit_status:
        | "menunggu"
        | "pemeriksaan_awal"
        | "konsultasi"
        | "apotek"
        | "selesai"
        | "batal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "dokter", "perawat", "apotek", "pemilik"],
      prescription_status: ["menunggu", "diproses", "selesai"],
      visit_status: [
        "menunggu",
        "pemeriksaan_awal",
        "konsultasi",
        "apotek",
        "selesai",
        "batal",
      ],
    },
  },
} as const
