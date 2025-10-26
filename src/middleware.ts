import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('easygas.token')?.value;
  const { pathname } = req.nextUrl;

  const loginAdminURL = new URL('/admin/login', req.url);
  const dashboardAdminURL = new URL('/admin/dashboard', req.url);

  if (pathname === '/' || pathname === '/admin') {
    return NextResponse.redirect(token ? dashboardAdminURL : loginAdminURL);
  }

  if (pathname.startsWith('/admin/login')) {
    if (token) {
      return NextResponse.redirect(dashboardAdminURL);
    }
    return NextResponse.next();
  }

  if (!token && !pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(loginAdminURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin',
    '/admin/:path*'
  ],
};