// src/app/api/v1/subscriptions/route.ts
// API Endpoints لإدارة الاشتراكات

import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/stripe-integration';
import { authMiddleware } from '@/middleware/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { getErrorResponse } from '@/lib/errors';

/**
 * POST /api/v1/subscriptions/create
 * إنشاء اشتراك جديد
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

    const { priceId, customerId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'معرف السعر مطلوب' },
        { status: 400 }
      );
    }

    const result = await stripeService.createSubscription(
      customerId || user.company_id,
      priceId,
      { companyId: user.company_id }
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
        subscriptionId: result.subscriptionId,
        customerId: result.customerId,
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
 * PUT /api/v1/subscriptions/update
 * تحديث الاشتراك
 */
export async function PUT(req: NextRequest) {
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

    const { subscriptionId, priceId } = await req.json();

    if (!subscriptionId || !priceId) {
      return NextResponse.json(
        { error: 'معرف الاشتراك ومعرف السعر مطلوبان' },
        { status: 400 }
      );
    }

    const result = await stripeService.updateSubscription(subscriptionId, priceId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        subscriptionId: result.subscriptionId,
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
 * DELETE /api/v1/subscriptions/cancel
 * إلغاء الاشتراك
 */
export async function DELETE(req: NextRequest) {
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

    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'معرف الاشتراك مطلوب' },
        { status: 400 }
      );
    }

    const result = await stripeService.cancelSubscription(subscriptionId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء الاشتراك بنجاح',
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
