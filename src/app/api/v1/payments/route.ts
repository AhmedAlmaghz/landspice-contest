// src/app/api/v1/payments/route.ts
// API Endpoints للدفع والاشتراكات

import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/stripe-integration';
import { authMiddleware } from '@/middleware/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { getErrorResponse } from '@/lib/errors';

/**
 * POST /api/v1/payments/create-payment-intent
 * إنشاء نية دفع
 */
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    if (!user.permissions.includes(PERMISSIONS.MANAGE_BILLING)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    const { amount, currency, planId } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'المبلغ والعملة مطلوبان' },
        { status: 400 }
      );
    }

    const result = await stripeService.createPaymentIntent(
      amount,
      currency,
      user.company_id,
      { planId: planId || 'custom' }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret,
      },
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
 * GET /api/v1/payments/invoices
 * جلب الفواتير
 */
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult.status !== 200) {
      return authResult;
    }

    const user = (req as any).user;

    if (!user.permissions.includes(PERMISSIONS.VIEW_INVOICES)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية' },
        { status: 403 }
      );
    }

    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');

    const result = await stripeService.getInvoices(user.company_id, limit);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
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
