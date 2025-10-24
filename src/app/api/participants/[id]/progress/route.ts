import { NextRequest, NextResponse } from 'next/server';
import { participantQueries } from '@/lib/database';
import { ProgressUpdate, Participant } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const participantId = parseInt(id);

    if (isNaN(participantId)) {
      return NextResponse.json(
        { error: 'معرف المشارك غير صحيح' },
        { status: 400 }
      );
    }

    // التحقق من وجود محتوى JSON في الطلب
    let data: ProgressUpdate;
    try {
      const body = await request.text();
      if (!body.trim()) {
        return NextResponse.json(
          { error: 'لا يوجد بيانات في الطلب' },
          { status: 400 }
        );
      }
      data = JSON.parse(body);
    } catch (jsonError) {
      return NextResponse.json(
        { error: 'بيانات JSON غير صحيحة' },
        { status: 400 }
      );
    }
    
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

    // Social action recorded (can be tracked in participant_actions table if needed)

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
    // New schema: progress, total_actions, total_shares, id
    const totalActions = (participant.total_actions || 0) + 1;
    participantQueries.updateProgress.run(
      progress,
      totalActions,
      shares,
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
