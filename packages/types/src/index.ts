// ============================================================
// @sigas/types — Shared TypeScript types untuk seluruh monorepo
// Diisi bertahap sesuai task yang diimplementasikan
// ============================================================

// --- Enum Role ---
export type UserRole = 'warga' | 'pangkalan' | 'agen' | 'admin'

// --- API Response wrapper ---
export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// --- Database types (akan diexpand di Task 1.x) ---
export interface Agen {
  id: string
  nama: string
  kode_agen: string
  created_at: string
}

export interface Pangkalan {
  id: string
  agen_id: string
  nama: string
  alamat: string
  lat: number
  lng: number
  kuota_mingguan: number
  created_at: string
}

export interface KartuKeluarga {
  id: string
  no_kk_hash: string   // HMAC hash dari no_kk asli
  kelurahan_id: string
  pangkalan_id: string
  jumlah_anggota: number
  kuota_tabung: number
  created_at: string
}

export interface Warga {
  id: string
  kk_id: string
  nik_hash: string      // HMAC hash dari NIK asli
  nama_encrypted: string // AES-256-GCM
  is_kepala_keluarga: boolean
  created_at: string
}

export interface Transaksi {
  id: string
  pangkalan_id: string
  kk_id: string
  warga_id: string
  jumlah_tabung: number
  harga_satuan: number
  total_harga: number
  tipe: 'reservasi' | 'walk_in'
  status: 'pending' | 'selesai' | 'hangus'
  created_at: string
}

// --- TOTP ---
export interface TOTPPayload {
  nik_hash: string
  kk_id: string
  timestamp: number   // Unix epoch seconds
  hmac: string
}
