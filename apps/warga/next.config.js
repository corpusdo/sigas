// Konfigurasi Next.js untuk app warga dengan PWA
const withPWA = require('next-pwa')({
  dest: 'public',
  // Nonaktifkan service worker saat development agar tidak mengganggu HMR
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktifkan strict mode React untuk deteksi bug lebih awal
  reactStrictMode: true,
  transpilePackages: ['@sigas/ui', '@sigas/types', '@sigas/utils'],
  experimental: {
    // Diperlukan untuk App Router
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_APP_WARGA_URL ?? 'localhost:3000'],
    },
  },
}

module.exports = withPWA(nextConfig)
