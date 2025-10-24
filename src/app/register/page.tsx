'use client';

import { useRouter } from 'next/navigation';
import { Building2, Users, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">اختر نوع الحساب</h1>
          <p className="text-xl text-gray-600">انضم إلى منصة LandSpice كراعي مسابقات أو مشارك</p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Company Registration */}
          <div
            onClick={() => router.push('/register/company')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
          >
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <Building2 className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">تسجيل الشركة</h2>
              <p className="text-center text-purple-100">راعي المسابقات</p>
            </div>

            <div className="p-8">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">إنشاء مسابقات متعددة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">إدارة المشاركين والجوائز</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">تحليلات وتقارير مفصلة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">دعم الشبكات الاجتماعية المتعددة</span>
                </li>
              </ul>

              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all">
                تسجيل الشركة
              </button>
            </div>
          </div>

          {/* Participant Registration */}
          <div
            onClick={() => router.push('/register/participant')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
          >
            <div className="bg-gradient-to-br from-green-600 to-blue-600 p-8 text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <Users className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">تسجيل المشارك</h2>
              <p className="text-center text-green-100">المشاركة في المسابقات</p>
            </div>

            <div className="p-8">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">الاشتراك في جميع المسابقات</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">فرص للفوز بجوائز قيمة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">كود إحالة فريد</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">متابعة التقدم والإحصائيات</span>
                </li>
              </ul>

              <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all">
                تسجيل المشارك
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}
