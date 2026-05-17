import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SIGAS — Pangkalan',
  description: 'Sistem Informasi Gas Subsidi — Aplikasi Pangkalan',
  manifest: '/manifest.json',
  themeColor: '#22c55e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
