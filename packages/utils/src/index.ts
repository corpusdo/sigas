// ============================================================
// @sigas/utils — Shared utilities untuk seluruh monorepo
// Kode kriptografi didetailkan di Task 7.1
// Geofencing (Haversine) didetailkan di Task 7.4
// ============================================================

import crypto from 'crypto'

// ---- Enkripsi AES-256-GCM ----

/**
 * Enkripsi string dengan AES-256-GCM.
 * Key harus 64 hex chars (32 bytes) dari env ENCRYPTION_KEY.
 * Mengembalikan format: iv:authTag:ciphertext (semua base64)
 */
export function encrypt(plaintext: string, keyHex: string): string {
  const key = Buffer.from(keyHex, 'hex')
  const iv = crypto.randomBytes(12)                       // 96-bit IV untuk GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  // Gabungkan iv:authTag:ciphertext agar mudah diparse
  return [iv, authTag, encrypted].map(b => b.toString('base64')).join(':')
}

/**
 * Dekripsi hasil dari encrypt().
 */
export function decrypt(payload: string, keyHex: string): string {
  const key = Buffer.from(keyHex, 'hex')
  const [ivB64, tagB64, encB64] = payload.split(':')
  if (!ivB64 || !tagB64 || !encB64) throw new Error('Format enkripsi tidak valid')
  const iv = Buffer.from(ivB64, 'base64')
  const authTag = Buffer.from(tagB64, 'base64')
  const encrypted = Buffer.from(encB64, 'base64')
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)
  return decipher.update(encrypted).toString('utf8') + decipher.final('utf8')
}

// ---- HMAC Hash (untuk NIK & No.KK) ----

/**
 * Buat HMAC-SHA256 dari input.
 * Digunakan untuk indexing NIK / No.KK tanpa menyimpan plaintext.
 * Key dari env HMAC_SECRET.
 */
export function hmacHash(input: string, secretHex: string): string {
  return crypto
    .createHmac('sha256', Buffer.from(secretHex, 'hex'))
    .update(input)
    .digest('hex')
}

// ---- Geofencing Haversine (digunakan di Task 7.4) ----

/**
 * Hitung jarak antara dua titik koordinat dalam meter.
 * Digunakan untuk validasi geofencing pangkalan.
 */
export function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6_371_000 // radius bumi dalam meter
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Cek apakah posisi user dalam radius pangkalan (default 500 meter).
 */
export function isWithinGeofence(
  userLat: number, userLng: number,
  pangkalanLat: number, pangkalanLng: number,
  radiusMeters = 500,
): boolean {
  return haversineMeters(userLat, userLng, pangkalanLat, pangkalanLng) <= radiusMeters
}

// ---- Format helpers ----

/** Format angka ke format Rupiah tanpa simbol */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount)
}

/** Format tanggal ke format Indonesia */
export function formatTanggal(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}
