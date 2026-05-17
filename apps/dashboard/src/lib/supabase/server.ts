// Supabase client untuk Server Components, Server Actions, Route Handlers
// JANGAN import ini di Client Component ('use client') — akan error

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/supabase/database.types'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

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
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any),
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
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any),
            )
          } catch { /* lihat komentar di atas */ }
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}