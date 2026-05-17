# SIGAS — Sistem Informasi Gas Subsidi

Monorepo untuk distribusi LPG 3kg bersubsidi di Kota Bima.

## Apps
| App | Port | Deskripsi |
|-----|------|-----------|
| `apps/warga` | 3000 | PWA untuk warga penerima subsidi |
| `apps/pangkalan` | 3001 | PWA offline-first untuk operator pangkalan |
| `apps/dashboard` | 3002 | Web dashboard agen & admin pemerintah |

## Quick Start
```bash
# Install dependencies
pnpm install

# Jalankan semua apps sekaligus
pnpm dev

# Build semua
pnpm build
```

## Struktur
Lihat `docs/00_summary.md` untuk detail lengkap.
