// src/lib/stripe-integration.ts
// تكامل Stripe للدفع والاشتراكات

import Stripe from 'stripe';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

export interface SubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  customerId?: string;
  error?: string;
}

export class StripeService {
  private stripe: Stripe;
  private publishableKey: string;

  constructor(secretKey: string, publishableKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
    this.publishableKey = publishableKey;
  }

  /**
   * إنشاء عميل Stripe
   */
  async createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata,
      });
      return customer.id;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error}`);
    }
  }

  /**
   * إنشاء نية دفع
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // تحويل إلى cents
        currency,
        customer: customerId,
        metadata,
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret || undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    }
  }

  /**
   * إنشاء اشتراك
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ): Promise<SubscriptionResult> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        success: true,
        subscriptionId: subscription.id,
        customerId: subscription.customer as string,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Subscription failed',
      };
    }
  }

  /**
   * تحديث الاشتراك
   */
  async updateSubscription(
    subscriptionId: string,
    priceId: string
  ): Promise<SubscriptionResult> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

      const updatedSubscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              price: priceId,
            },
          ],
        }
      );

      return {
        success: true,
        subscriptionId: updatedSubscription.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed',
      };
    }
  }

  /**
   * إلغاء الاشتراك
   */
  async cancelSubscription(subscriptionId: string): Promise<SubscriptionResult> {
    try {
      const subscription = await this.stripe.subscriptions.del(subscriptionId);

      return {
        success: true,
        subscriptionId: subscription.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cancellation failed',
      };
    }
  }

  /**
   * جلب الفاتورة
   */
  async getInvoice(invoiceId: string) {
    try {
      const invoice = await this.stripe.invoices.retrieve(invoiceId);
      return {
        success: true,
        data: {
          id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          pdfUrl: invoice.pdf,
          createdAt: new Date(invoice.created * 1000),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get invoice',
      };
    }
  }

  /**
   * جلب الفواتير
   */
  async getInvoices(customerId: string, limit: number = 10) {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        limit,
      });

      return {
        success: true,
        data: invoices.data.map(invoice => ({
          id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          pdfUrl: invoice.pdf,
          createdAt: new Date(invoice.created * 1000),
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get invoices',
      };
    }
  }

  /**
   * التحقق من توقيع Webhook
   */
  verifyWebhookSignature(
    body: string,
    signature: string,
    secret: string
  ): Stripe.Event | null {
    try {
      return this.stripe.webhooks.constructEvent(body, signature, secret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return null;
    }
  }

  /**
   * معالجة حدث Webhook
   */
  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        break;

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;

      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object);
        break;

      case 'customer.subscription.deleted':
        console.log('Subscription deleted:', event.data.object);
        break;

      case 'invoice.payment_succeeded':
        console.log('Invoice paid:', event.data.object);
        break;

      case 'invoice.payment_failed':
        console.log('Invoice payment failed:', event.data.object);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }
  }
}

// إنشاء instance واحد
export const stripeService = new StripeService(
  process.env.STRIPE_SECRET_KEY || '',
  process.env.STRIPE_PUBLISHABLE_KEY || ''
);
