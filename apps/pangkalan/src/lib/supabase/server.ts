// Supabase client untuk Server Components, Server Actions, Route Handlers
// JANGAN import ini di Client Component ('use client') — akan error
// Membaca cookie dari next/headers untuk sesi user yang sudah login

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/supabase/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll dipanggil dari Server Component — aman diabaikan
            // karena middleware yang akan me-refresh session
          }
        },
      },
    },
  )
}

/**
 * Admin client dengan service role — BYPASS semua RLS.
 * Hanya untuk operasi administratif di server.
 * JANGAN pernah ekspos ke client.
 */
export async function createAdminClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch { /* lihat komentar di atas */ }
        },
      },
      auth: {
        // Service role tidak perlu auto-refresh token
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
