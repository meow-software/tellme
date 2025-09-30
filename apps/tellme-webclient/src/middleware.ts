import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const login = '/auth/login'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const protectedPaths = ['/@me', '/echo', '/project']

  const accessToken = req.cookies.get('access_token')?.value
  const refreshToken = req.cookies.get('refresh_token')?.value

  // protected path?
  if (
    protectedPaths.some(p => pathname.startsWith(p)) &&
    (!accessToken || !refreshToken)
  ) {
    const loginUrl = new URL(login, req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/@me/:path*', '/echo/:path*', '/project/:path*'],
}
