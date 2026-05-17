// Supabase client untuk Browser / Client Components
// Gunakan ini di komponen yang punya 'use client' directive
// Menggunakan anon key — RLS yang mengamankan akses data

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
