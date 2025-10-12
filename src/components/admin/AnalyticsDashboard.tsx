'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Share2, UserPlus, Calendar, MapPin } from 'lucide-react';

interface AnalyticsData {
  totalParticipants: number;
  newToday: number;
  totalShares: number;
  totalReferrals: number;
  completionRate: number;
  topCities: { city: string; count: number }[];
  dailyRegistrations: { date: string; count: number }[];
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // بيانات تجريبية
      setAnalytics({
        totalParticipants: 150,
        newToday: 12,
        totalShares: 320,
        totalReferrals: 78,
        completionRate: 30,
        topCities: [
          { city: 'صنعاء', count: 50 },
          { city: 'عدن', count: 40 },
          { city: 'تعز', count: 30 },
          { city: 'إب', count: 20 },
          { city: 'حضرموت', count: 10 }
        ],
        dailyRegistrations: [
          { date: '2025-10-01', count: 15 },
          { date: '2025-10-02', count: 20 },
          { date: '2025-10-03', count: 18 },
          { date: '2025-10-04', count: 25 },
          { date: '2025-10-05', count: 22 },
          { date: '2025-10-06', count: 30 },
          { date: '2025-10-07', count: 12 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const maxRegistrations = Math.max(...analytics.dailyRegistrations.map(d => d.count));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">إجمالي</span>
          </div>
          <div className="text-3xl font-bold mb-1">{analytics.totalParticipants}</div>
          <div className="text-sm opacity-80">مشارك</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <UserPlus className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">اليوم</span>
          </div>
          <div className="text-3xl font-bold mb-1">{analytics.newToday}</div>
          <div className="text-sm opacity-80">مشارك جديد</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Share2 className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">إجمالي</span>
          </div>
          <div className="text-3xl font-bold mb-1">{analytics.totalShares}</div>
          <div className="text-sm opacity-80">مشاركة</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">معدل</span>
          </div>
          <div className="text-3xl font-bold mb-1">{analytics.completionRate}%</div>
          <div className="text-sm opacity-80">الإكمال</div>
        </div>
      </div>

      {/* Daily Registrations Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">التسجيلات اليومية</h3>
        </div>
        
        <div className="space-y-3">
          {analytics.dailyRegistrations.map((day) => (
            <div key={day.date} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">
                {new Date(day.date).toLocaleDateString('ar-YE', { month: 'short', day: 'numeric' })}
              </div>
              <div className="flex-1">
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transition-all duration-500"
                    style={{ width: `${(day.count / maxRegistrations) * 100}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">{day.count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Cities */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-5 h-5 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">أكثر المدن مشاركة</h3>
        </div>

        <div className="space-y-4">
          {analytics.topCities.map((city, index) => (
            <div key={city.city} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">{city.city}</span>
                  <span className="text-sm text-gray-600">{city.count} مشارك</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${(city.count / analytics.totalParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-2">متوسط المشاركات</div>
          <div className="text-2xl font-bold text-gray-900">
            {(analytics.totalShares / analytics.totalParticipants).toFixed(1)}
          </div>
          <div className="text-sm text-gray-500 mt-1">لكل مشارك</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-2">معدل الإحالة</div>
          <div className="text-2xl font-bold text-gray-900">
            {((analytics.totalReferrals / analytics.totalParticipants) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">من المشاركين</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-2">معدل النمو</div>
          <div className="text-2xl font-bold text-green-600">
            +{((analytics.newToday / analytics.totalParticipants) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">اليوم</div>
        </div>
      </div>
    </div>
  );
}
