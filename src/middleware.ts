import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // حماية مسارات الإدارة
  if (pathname.startsWith('/admin')) {
    // السماح بصفحة تسجيل الدخول
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // التحقق من جلسة الإدارة
    const adminToken = request.cookies.get('admin_session')?.value;
    
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const session = verifySessionToken(adminToken);
    
    if (!session || !('isAdmin' in session) || !session.isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  // حماية صفحة لوحة تحكم المستخدم
  if (pathname.startsWith('/dashboard')) {
    const userToken = request.cookies.get('user_session')?.value;
    
    if (!userToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const session = verifySessionToken(userToken);
    
    if (!session || !('participantId' in session)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // Rate limiting بسيط للـ API
  if (pathname.startsWith('/api/')) {
    // السماح بـ API المصادقة
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // يمكن إضافة rate limiting هنا
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/:path*'],
};
