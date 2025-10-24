'use client';

import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ContestSubscribeFormProps {
  contestId: number;
  contestTitle: string;
  onSuccess?: () => void;
}

export default function ContestSubscribeForm({
  contestId,
  contestTitle,
  onSuccess
}: ContestSubscribeFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/v1/contests/${contestId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantName: formData.name,
          participantEmail: formData.email,
          participantPhone: formData.phone,
          participantCity: formData.city,
          participantId: Math.random().toString(36).substring(7)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'حدث خطأ في الاشتراك');
        return;
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', city: '' });
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (error) {
      console.error('Error subscribing:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">تم الاشتراك بنجاح!</h3>
        <p className="text-green-700">
          شكراً لاشتراكك في مسابقة "{contestTitle}"
        </p>
        <p className="text-sm text-green-600 mt-2">
          يمكنك الآن متابعة الشبكات الاجتماعية والمشاركة في المسابقة
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        اشترك في مسابقة "{contestTitle}"
      </h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الاسم الكامل
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="أدخل اسمك الكامل"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="أدخل بريدك الإلكتروني"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="أدخل رقم هاتفك"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            المدينة
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="أدخل مدينتك"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'جاري الاشتراك...' : 'اشترك الآن'}
      </button>

      <p className="text-xs text-gray-600 text-center mt-4">
        بالاشتراك، أنت توافق على شروط المسابقة وسياسة الخصوصية
      </p>
    </form>
  );
}
