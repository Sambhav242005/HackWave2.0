import { NextRequest, NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

// 1. Specify protected and public routes
const protectedRoutes = ['/workspace']
const publicRoutes = ['/signin', '/signup', '/']

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  
  // 3. Get the JWT token
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // === DEBUG LOGS ===
  console.log('\n=== MIDDLEWARE DEBUG ===')
  console.log('Current path:', path)
  console.log('Is protected route:', isProtectedRoute)
  console.log('Is public route:', isPublicRoute)
  console.log('Token exists:', !!token)
  if (token) {
    console.log('User ID:', token.sub) // token.sub contains the user ID
  }
  console.log('======================\n')

  // 4. Redirect to /signin if accessing protected route without valid token
  if (isProtectedRoute && !token) {
    console.log('🚫 Redirecting unauthenticated user to /signin')
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }

  // 5. Redirect to /workspace if authenticated user accesses public routes
  if (
    isPublicRoute &&
    token &&
    !req.nextUrl.pathname.startsWith('/workspace')
  ) {
    console.log('✅ Redirecting authenticated user to /workspace')
    return NextResponse.redirect(new URL('/workspace', req.nextUrl))
  }

  console.log('➡️ Allowing request to proceed')
  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}