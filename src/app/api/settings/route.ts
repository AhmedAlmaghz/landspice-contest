import { NextRequest, NextResponse } from 'next/server';
import { contestQueries } from '@/lib/database';

export async function GET() {
  try {
    // جلب أول مسابقة نشطة
    const contests = contestQueries.getActive.all('active') as any[];
    const settings = contests?.[0];

    // إذا لم توجد مسابقة، إرجع بيانات افتراضية
    if (!settings) {
      return NextResponse.json({ 
        settings: {
          id: 1,
          title: 'مسابقة LandSpice',
          description: 'مسابقة المتابعة والمشاركة',
          prize_description: '🥇 المركز الأول: جائزة قيمة 1000 ريال\n🥈 المركز الثاني: جائزة قيمة 500 ريال\n🥉 المركز الثالث: جائزة قيمة 250 ريال',
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        }
      });
    }

    return NextResponse.json({ 
      settings: {
        id: settings.id,
        title: settings.title,
        description: settings.description,
        prize_description: settings.prize_description,
        end_date: settings.end_date,
        status: settings.status
      }
    });
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
    
    if (!data.contest_id) {
      return NextResponse.json(
        { error: 'معرف المسابقة مطلوب' },
        { status: 400 }
      );
    }

    contestQueries.update.run(
      data.title || '',
      data.description || '',
      data.status || 'active',
      data.end_date || null,
      data.prize_description || '',
      data.rules || '',
      data.contest_id
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
