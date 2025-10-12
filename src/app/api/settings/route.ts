import { NextRequest, NextResponse } from 'next/server';
import { settingsQueries } from '@/lib/database';

export async function GET() {
  try {
    // جلب الإعدادات بالـ id محدد (1)
    const settings = settingsQueries.get.get(1);

    if (!settings) {
      return NextResponse.json(
        { error: 'لم يتم العثور على إعدادات المسابقة' },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإعدادات' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    settingsQueries.update.run(
      data.contest_title,
      data.contest_end_date,
      data.prize_description,
      data.facebook_url,
      data.instagram_url,
      data.youtube_url,
      data.tiktok_url,
      data.twitter_url,
      data.facebook_channel_url
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الإعدادات' },
      { status: 500 }
    );
  }
}
