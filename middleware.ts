import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: '/:path*', // 匹配所有路径
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || ''

  if (ua.includes('Baiduspider')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return NextResponse.next()
}