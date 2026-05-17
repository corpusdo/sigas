# 99 — Implementation Log SIGAS
> File ini WAJIB dilampirkan di setiap chat baru bersama PRD.md + 00_summary.md
> Claude WAJIB mengupdate file ini setiap kali satu task selesai

---

## Status Terkini

**Phase aktif:** Phase 0 — Inisialisasi Project
**Task terakhir selesai:** Task 0.3 — Setup Vercel deployment (3 apps)
**Task berikutnya:** Task 0.4 — Setup Cloudflare DNS + SSL

---

## Struktur Folder Aktual

```
sigas/
├── apps/
│   ├── warga/
│   │   ├── src/lib/supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── database.types.ts
│   │   ├── middleware.ts
│   │   ├── vercel.json                   ← BARU Task 0.3
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── pangkalan/
│   │   ├── src/lib/supabase/
│   │   ├── middleware.ts
│   │   ├── vercel.json                   ← BARU Task 0.3
│   │   └── package.json
│   └── dashboard/
│       ├── src/lib/supabase/
│       ├── middleware.ts
│       ├── vercel.json                   ← BARU Task 0.3
│       └── package.json
├── packages/
│   ├── types/src/index.ts
│   ├── utils/src/index.ts
│   ├── totp/src/index.ts
│   └── ui/src/index.ts
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   ├── functions/
│   └── seed/
├── scripts/
│   └── generate-secrets.js
├── docs/
│   └── vercel-deploy-guide.md            ← BARU Task 0.3
├── .env.example
├── .gitignore
├── .npmrc
├── package.json                          ← DIUPDATE Task 0.3 (tambah scripts build:*)
├── pnpm-workspace.yaml
├── tsconfig.json
└── turbo.json
```

---

## Dependency Terinstall

```
Tidak ada dependency baru di Task 0.3 — hanya file konfigurasi.
```

---

## Environment Variables yang Sudah Diset

```
□ NEXT_PUBLIC_SUPABASE_URL
□ NEXT_PUBLIC_SUPABASE_ANON_KEY
□ SUPABASE_SERVICE_ROLE_KEY
□ SUPABASE_PROJECT_ID
□ ENCRYPTION_KEY          ← generate: pnpm generate-secrets
□ HMAC_SECRET             ← generate: pnpm generate-secrets
□ HASH_SALT               ← generate: pnpm generate-secrets
□ FCM_SERVER_KEY
□ NEXT_PUBLIC_FIREBASE_API_KEY
□ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
□ NEXT_PUBLIC_FIREBASE_PROJECT_ID
□ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
□ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
□ NEXT_PUBLIC_FIREBASE_APP_ID
□ NEXT_PUBLIC_FIREBASE_VAPID_KEY
□ UPSTASH_REDIS_REST_URL
□ UPSTASH_REDIS_REST_TOKEN
□ SENTRY_DSN
□ NEXT_PUBLIC_SENTRY_DSN
□ B2_APPLICATION_KEY_ID
□ B2_APPLICATION_KEY
□ B2_BUCKET_ID
□ B2_BUCKET_NAME
□ NEXT_PUBLIC_APP_WARGA_URL
□ NEXT_PUBLIC_APP_PANGKALAN_URL
□ NEXT_PUBLIC_APP_DASHBOARD_URL
```

---

## Keputusan Arsitektur yang Sudah Dikunci

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Monorepo | Turborepo + pnpm | Shared packages antar 3 apps |
| Database | Supabase (PostgreSQL 15) | RLS, Realtime, PostGIS, open source |
| Auth | Supabase Auth | Terintegrasi dengan RLS |
| Hosting | Vercel | Edge network, zero config, spending cap |
| Vercel struktur | 3 project terpisah | Setiap app punya URL, env vars, dan deployment sendiri |
| Vercel region | sin1 (Singapore) | Terdekat dengan Kota Bima (NTB) |
| Notifikasi | FCM | Gratis, reliable, topic-based |
| Rate limiting | Upstash Redis | Serverless, kompatibel Vercel Edge |
| Maps | Leaflet + OSM | Gratis, offline-capable |
| TOTP | otplib (RFC 6238) | Standard, server-side validation |
| Enkripsi | AES-256-GCM | Standar industri, Node built-in |
| Offline | IndexedDB + Workbox | PWA standard, no extra dependency |
| Container | Docker Compose | Portabilitas free tier → VPS |
| UI | shadcn/ui + Tailwind | Copy-paste, no lock-in |
| Supabase client | @supabase/ssr | Pengganti auth-helpers, support App Router cookies |

---

## Issues & Bug yang Ditemukan

```
[FIXED] turbo.json: pipeline → tasks (breaking change Turborepo 2.0)
```

---

## Log Implementasi

---
## [SELESAI] Task 0.1 — Setup monorepo (pnpm + Turborepo + TypeScript)
**Tanggal:** 2025-05-17

### File Dibuat
- Seluruh struktur monorepo: package.json root, pnpm-workspace.yaml, turbo.json, tsconfig.json
- 3 apps: warga (3000), pangkalan (3001), dashboard (3002)
- 4 packages: types, utils, totp, ui

### Dependency Baru
- turbo, typescript, next@14.2.3, next-pwa, otplib, qrcode, leaflet, @supabase/supabase-js, @tanstack/react-query, zustand, zod, react-hook-form, tailwindcss

### Catatan Penting
- packages/utils dan packages/totp adalah server-only — jangan import di Client Component
- turbo.json: gunakan `tasks` bukan `pipeline` (Turborepo 2.x)

---
## [SELESAI] Task 0.2 — Setup Supabase project + environment variables
**Tanggal:** 2025-05-17

### File Dibuat
- `supabase/config.toml`
- `apps/*/src/lib/supabase/client.ts` — createBrowserClient
- `apps/*/src/lib/supabase/server.ts` — createServerClient + createAdminClient
- `apps/*/src/lib/supabase/database.types.ts` — placeholder
- `apps/*/middleware.ts` — session refresh + route protection
- `scripts/generate-secrets.js`

### Dependency Baru
- `@supabase/ssr@^0.5.1`

### Catatan Penting
- Gunakan getUser() bukan getSession() di middleware
- database.types.ts di-generate ulang setelah tiap migration: `pnpm supabase:types`
- middleware.ts ada di root app (sejajar src/), bukan di dalam src/

---
## [SELESAI] Task 0.3 — Setup Vercel deployment (3 apps)
**Tanggal:** 2025-05-17

### File Dibuat
- `apps/warga/vercel.json` — build command filter warga, region sin1, security headers
- `apps/pangkalan/vercel.json` — build command filter pangkalan, camera permission (scanner)
- `apps/dashboard/vercel.json` — build command filter dashboard, X-Frame-Options SAMEORIGIN
- `docs/vercel-deploy-guide.md` — panduan step-by-step deploy 3 Vercel project

### File Dimodifikasi
- `package.json` root — tambah scripts: build:warga, build:pangkalan, build:dashboard, dev:*, generate-secrets, supabase:start, supabase:stop, supabase:types

### Keputusan Teknis
- **3 Vercel project terpisah** — Lebih fleksibel dari 1 project dengan rewrites; setiap app punya deployment history, env vars, dan domain sendiri
- **Region sin1 (Singapore)** — Region Vercel terdekat dari Indonesia; mengurangi latency untuk pengguna di Kota Bima
- **buildCommand: cd ../.. && pnpm turbo run build --filter** — Vercel by default tidak tahu tentang workspace root; perintah ini naik 2 level ke root monorepo sebelum build
- **`Permissions-Policy: camera=(self)`** di pangkalan — App pangkalan butuh kamera untuk scan barcode; policy ini mengizinkan akses kamera hanya dari origin sendiri
- **`X-Frame-Options: SAMEORIGIN`** di dashboard — Dashboard agen/admin mungkin butuh iframe untuk embed map; warga dan pangkalan pakai `DENY` karena tidak ada use case iframe

### Catatan Penting
- Setelah deploy, wajib update Supabase Auth Redirect URLs dengan URL Vercel yang baru
- Aktifkan Spending Cap di Vercel Billing ($0 limit) agar tidak ada tagihan tak terduga
- Saat buat Vercel project, pastikan Root Directory di-set ke apps/warga (atau pangkalan/dashboard) bukan root monorepo
- URL `NEXT_PUBLIC_APP_*` di env vars Vercel harus diupdate setelah tahu URL final tiap app, lalu Redeploy

---

*File ini adalah rekaman perjalanan pembangunan SIGAS.*
*Selalu update setelah setiap task selesai agar developer berikutnya bisa melanjutkan.*
