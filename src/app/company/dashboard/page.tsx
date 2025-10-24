'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Trophy, Users, TrendingUp, Plus, LogOut } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

interface Stats {
  contests: number;
  participants: number;
  winners: number;
  totalActions: number;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    contests: 0,
    participants: 0,
    winners: 0,
    totalActions: 0
  });
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (userRole !== 'company') {
      router.push('/company/login');
      return;
    }

    setCompanyName(userEmail || 'الشركة');
    
    // محاكاة جلب الإحصائيات
    setTimeout(() => {
      setStats({
        contests: 5,
        participants: 250,
        winners: 15,
        totalActions: 1200
      });
      setLoading(false);
    }, 500);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole="company" userName={companyName} />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة تحكم الشركة</h1>
          <p className="text-gray-600">مرحباً بك في لوحة التحكم الخاصة بك</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Contests Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">المسابقات</h3>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.contests}</p>
            <p className="text-sm text-gray-500 mt-2">مسابقة نشطة</p>
          </div>

          {/* Participants Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">المشاركون</h3>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.participants}</p>
            <p className="text-sm text-gray-500 mt-2">مشارك إجمالي</p>
          </div>

          {/* Winners Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">الفائزون</h3>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.winners}</p>
            <p className="text-sm text-gray-500 mt-2">فائز معلن</p>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">الإجراءات</h3>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalActions}</p>
            <p className="text-sm text-gray-500 mt-2">إجراء إجمالي</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Create Contest */}
          <Link
            href="/company/contests"
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-md p-8 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Plus className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">إنشاء مسابقة جديدة</h3>
                <p className="text-purple-100 text-sm mt-1">ابدأ مسابقة جديدة الآن</p>
              </div>
            </div>
          </Link>

          {/* View Participants */}
          <Link
            href="/company/participants"
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md p-8 text-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">عرض المشاركين</h3>
                <p className="text-blue-100 text-sm mt-1">إدارة المشاركين والإحصائيات</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/company/contests"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">المسابقات</h3>
            <p className="text-gray-600 text-sm">إدارة مسابقاتك</p>
          </Link>

          <Link
            href="/company/platforms"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">الشبكات الاجتماعية</h3>
            <p className="text-gray-600 text-sm">إدارة الشبكات</p>
          </Link>

          <Link
            href="/company/analytics"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">التحليلات</h3>
            <p className="text-gray-600 text-sm">عرض التقارير والإحصائيات</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
