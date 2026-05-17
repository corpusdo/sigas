# Panduan Deploy SIGAS ke Vercel

Karena SIGAS adalah monorepo dengan 3 app, kita buat **3 Vercel project terpisah**.
Setiap project diarahkan ke subdirektori app-nya masing-masing.

---

## Prasyarat

- Akun Vercel (vercel.com) — free tier cukup untuk awal
- Repository GitHub sudah dibuat dan kode sudah di-push
- Supabase project sudah aktif (Task 0.2)
- `.env.local` sudah diisi dengan nilai yang benar

---

## Langkah 1 — Push ke GitHub

```bash
# Di root project sigas/
git init
git add .
git commit -m "feat: initial monorepo setup (Task 0.1-0.2)"

# Buat repo baru di GitHub (jangan init dengan README)
# lalu:
git remote add origin https://github.com/USERNAME/sigas.git
git branch -M main
git push -u origin main
```

---

## Langkah 2 — Buat Project Vercel: App Warga

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **Import Git Repository** → pilih repo `sigas`
3. Isi konfigurasi:
   - **Project Name:** `sigas-warga`
   - **Framework Preset:** Next.js (auto-detect)
   - **Root Directory:** klik **Edit** → ketik `apps/warga` → Save
4. Buka **Environment Variables** → tambahkan semua variabel di bawah
5. Klik **Deploy**

### Environment Variables — App Warga

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJ... |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJ... |
| `ENCRYPTION_KEY` | (dari generate-secrets.js) |
| `HMAC_SECRET` | (dari generate-secrets.js) |
| `HASH_SALT` | (dari generate-secrets.js) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | (isi setelah Task 8.1) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | (isi setelah Task 8.1) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | (isi setelah Task 8.1) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | (isi setelah Task 8.1) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | (isi setelah Task 8.1) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | (isi setelah Task 8.1) |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | (isi setelah Task 8.1) |
| `UPSTASH_REDIS_REST_URL` | (isi setelah Task 7.3) |
| `UPSTASH_REDIS_REST_TOKEN` | (isi setelah Task 7.3) |
| `NEXT_PUBLIC_SENTRY_DSN` | (isi setelah Task 0.5) |
| `NEXT_PUBLIC_APP_WARGA_URL` | https://sigas-warga.vercel.app |
| `NEXT_PUBLIC_APP_PANGKALAN_URL` | https://sigas-pangkalan.vercel.app |
| `NEXT_PUBLIC_APP_DASHBOARD_URL` | https://sigas-dashboard.vercel.app |

---

## Langkah 3 — Buat Project Vercel: App Pangkalan

1. Kembali ke [vercel.com/new](https://vercel.com/new)
2. Import repo `sigas` yang sama
3. Isi konfigurasi:
   - **Project Name:** `sigas-pangkalan`
   - **Root Directory:** `apps/pangkalan`
4. Environment Variables sama seperti warga, **tambah**:
   - `FCM_SERVER_KEY` — (isi setelah Task 8.1)
5. Klik **Deploy**

---

## Langkah 4 — Buat Project Vercel: Dashboard

1. Kembali ke [vercel.com/new](https://vercel.com/new)
2. Import repo `sigas` yang sama
3. Isi konfigurasi:
   - **Project Name:** `sigas-dashboard`
   - **Root Directory:** `apps/dashboard`
4. Environment Variables sama seperti warga, **tambah**:
   - `SENTRY_DSN` — (isi setelah Task 0.5)
   - `B2_APPLICATION_KEY_ID` — (isi setelah Task 7.8)
   - `B2_APPLICATION_KEY` — (isi setelah Task 7.8)
   - `B2_BUCKET_ID` — (isi setelah Task 7.8)
   - `B2_BUCKET_NAME` — (isi setelah Task 7.8)
5. Klik **Deploy**

---

## Langkah 5 — Update Supabase Auth Redirect URLs

Setelah ketiga app berhasil deploy dan punya URL permanen:

1. Buka [supabase.com](https://supabase.com) → Project → **Authentication** → **URL Configuration**
2. **Site URL:** `https://sigas-warga.vercel.app`
3. **Redirect URLs** — tambahkan semua:
   ```
   https://sigas-warga.vercel.app/**
   https://sigas-pangkalan.vercel.app/**
   https://sigas-dashboard.vercel.app/**
   http://localhost:3000/**
   http://localhost:3001/**
   http://localhost:3002/**
   ```
4. Klik **Save**

---

## Langkah 6 — Update Environment Variables dengan URL Final

Setelah tahu URL tiap app, update di **setiap** Vercel project:

- `NEXT_PUBLIC_APP_WARGA_URL` = URL final warga
- `NEXT_PUBLIC_APP_PANGKALAN_URL` = URL final pangkalan
- `NEXT_PUBLIC_APP_DASHBOARD_URL` = URL final dashboard

Lalu **Redeploy** (Vercel Dashboard → Deployments → ⋯ → Redeploy).

---

## Verifikasi Deploy Berhasil

Setelah deploy, cek tiap URL:
- App warga → tampil halaman placeholder "SIGAS — Warga"
- App pangkalan → tampil halaman placeholder "SIGAS — Pangkalan"
- App dashboard → tampil halaman placeholder "SIGAS — Dashboard"

Jika ada error build, cek **Vercel Dashboard → Functions → Logs**.

---

## Catatan Spending Cap (PENTING)

Vercel free tier (Hobby) memiliki batas:
- 100 GB bandwidth/bulan
- 6.000 menit build/bulan
- 100 GB-hours serverless function/bulan

**Aktifkan Spending Cap** agar tidak ada tagihan tak terduga:
1. Vercel Dashboard → Settings → Billing
2. Set **Spend Management** → enable dengan limit $0 atau nominal kecil

---

## Custom Domain (Opsional, setelah Task 0.4)

Setelah Cloudflare DNS di-setup (Task 0.4), tambahkan custom domain:
- `warga.sigas.kotabima.go.id` → project sigas-warga
- `pangkalan.sigas.kotabima.go.id` → project sigas-pangkalan
- `dashboard.sigas.kotabima.go.id` → project sigas-dashboard
