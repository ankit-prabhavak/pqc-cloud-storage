import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')

  const protectedRoutes = [
    '/dashboard',
    '/upload',
    '/security'
  ]

  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtected && !accessToken) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/upload/:path*',
    '/security/:path*'
  ]
}