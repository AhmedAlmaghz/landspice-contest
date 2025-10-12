import { NextResponse } from 'next/server';
import { participantQueries } from '@/lib/database';

export async function GET() {
  try {
    const participants = participantQueries.getAll();
    
    // إنشاء CSV
    const headers = [
      'ID',
      'الاسم',
      'البريد الإلكتروني',
      'الهاتف',
      'المدينة',
      'كود الإحالة',
      'أُحيل بواسطة',
      'التقدم %',
      'المشاركات',
      'تاريخ التسجيل',
      'Facebook',
      'Instagram',
      'YouTube',
      'TikTok',
      'Twitter',
      'Facebook Channel'
    ];
    
    const rows = participants.map(p => [
      p.id,
      p.name,
      p.email,
      p.phone,
      p.city,
      p.referral_code,
      p.referred_by || '-',
      p.progress || 0,
      p.shares || 0,
      p.registration_date,
      p.facebook_followed ? 'نعم' : 'لا',
      p.instagram_followed ? 'نعم' : 'لا',
      p.youtube_followed ? 'نعم' : 'لا',
      p.tiktok_followed ? 'نعم' : 'لا',
      p.twitter_followed ? 'نعم' : 'لا',
      p.facebook_channel_followed ? 'نعم' : 'لا'
    ]);
    
    // تحويل إلى CSV
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // إضافة BOM لدعم العربية في Excel
    const bom = '\uFEFF';
    const csvWithBom = bom + csv;
    
    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="participants-${Date.now()}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في التصدير' },
      { status: 500 }
    );
  }
}
