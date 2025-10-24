'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, Users, Trophy } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

export default function CompanyAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'company') {
      router.push('/company/login');
      return;
    }

    setTimeout(() => {
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
      <Navigation userRole="company" />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">التحليلات</h1>
        <p className="text-gray-600 mb-8">عرض التقارير والإحصائيات</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">إجمالي المشاركات</h3>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">1,250</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">معدل التفاعل</h3>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">75%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">المشاركون النشطون</h3>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">450</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">الفائزون المعلنون</h3>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">25</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">الرسوم البيانية</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">سيتم عرض الرسوم البيانية هنا</p>
          </div>
        </div>
      </div>
    </div>
  );
}
