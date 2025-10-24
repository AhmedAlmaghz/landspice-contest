import { NextResponse } from 'next/server';
import { participantQueries } from '@/lib/database';

export async function GET() {
  try {
    // Get first active contest
    const stats = {
      total: 0,
      completed: 0,
      total_shares: 0,
      total_referrals: 0
    };
    const cityStats: any[] = [];

    // تحويل cityStats إلى topCities
    const topCities = (cityStats as any[]).map(c => ({
      city: c.city,
      count: c.count
    }));

    return NextResponse.json({
      stats: {
        ...stats,
        topCities
      },
      cityStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
