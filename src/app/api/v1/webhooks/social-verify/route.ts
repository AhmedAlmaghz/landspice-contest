// src/app/api/v1/webhooks/social-verify/route.ts
// Webhook handler للتحقق من المنصات الاجتماعية

import { NextRequest, NextResponse } from 'next/server';
import { participantService } from '@/services/ParticipantService';
import { getErrorResponse } from '@/lib/errors';
import crypto from 'crypto';

/**
 * التحقق من توقيع Webhook
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return hash === signature;
}

/**
 * POST /api/v1/webhooks/social-verify
 * معالج Webhook للتحقق من الإجراءات الاجتماعية
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json(
        { error: 'توقيع Webhook مفقود' },
        { status: 401 }
      );
    }

    // التحقق من الطابع الزمني (يجب أن يكون حديثاً)
    const webhookTime = parseInt(timestamp);
    const currentTime = Date.now();
    const timeDiff = Math.abs(currentTime - webhookTime);

    if (timeDiff > 5 * 60 * 1000) { // 5 دقائق
      return NextResponse.json(
        { error: 'Webhook منتهي الصلاحية' },
        { status: 401 }
      );
    }

    const body = await req.text();

    if (!body.trim()) {
      return NextResponse.json(
        { error: 'جسم الطلب فارغ' },
        { status: 400 }
      );
    }

    // التحقق من التوقيع
    const isValid = verifyWebhookSignature(
      body,
      signature,
      process.env.WEBHOOK_SECRET || ''
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'توقيع Webhook غير صحيح' },
        { status: 401 }
      );
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'بيانات JSON غير صحيحة' },
        { status: 400 }
      );
    }

    // معالجة البيانات
    const { participantId, platformId, contestId, actionType, verified } = data;

    if (!participantId || !platformId || !contestId) {
      return NextResponse.json(
        { error: 'بيانات Webhook غير كاملة' },
        { status: 400 }
      );
    }

    // تحديث تقدم المشارك إذا تم التحقق
    if (verified) {
      await participantService.updateProgress(participantId, contestId, 1);
    }

    return NextResponse.json({
      success: true,
      message: 'تم معالجة Webhook بنجاح',
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
