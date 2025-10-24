'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Download, Filter } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

interface Participant {
  id: number;
  name: string;
  email: string;
  city: string;
  progress: number;
  actions: number;
}

export default function CompanyParticipants() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'company') {
      router.push('/company/login');
      return;
    }

    setTimeout(() => {
      setParticipants([
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', city: 'الرياض', progress: 80, actions: 5 },
        { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', city: 'جدة', progress: 60, actions: 3 },
        { id: 3, name: 'محمود حسن', email: 'mahmoud@example.com', city: 'الدمام', progress: 90, actions: 7 },
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">المشاركون</h1>
            <p className="text-gray-600">إدارة المشاركين في مسابقاتك</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            تصدير
          </button>
        </div>

        {participants.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الاسم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المدينة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">التقدم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-semibold">{participant.name}</td>
                    <td className="px-6 py-4 text-gray-600">{participant.email}</td>
                    <td className="px-6 py-4 text-gray-600">{participant.city}</td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${participant.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{participant.actions} إجراء</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">لا يوجد مشاركون</h3>
          </div>
        )}
      </div>
    </div>
  );
}
