'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Phone, ArrowRight } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

export default function CompanyRegistration() {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subscription_plan: 'free'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/v1/companies/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || 'فشل التسجيل');
        return;
      }

      showSuccess('🎉 تم تسجيل الشركة بنجاح!');
      
      // حفظ بيانات الشركة
      localStorage.setItem('company', JSON.stringify(data.company));
      localStorage.setItem('adminCredentials', JSON.stringify(data.adminCredentials));

      // إعادة التوجيه إلى لوحة الشركة
      setTimeout(() => {
        router.push('/company/dashboard');
      }, 1500);
    } catch (error) {
      showError('حدث خطأ في التسجيل');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الشركة</h1>
          <p className="text-gray-600">انضم إلى منصة LandSpice كراعي مسابقات</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الشركة
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="أدخل اسم الشركة"
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
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="رقم الهاتف"
              />
            </div>
          </div>

          {/* Subscription Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              خطة الاشتراك
            </label>
            <select
              name="subscription_plan"
              value={formData.subscription_plan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="free">مجاني - مسابقة واحدة</option>
              <option value="pro">Pro - 5 مسابقات</option>
              <option value="enterprise">Enterprise - مسابقات غير محدودة</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل الشركة'}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              هل لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => router.push('/company/login')}
                className="text-purple-600 hover:text-purple-700 font-semibold flex items-center justify-center gap-1 mx-auto"
              >
                تسجيل الدخول
                <ArrowRight className="w-4 h-4" />
              </button>
            </p>
          </div>
        </form>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-sm">
            <div className="text-2xl font-bold text-purple-600">∞</div>
            <p className="text-gray-600">مسابقات</p>
          </div>
          <div className="text-sm">
            <div className="text-2xl font-bold text-blue-600">∞</div>
            <p className="text-gray-600">مشاركين</p>
          </div>
          <div className="text-sm">
            <div className="text-2xl font-bold text-green-600">✓</div>
            <p className="text-gray-600">دعم 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
