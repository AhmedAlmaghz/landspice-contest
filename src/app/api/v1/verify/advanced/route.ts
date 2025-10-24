// src/app/api/v1/verify/advanced/route.ts
// API متقدم للتحقق من الإجراءات الاجتماعية

import { NextRequest, NextResponse } from 'next/server';
import { SocialIntegrationFactory } from '@/lib/social-integrations';
import { participantService } from '@/services/ParticipantService';
import { getErrorResponse } from '@/lib/errors';

/**
 * POST /api/v1/verify/advanced
 * التحقق المتقدم من الإجراءات الاجتماعية
 */
export async function POST(req: NextRequest) {
  try {
    const {
      participantId,
      platformId,
      contestId,
      platform,
      action,
      data,
    } = await req.json();

    // التحقق من البيانات المطلوبة
    if (!participantId || !platformId || !contestId || !platform || !action) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // الحصول على التكامل المناسب
    const config = {
      apiKey: process.env[`${platform.toUpperCase()}_API_KEY`],
      apiSecret: process.env[`${platform.toUpperCase()}_API_SECRET`],
      accessToken: process.env[`${platform.toUpperCase()}_ACCESS_TOKEN`],
      bearerToken: process.env[`${platform.toUpperCase()}_BEARER_TOKEN`],
      clientKey: process.env[`${platform.toUpperCase()}_CLIENT_KEY`],
    };

    const integration = SocialIntegrationFactory.create(platform, config);

    // تنفيذ التحقق حسب نوع الإجراء
    let result;

    switch (platform.toLowerCase()) {
      case 'facebook':
        if (action === 'follow') {
          result = await (integration as any).verifyPageFollow(data.pageId, data.userId);
        } else if (action === 'like') {
          result = await (integration as any).verifyPageLike(data.pageId, data.userId);
        }
        break;

      case 'instagram':
        if (action === 'follow') {
          result = await (integration as any).verifyAccountFollow(data.accountId, data.userId);
        }
        break;

      case 'youtube':
        if (action === 'subscribe') {
          result = await (integration as any).verifyChannelSubscription(data.channelId, data.userId);
        } else if (action === 'like') {
          result = await (integration as any).verifyVideoLike(data.videoId, data.userId);
        }
        break;

      case 'tiktok':
        if (action === 'follow') {
          result = await (integration as any).verifyAccountFollow(data.userId, data.targetUserId);
        }
        break;

      case 'twitter':
        if (action === 'follow') {
          result = await (integration as any).verifyAccountFollow(data.userId, data.targetUserId);
        } else if (action === 'retweet') {
          result = await (integration as any).verifyRetweet(data.userId, data.tweetId);
        }
        break;

      default:
        return NextResponse.json(
          { error: 'منصة غير مدعومة' },
          { status: 400 }
        );
    }

    // تحديث تقدم المشارك إذا تم التحقق
    if (result?.verified) {
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
 * GET /api/v1/verify/advanced/status
 * جلب حالة التحقق المتقدمة
 */
export async function GET(req: NextRequest) {
  try {
    const participantId = req.nextUrl.searchParams.get('participantId');
    const contestId = req.nextUrl.searchParams.get('contestId');
    const platform = req.nextUrl.searchParams.get('platform');

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
      data: {
        ...stats,
        platform: platform || 'all',
      },
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
