import { NextRequest, NextResponse } from 'next/server';
import { contestQueries } from '@/lib/database';
import { verifySessionToken } from '@/lib/auth';

export async function GET() {
  try {
    // جلب أول مسابقة نشطة
    const contest = contestQueries.getActive.all('active')?.[0] as any;

    if (!contest) {
      return NextResponse.json(
        { error: 'لم يتم العثور على مسابقة نشطة' },
        { status: 404 }
      );
    }

    // إرجاع بيانات المسابقة
    return NextResponse.json({ 
      settings: {
        contest_title: contest.title,
        prize_description: contest.prize_description,
        end_date: contest.end_date,
      },
      socialLinks: {}
    });
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
    const data = await request.json();
    
    // الحصول على أول مسابقة نشطة كمسابقة افتراضية
    const contest = contestQueries.getActive.all('active')?.[0] as any;
    
    if (!contest) {
      return NextResponse.json(
        { error: 'لم يتم العثور على مسابقة نشطة' },
        { status: 404 }
      );
    }

    // تحديث المسابقة بالبيانات المرسلة أو الافتراضية
    contestQueries.update.run(
      data.contest_title || data.title || contest.title,
      data.description || '',
      'active',
      data.end_date || contest.end_date || null,
      data.prize_description || contest.prize_description || '',
      data.rules || '',
      contest.id
    );

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإعدادات بنجاح',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الإعدادات' },
      { status: 500 }
    );
  }
}
