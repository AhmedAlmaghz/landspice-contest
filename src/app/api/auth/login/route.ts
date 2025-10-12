import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createSessionToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Verify credentials
    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Create session
    const sessionData = {
      isAdmin: true as const,
      username,
      loginTime: Date.now(),
    };

    const token = createSessionToken(sessionData);
    const cookie = setAuthCookie(token, true);

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
    });

    response.cookies.set(cookie);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  }
}
