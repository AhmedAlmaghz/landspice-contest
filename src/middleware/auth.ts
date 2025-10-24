// src/middleware/auth.ts
// Middleware للمصادقة والتفويض

import { NextRequest, NextResponse } from 'next/server';
import { AuthUser, UserRole } from '@/types/saas';
import { AuthenticationError, AuthorizationError } from '@/lib/errors';
import { ROLE_PERMISSIONS, Permission } from '@/lib/permissions';

/**
 * استخراج التوكن من الطلب
 */
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * التحقق من التوكن
 */
export async function verifyToken(token: string): Promise<AuthUser> {
  try {
    // سيتم استبدال هذا بـ JWT verification
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // return decoded as AuthUser;

    // مثال مؤقت
    return {
      id: 'user_123',
      email: 'user@example.com',
      role: UserRole.COMPANY_ADMIN,
      company_id: 'company_123',
      permissions: ROLE_PERMISSIONS[UserRole.COMPANY_ADMIN],
    };
  } catch (error) {
    throw new AuthenticationError('توكن غير صحيح');
  }
}

/**
 * Middleware للمصادقة
 */
export async function authMiddleware(req: NextRequest) {
  const token = extractToken(req);
  
  if (!token) {
    return NextResponse.json(
      { error: 'غير مصرح' },
      { status: 401 }
    );
  }

  try {
    const user = await verifyToken(token);
    // إضافة المستخدم للطلب
    (req as any).user = user;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'توكن غير صحيح' },
      { status: 401 }
    );
  }
}

/**
 * Middleware للتفويض
 */
export function authorizeMiddleware(requiredPermissions: Permission[]) {
  return async (req: NextRequest) => {
    const user = (req as any).user as AuthUser | undefined;

    if (!user) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // التحقق من الصلاحيات
    const hasPermission = requiredPermissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}

/**
 * Middleware للتحقق من الملكية
 */
export function ownershipMiddleware(req: NextRequest) {
  const user = (req as any).user as AuthUser | undefined;
  const companyId = req.nextUrl.searchParams.get('companyId') || 
                    (req as any).params?.companyId;

  if (!user) {
    return NextResponse.json(
      { error: 'غير مصرح' },
      { status: 401 }
    );
  }

  // التحقق من الملكية
  if (user.role !== UserRole.SUPER_ADMIN && user.company_id !== companyId) {
    return NextResponse.json(
      { error: 'ليس لديك صلاحية' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

/**
 * Middleware لـ Rate Limiting
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(maxRequests: number = 100, windowMs: number = 60000) {
  return (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    let data = requestCounts.get(ip);

    if (!data || now > data.resetTime) {
      data = { count: 0, resetTime: now + windowMs };
      requestCounts.set(ip, data);
    }

    data.count++;

    if (data.count > maxRequests) {
      return NextResponse.json(
        { error: 'تم تجاوز حد الطلبات' },
        { status: 429 }
      );
    }

    return NextResponse.next();
  };
}

/**
 * Middleware لـ CORS
 */
export function corsMiddleware(req: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

/**
 * Middleware لـ Logging
 */
export function loggingMiddleware(req: NextRequest) {
  const startTime = Date.now();
  const user = (req as any).user as AuthUser | undefined;

  console.log({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.nextUrl.pathname,
    user_id: user?.id,
    company_id: user?.company_id,
    ip: req.headers.get('x-forwarded-for') || 'unknown',
  });

  return NextResponse.next();
}

/**
 * دالة مساعدة لتطبيق عدة Middlewares
 */
export function applyMiddlewares(
  req: NextRequest,
  middlewares: ((req: NextRequest) => NextResponse | Promise<NextResponse>)[]
): NextResponse | Promise<NextResponse> {
  for (const middleware of middlewares) {
    const result = middleware(req);
    if (result instanceof NextResponse && result.status !== 200) {
      return result;
    }
  }
  return NextResponse.next();
}
