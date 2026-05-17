// Middleware Next.js — dijalankan di setiap request sebelum sampai ke halaman
// Tugas utama: refresh Supabase session (JWT) agar tidak expired di tengah sesi
// Proteksi route dilakukan di sini juga

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/database.types'

// Route yang tidak perlu autentikasi
const PUBLIC_ROUTES = ['/login', '/register', '/']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Buat client khusus middleware — pakai cookies dari request/response
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set cookie di request dan response agar session tersinkron
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // PENTING: getUser() harus dipanggil agar session ter-refresh
  // Jangan panggil supabase.auth.getSession() di sini — kurang aman
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route)

  // Redirect ke login jika belum login dan bukan public route
  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect ke beranda jika sudah login tapi ke halaman auth
  if (user && (pathname === '/login' || pathname === '/register')) {
    const berandaUrl = request.nextUrl.clone()
    berandaUrl.pathname = '/beranda'
    return NextResponse.redirect(berandaUrl)
  }

  // PENTING: kembalikan supabaseResponse agar cookies ter-set dengan benar
  return supabaseResponse
}

export const config = {
  matcher: [
    // Jalankan middleware di semua route kecuali static files & API internal Next.js
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox-*).*)',
  ],
}
