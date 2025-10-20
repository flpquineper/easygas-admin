import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('easygas.token')?.value;
  const { pathname } = req.nextUrl;
  const loginAdminURL = new URL('/admin/login', req.url);

  if (pathname.startsWith('/admin/login')) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jose.jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(loginAdminURL);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    if ((payload.role as string) !== 'admin') {
      throw new Error('Permissão inválida');
    }
  } catch {
    const response = NextResponse.redirect(loginAdminURL);
    response.cookies.delete('easygas.token'); 
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};