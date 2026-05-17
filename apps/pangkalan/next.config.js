// Konfigurasi Next.js untuk app pangkalan — offline-first
// IndexedDB + Workbox dikonfigurasi di Task 4.1
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  // Strategi cache akan didetailkan di Task 4.1
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sigas/ui', '@sigas/types', '@sigas/utils', '@sigas/totp'],
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_APP_PANGKALAN_URL ?? 'localhost:3001'],
    },
  },
}

module.exports = withPWA(nextConfig)
