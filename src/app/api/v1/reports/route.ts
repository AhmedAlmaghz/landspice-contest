// src/app/api/v1/reports/route.ts
// API Endpoints للتقارير

import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/services/AnalyticsService';
import { authMiddleware } from '@/middleware/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { getErrorResponse } from '@/lib/errors';

/**
 * POST /api/v1/reports/generate
 * توليد تقرير
 */
export async function POST(req: NextRequest) {
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

    const { type, contestId, startDate, endDate, format } = await req.json();

    if (!type || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'النوع والتواريخ مطلوبة' },
        { status: 400 }
      );
    }

    let report;

    if (type === 'contest') {
      if (!contestId) {
        return NextResponse.json(
          { error: 'معرف المسابقة مطلوب' },
          { status: 400 }
        );
      }
      report = await analyticsService.generateContestReport(
        contestId,
        new Date(startDate),
        new Date(endDate)
      );
    } else if (type === 'company') {
      report = await analyticsService.generateCompanyReport(
        user.company_id,
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      return NextResponse.json(
        { error: 'نوع التقرير غير صحيح' },
        { status: 400 }
      );
    }

    // تصدير التقرير حسب الصيغة المطلوبة
    if (format === 'csv') {
      const csv = analyticsService.exportToCSV(report);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="report-${Date.now()}.csv"`,
        },
      });
    } else if (format === 'json') {
      const json = analyticsService.exportToJSON(report);
      return new NextResponse(json, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="report-${Date.now()}.json"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: report,
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

/**
 * GET /api/v1/reports/list
 * جلب قائمة التقارير
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

    // سيتم استبدال هذا بـ database query
    const reports = [];

    return NextResponse.json({
      success: true,
      data: reports,
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
