'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Users, Gift, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

interface Stats {
  contests: number;
  progress: number;
  referrals: number;
  rewards: number;
}

export default function ParticipantDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    contests: 0,
    progress: 0,
    referrals: 0,
    rewards: 0
  });
  const [loading, setLoading] = useState(true);
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (userRole !== 'participant') {
      router.push('/register/participant');
      return;
    }

    setParticipantName(userName || 'المشارك');
    
    setTimeout(() => {
      setStats({
        contests: 5,
        progress: 65,
        referrals: 3,
        rewards: 2
      });
      setLoading(false);
    }, 500);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole="participant" userName={participantName} />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة تحكم المشارك</h1>
          <p className="text-gray-600">مرحباً بك {participantName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">المسابقات</h3>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.contests}</p>
            <p className="text-sm text-gray-500 mt-2">مسابقة مشترك فيها</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">التقدم</h3>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.progress}%</p>
            <p className="text-sm text-gray-500 mt-2">إجمالي التقدم</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">الإحالات</h3>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.referrals}</p>
            <p className="text-sm text-gray-500 mt-2">أصدقاء أحالوا</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">الجوائز</h3>
              <Gift className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.rewards}</p>
            <p className="text-sm text-gray-500 mt-2">جائزة فزت بها</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/participant/contests"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">المسابقات</h3>
            <p className="text-gray-600 text-sm">عرض المسابقات المتاحة</p>
          </Link>

          <Link
            href="/participant/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">الملف الشخصي</h3>
            <p className="text-gray-600 text-sm">عرض بيانات الملف الشخصي</p>
          </Link>

          <Link
            href="/participant/referrals"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">الإحالات</h3>
            <p className="text-gray-600 text-sm">عرض كود الإحالة الخاص بك</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
