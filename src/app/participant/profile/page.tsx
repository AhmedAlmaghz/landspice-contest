'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

export default function ParticipantProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'participant') {
      router.push('/register/participant');
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
      <Navigation userRole="participant" />
      <Breadcrumb />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">الملف الشخصي</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">أحمد محمد</h2>
              <p className="text-gray-600">مشارك نشط</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <Mail className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <p className="text-lg font-semibold text-gray-900">ahmed@example.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <Phone className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">رقم الهاتف</p>
                <p className="text-lg font-semibold text-gray-900">+966501234567</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <MapPin className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">المدينة</p>
                <p className="text-lg font-semibold text-gray-900">الرياض</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <User className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">كود الإحالة</p>
                <p className="text-lg font-semibold text-gray-900">ABC123XYZ</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-8 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            تعديل البيانات
          </button>
        </div>
      </div>
    </div>
  );
}
