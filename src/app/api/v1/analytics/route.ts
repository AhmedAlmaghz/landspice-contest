// src/app/api/v1/analytics/route.ts
// API Endpoints للتحليلات والتقارير

import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/services/AnalyticsService';
import { authMiddleware } from '@/middleware/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { getErrorResponse } from '@/lib/errors';

/**
 * GET /api/v1/analytics/contest
 * جلب تحليلات المسابقة
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    if (!user.permissions.includes(PERMISSIONS.VIEW_ANALYTICS)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    const contestId = req.nextUrl.searchParams.get('contestId');
    const type = req.nextUrl.searchParams.get('type') || 'contest';

    if (!contestId && type === 'contest') {
      return NextResponse.json(
        { error: 'معرف المسابقة مطلوب' },
        { status: 400 }
      );
    }

    let analytics;

    if (type === 'contest' && contestId) {
      analytics = await analyticsService.getContestAnalytics(contestId);
    } else if (type === 'company') {
      analytics = await analyticsService.getCompanyAnalytics(user.company_id);
    } else {
      return NextResponse.json(
        { error: 'نوع التحليل غير صحيح' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    const errorResponse = getErrorResponse(error);
    return NextResponse.json(
      {
        success: false,
        error: errorResponse.message,
      },
      { status: errorResponse.statusCode }
    );
  }
}
