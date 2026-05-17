/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sigas/ui', '@sigas/types', '@sigas/utils'],
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_APP_DASHBOARD_URL ?? 'localhost:3002'],
    },
  },
}

module.exports = nextConfig
