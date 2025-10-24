// src/app/api/v1/verify/route.ts
// API Endpoint للتحقق التلقائي من الإجراءات الاجتماعية

import { NextRequest, NextResponse } from 'next/server';
import { verificationService } from '@/services/VerificationService';
import { participantService } from '@/services/ParticipantService';
import { getErrorResponse } from '@/lib/errors';

/**
 * POST /api/v1/verify
 * التحقق من إجراء اجتماعي
 */
export async function POST(req: NextRequest) {
  try {
    const { participantId, platformId, contestId } = await req.json();

    // التحقق من البيانات المطلوبة
    if (!participantId || !platformId || !contestId) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من الإجراء
    const result = await verificationService.verifyAction(
      participantId,
      platformId,
      contestId
    );

    // إذا تم التحقق، تحديث تقدم المشارك
    if (result.verified) {
      await participantService.updateProgress(participantId, contestId, 1);
    }

    return NextResponse.json({
      success: true,
      data: result,
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
 * GET /api/v1/verify/status
 * جلب حالة التحقق
 */
export async function GET(req: NextRequest) {
  try {
    const participantId = req.nextUrl.searchParams.get('participantId');
    const contestId = req.nextUrl.searchParams.get('contestId');

    if (!participantId || !contestId) {
      return NextResponse.json(
        { error: 'participantId و contestId مطلوبان' },
        { status: 400 }
      );
    }

    // جلب إحصائيات المشارك
    const stats = await participantService.getParticipantStats(participantId);

    return NextResponse.json({
      success: true,
      data: stats,
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
