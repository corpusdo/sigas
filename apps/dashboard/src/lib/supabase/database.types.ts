// File ini di-generate otomatis oleh Supabase CLI setelah migration dibuat (Task 1.x)
// Generate ulang dengan: pnpm supabase gen types typescript --local > src/lib/supabase/database.types.ts
//
// Untuk sekarang (Task 0.2), ini adalah placeholder agar TypeScript tidak error.
// Akan diganti dengan types generated di Task 1.1+

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Tabel-tabel akan muncul di sini setelah Task 1.x selesai
      // Contoh struktur:
      // agen: {
      //   Row: { id: string; nama: string; ... }
      //   Insert: { id?: string; nama: string; ... }
      //   Update: { id?: string; nama?: string; ... }
      // }
      [tableName: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Views: {
      [viewName: string]: {
        Row: Record<string, unknown>
      }
    }
    Functions: {
      [functionName: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [enumName: string]: string
    }
  }
}
