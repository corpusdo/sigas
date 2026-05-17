// ============================================================
// @sigas/totp — TOTP logic sesuai RFC 6238 menggunakan otplib
// Validasi server-side diimplementasikan di Edge Function Task 2.1
// ============================================================

import { totp, authenticator } from 'otplib'
import QRCode from 'qrcode'
import { hmacHash } from '@sigas/utils'
import type { TOTPPayload } from '@sigas/types'

// Konfigurasi TOTP SIGAS:
// - Window 1 = toleransi ±30 detik (1 periode sebelum & sesudah)
// - Step 30 detik sesuai RFC 6238 standar
totp.options = {
  step: 30,
  window: 1,
  digits: 6,
}

/**
 * Generate secret TOTP untuk satu warga.
 * Secret disimpan ter-enkripsi di DB, BUKAN plaintext.
 * Biasanya dipanggil saat registrasi warga.
 */
export function generateTOTPSecret(): string {
  return authenticator.generateSecret(20) // 20 bytes = 160 bits, RFC 4226 recommendation
}

/**
 * Generate kode TOTP saat ini dari secret.
 * Dipanggil di sisi client (App Warga).
 */
export function generateTOTPCode(secret: string): string {
  return totp.generate(secret)
}

/**
 * Validasi kode TOTP.
 * HARUS selalu dipanggil di server (Edge Function), bukan client.
 */
export function validateTOTPCode(code: string, secret: string): boolean {
  return totp.check(code, secret)
}

/**
 * Sisa waktu (detik) sebelum kode TOTP saat ini expired.
 * Digunakan untuk countdown timer di UI warga.
 */
export function getRemainingSeconds(): number {
  const step = 30
  return step - (Math.floor(Date.now() / 1000) % step)
}

/**
 * Buat payload TOTP yang akan di-encode ke QR code.
 * Payload berisi NIK hash + KK ID + timestamp + HMAC untuk anti-tampering.
 */
export function buildTOTPPayload(
  nikPlain: string,
  kkId: string,
  hmacSecretHex: string,
): TOTPPayload {
  const timestamp = Math.floor(Date.now() / 1000)
  const nikHash = hmacHash(nikPlain, hmacSecretHex)
  const data = `${nikHash}:${kkId}:${timestamp}`
  const hmac = hmacHash(data, hmacSecretHex)
  return { nik_hash: nikHash, kk_id: kkId, timestamp, hmac }
}

/**
 * Verifikasi HMAC dalam TOTPPayload.
 * Digunakan di Edge Function validate-totp.
 */
export function verifyTOTPPayload(
  payload: TOTPPayload,
  hmacSecretHex: string,
  maxAgeSecs = 60,  // payload hangus setelah 60 detik
): boolean {
  const now = Math.floor(Date.now() / 1000)
  // Cek apakah timestamp masih dalam window
  if (Math.abs(now - payload.timestamp) > maxAgeSecs) return false
  // Rekonstruksi data & bandingkan HMAC
  const data = `${payload.nik_hash}:${payload.kk_id}:${payload.timestamp}`
  const expectedHmac = hmacHash(data, hmacSecretHex)
  return payload.hmac === expectedHmac
}

/**
 * Generate QR code sebagai data URL (untuk ditampilkan di App Warga).
 * Payload di-encode sebagai JSON string.
 */
export async function generateQRDataUrl(payload: TOTPPayload): Promise<string> {
  const json = JSON.stringify(payload)
  return QRCode.toDataURL(json, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 280,
    color: {
      dark: '#15803d',  // Warna brand SIGAS
      light: '#ffffff',
    },
  })
}
