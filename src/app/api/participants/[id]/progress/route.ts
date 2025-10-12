import { NextRequest, NextResponse } from 'next/server';
import { participantQueries, socialActionQueries } from '@/lib/database';
import { ProgressUpdate, Participant } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const participantId = parseInt(params.id);
    const data: ProgressUpdate = await request.json();
    
    // التحقق من صحة البيانات
    if (!data.platform || !data.action) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة' },
        { status: 400 }
      );
    }

    if (!['follow', 'share'].includes(data.action)) {
      return NextResponse.json(
        { error: 'نوع الإجراء غير صحيح' },
        { status: 400 }
      );
    }
    
    // Get current participant data
    const participant = participantQueries.findById.get(participantId) as Participant;
    if (!participant) {
      return NextResponse.json(
        { error: 'المشارك غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من عدم تكرار المتابعة
    const platformFollowedKey = `${data.platform}_followed` as keyof Participant;
    if (data.action === 'follow' && participant[platformFollowedKey]) {
      return NextResponse.json(
        { error: 'تمت المتابعة مسبقاً' },
        { status: 400 }
      );
    }

    // Record social action
    socialActionQueries.create.run(participantId, data.platform, data.action);

    // Update progress based on platform and action
    let progress = participant.progress;
    let shares = participant.shares;
    let platformFollowed = false;

    switch (data.platform) {
      case 'facebook':
        if (data.action === 'follow') {
          platformFollowed = true;
          progress += 16; // 100/6 platforms
        } else if (data.action === 'share') {
          shares += 1;
        }
        break;
      case 'instagram':
        if (data.action === 'follow') {
          platformFollowed = true;
          progress += 16;
        } else if (data.action === 'share') {
          shares += 1;
        }
        break;
      case 'youtube':
        if (data.action === 'follow') {
          platformFollowed = true;
          progress += 16;
        } else if (data.action === 'share') {
          shares += 1;
        }
        break;
      case 'tiktok':
        if (data.action === 'follow') {
          platformFollowed = true;
          progress += 16;
        } else if (data.action === 'share') {
          shares += 1;
        }
        break;
      case 'twitter':
        if (data.action === 'follow') {
          platformFollowed = true;
          progress += 16;
        } else if (data.action === 'share') {
          shares += 1;
        }
        break;
      case 'facebook_channel':
        if (data.action === 'follow') {
          platformFollowed = true;
          progress += 16;
        } else if (data.action === 'share') {
          shares += 1;
        }
        break;
    }

    // Cap progress at 100%
    progress = Math.min(progress, 100);

    // Update participant progress
    participantQueries.updateProgress.run(
      progress,
      shares,
      data.platform === 'facebook' && data.action === 'follow' ? true : participant.facebook_followed,
      data.platform === 'instagram' && data.action === 'follow' ? true : participant.instagram_followed,
      data.platform === 'youtube' && data.action === 'follow' ? true : participant.youtube_followed,
      data.platform === 'tiktok' && data.action === 'follow' ? true : participant.tiktok_followed,
      data.platform === 'twitter' && data.action === 'follow' ? true : participant.twitter_followed,
      data.platform === 'facebook_channel' && data.action === 'follow' ? true : participant.facebook_channel_followed,
      participantId
    );

    return NextResponse.json({
      success: true,
      progress,
      shares,
      platformFollowed
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث التقدم' },
      { status: 500 }
    );
  }
}
