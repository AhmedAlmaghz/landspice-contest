// src/app/api/v1/contests/[contestId]/route.ts
// API Endpoints لإدارة مسابقة محددة

import { NextRequest, NextResponse } from 'next/server';
import { contestService } from '@/services/ContestService';
import { authMiddleware } from '@/middleware/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { getErrorResponse } from '@/lib/errors';

/**
 * GET /api/v1/contests/[contestId]
 * جلب مسابقة محددة
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

    const contest = await contestService.getContestWithDetails(params.contestId);

    if (!contest) {
      return NextResponse.json(
        { error: 'المسابقة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contest,
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

/**
 * PUT /api/v1/contests/[contestId]
 * تحديث مسابقة
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    if (!user.permissions.includes(PERMISSIONS.EDIT_CONTEST)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const contest = await contestService.updateContest(params.contestId, user.company_id, data);

    return NextResponse.json({
      success: true,
      data: contest,
      message: 'تم تحديث المسابقة بنجاح',
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

/**
 * DELETE /api/v1/contests/[contestId]
 * حذف مسابقة
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { contestId: string } }
) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    if (!user.permissions.includes(PERMISSIONS.DELETE_CONTEST)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    await contestService.deleteContest(params.contestId, user.company_id);

    return NextResponse.json({
      success: true,
      message: 'تم حذف المسابقة بنجاح',
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
