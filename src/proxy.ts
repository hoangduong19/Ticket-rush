import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login là trang public — cho qua ngay, không check gì cả
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // --- Bảo vệ route ADMIN ---
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('adminToken')?.value;
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- Bảo vệ route USER ---
  const token = request.cookies.get('token')?.value;
  const isLoggedIn = Boolean(token);

  if (!isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/',
    '/seats/:path*',
    '/dashboard/:path*',
    '/tickets/:path*',
  ],
};
