'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

interface Contest {
  id: number;
  title: string;
  status: string;
  participants: number;
  end_date: string;
}

export default function CompanyContests() {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'company') {
      router.push('/company/login');
      return;
    }

    // محاكاة جلب المسابقات
    setTimeout(() => {
      setContests([
        {
          id: 1,
          title: 'مسابقة المتابعة الأولى',
          status: 'active',
          participants: 150,
          end_date: '2025-11-23'
        },
        {
          id: 2,
          title: 'مسابقة المشاركة الثانية',
          status: 'active',
          participants: 100,
          end_date: '2025-11-30'
        }
      ]);
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">المسابقات</h1>
            <p className="text-gray-600">إدارة مسابقاتك</p>
          </div>
          <Link
            href="/company/contests/new"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            مسابقة جديدة
          </Link>
        </div>

        {/* Contests Table */}
        {contests.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">العنوان</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المشاركون</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">تاريخ الانتهاء</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((contest) => (
                  <tr key={contest.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-semibold">{contest.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        contest.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contest.status === 'active' ? 'نشطة' : 'منتهية'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{contest.participants}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(contest.end_date).toLocaleDateString('ar-SA')}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد مسابقات</h3>
            <p className="text-gray-600 mb-6">ابدأ بإنشاء مسابقة جديدة</p>
            <Link
              href="/company/contests/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              إنشاء مسابقة
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
