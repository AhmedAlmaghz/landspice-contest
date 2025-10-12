import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, platforms, scheduleDate } = await request.json();

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'المحتوى والمنصات مطلوبة' },
        { status: 400 }
      );
    }

    // في الإنتاج، احفظ في قاعدة البيانات
    const publishRecord = {
      id: Date.now(),
      content,
      platforms,
      scheduleDate: scheduleDate || null,
      status: scheduleDate ? 'scheduled' : 'published',
      createdAt: new Date().toISOString()
    };

    // هنا يمكن حفظ السجل في قاعدة البيانات
    // await db.insert('publish_history', publishRecord);

    return NextResponse.json({
      success: true,
      message: scheduleDate ? 'تم جدولة النشر بنجاح' : 'تم النشر بنجاح',
      record: publishRecord
    });
  } catch (error) {
    console.error('Error publishing:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في النشر' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // في الإنتاج، اجلب من قاعدة البيانات
    // const history = await db.query('SELECT * FROM publish_history ORDER BY createdAt DESC');
    
    const history: any[] = []; // مؤقت

    return NextResponse.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب السجل' },
      { status: 500 }
    );
  }
}
