import { NextResponse } from 'next/server';
import { participantQueries } from '@/lib/database';

export async function GET() {
  try {
    const participants = participantQueries.getAll.all() as any[];
    
    // حساب الإحصائيات
    const today = new Date().toISOString().split('T')[0];
    const newToday = participants.filter(p => 
      p.registration_date?.startsWith(today)
    ).length;

    const totalShares = participants.reduce((sum, p) => sum + (p.shares || 0), 0);
    const totalReferrals = participants.filter(p => p.referred_by).length;
    const completed = participants.filter(p => p.progress >= 100).length;
    const completionRate = participants.length > 0 
      ? Math.round((completed / participants.length) * 100) 
      : 0;

    // أكثر المدن
    const cityCounts: { [key: string]: number } = {};
    participants.forEach(p => {
      if (p.city) {
        cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
      }
    });

    const topCities = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // التسجيلات اليومية (آخر 7 أيام)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyRegistrations = last7Days.map(date => ({
      date,
      count: participants.filter(p => 
        p.registration_date?.startsWith(date)
      ).length
    }));

    return NextResponse.json({
      totalParticipants: participants.length,
      newToday,
      totalShares,
      totalReferrals,
      completionRate,
      topCities,
      dailyRegistrations
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب التحليلات' },
      { status: 500 }
    );
  }
}
