// src/app/api/v1/webhooks/stripe/route.ts
// Webhook handler لـ Stripe

import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/stripe-integration';

/**
 * POST /api/v1/webhooks/stripe
 * معالج Webhook لـ Stripe
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'توقيع Stripe مفقود' },
        { status: 401 }
      );
    }

    const body = await req.text();

    // التحقق من التوقيع
    const event = stripeService.verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (!event) {
      return NextResponse.json(
        { error: 'توقيع Stripe غير صحيح' },
        { status: 401 }
      );
    }

    // معالجة الحدث
    await stripeService.handleWebhookEvent(event);

    return NextResponse.json({
      success: true,
      received: true,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
