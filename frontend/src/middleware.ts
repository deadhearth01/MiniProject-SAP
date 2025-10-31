import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // NOTE: Client-side auth (ProtectedRoute) handles redirects.
  // Middleware redirects based on a custom cookie caused a login loop
  // because Supabase JS stores tokens in localStorage (not readable here).
  // We keep only cache headers for protected paths.

  const protectedPaths = ['/dashboard', '/achievements', '/admin', '/leaderboard', '/notifications', '/students']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

  const response = NextResponse.next()

  if (isProtectedPath) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
