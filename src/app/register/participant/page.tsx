'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Mail, Phone, MapPin, Gift } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

export default function ParticipantRegistration() {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    referredBy: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/v1/participants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || 'فشل التسجيل');
        return;
      }

      showSuccess('🎉 تم التسجيل بنجاح في جميع المسابقات!');
      
      // حفظ بيانات المشارك
      localStorage.setItem('participant', JSON.stringify(data.participant));

      // إعادة التوجيه إلى الصفحة الرئيسية
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      showError('حدث خطأ في التسجيل');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل المشارك</h1>
          <p className="text-gray-600">انضم إلى جميع المسابقات المتاحة</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="أدخل اسمك الكامل"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="البريد الإلكتروني"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="رقم الهاتف"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المدينة
            </label>
            <div className="relative">
              <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="المدينة"
              />
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كود الإحالة (اختياري)
            </label>
            <div className="relative">
              <Gift className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="كود الإحالة"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل المشارك'}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              هل لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        </form>

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <span>الاشتراك في جميع المسابقات المتاحة</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <span>فرص للفوز بجوائز من كل شركة</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <span>كود إحالة فريد للحصول على مكافآت</span>
          </div>
        </div>
      </div>
    </div>
  );
}
