import { NextResponse } from 'next/server';
import { participantQueries, socialActionQueries } from '@/lib/database';

export async function GET() {
  try {
    const stats = participantQueries.getStats.get() as any;
    const cityStats = participantQueries.getByCity.all();
    const dailyRegistrations = participantQueries.getDailyRegistrations.all();
    const socialStats = socialActionQueries.getStats.all();

    return NextResponse.json({
      stats,
      cityStats,
      dailyRegistrations,
      socialStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
