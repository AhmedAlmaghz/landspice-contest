import { NextRequest, NextResponse } from 'next/server';
import { settingsQueries } from '@/lib/database';
import { verifySessionToken } from '@/lib/auth';

export async function GET() {
  try {
    const settings = settingsQueries.get.get(1) as any;

    if (!settings) {
      return NextResponse.json(
        { error: 'لم يتم العثور على إعدادات المسابقة' },
        { status: 404 }
      );
    }

    // إرجاع روابط الشبكات الاجتماعية فقط
    const socialLinks = {
      facebook: settings.facebook_url,
      instagram: settings.instagram_url,
      youtube: settings.youtube_url,
      tiktok: settings.tiktok_url,
      twitter: settings.twitter_url,
      facebook_channel: settings.facebook_channel_url,
    };

    return NextResponse.json({ socialLinks });
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب روابط الشبكات الاجتماعية' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // التحقق من جلسة الإدارة
    const adminToken = request.cookies.get('admin_session')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    const session = verifySessionToken(adminToken);

    if (!session || !('isAdmin' in session) || !session.isAdmin) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    const {
      facebook_url,
      instagram_url,
      youtube_url,
      tiktok_url,
      twitter_url,
      facebook_channel_url,
      contest_title,
      prize_description,
      contest_end_date,
    } = await request.json();

    // التحقق من صحة البيانات
    if (!facebook_url || !instagram_url || !youtube_url || !tiktok_url || !twitter_url || !facebook_channel_url) {
      return NextResponse.json(
        { error: 'جميع روابط الشبكات الاجتماعية مطلوبة' },
        { status: 400 }
      );
    }

    // تحديث الإعدادات
    settingsQueries.update.run(
      contest_title || 'مسابقة المتابعة والمشاركة',
      contest_end_date || null,
      prize_description || 'جوائز قيمة للفائزين',
      facebook_url,
      instagram_url,
      youtube_url,
      tiktok_url,
      twitter_url,
      facebook_channel_url
    );

    return NextResponse.json({
      success: true,
      message: 'تم تحديث إعدادات المسابقة بنجاح',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الإعدادات' },
      { status: 500 }
    );
  }
}
