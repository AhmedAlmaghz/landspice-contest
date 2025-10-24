// src/app/api/v1/contests/[contestId]/platforms/route.ts
// API Endpoints لإدارة الشبكات الاجتماعية

import { NextRequest, NextResponse } from 'next/server';
import { socialPlatformService } from '@/services/SocialPlatformService';
import { authMiddleware } from '@/middleware/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { ValidationError, getErrorResponse } from '@/lib/errors';

/**
 * POST /api/v1/contests/[contestId]/platforms
 * إضافة شبكة اجتماعية جديدة
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    if (!user.permissions.includes(PERMISSIONS.ADD_PLATFORM)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    const data = await req.json();

    if (!data.display_name || !data.url || !data.name) {
      throw new ValidationError('جميع الحقول مطلوبة');
    }

    const platform = await socialPlatformService.addPlatform(
      params.contestId,
      user.company_id,
      data
    );

    return NextResponse.json(
      {
        success: true,
        data: platform,
        message: 'تم إضافة الشبكة بنجاح',
      },
      { status: 201 }
    );
  } catch (error) {
    const errorResponse = getErrorResponse(error);
    return NextResponse.json(
      {
        success: false,
        error: errorResponse.message,
        code: errorResponse.code,
      },
      { status: errorResponse.statusCode }
    );
  }
}

/**
 * GET /api/v1/contests/[contestId]/platforms
 * جلب شبكات المسابقة
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const platforms = await socialPlatformService.getPlatformsByContest(params.contestId);

    return NextResponse.json({
      success: true,
      data: platforms,
    });
  } catch (error) {
    const errorResponse = getErrorResponse(error);
    return NextResponse.json(
      {
        success: false,
        error: errorResponse.message,
        code: errorResponse.code,
      },
      { status: errorResponse.statusCode }
    );
  }
}
