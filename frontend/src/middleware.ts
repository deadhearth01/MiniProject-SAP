import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get auth token from cookies
  const authToken = request.cookies.get('gitam-auth-token')
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/achievements', '/admin', '/leaderboard', '/notifications', '/students']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  // If accessing protected route without auth token, redirect to login
  if (isProtectedPath && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Add cache control headers to prevent stale data
  const response = NextResponse.next()
  
  // For protected routes, disable caching
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
