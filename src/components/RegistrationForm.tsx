'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Gift } from 'lucide-react';
import { RegistrationData, Participant } from '@/types';
import { validateName, validateEmail, validatePhone, validateCity, validateReferralCode } from '@/lib/validation';
import { useNotification } from '@/contexts/NotificationContext';

interface RegistrationFormProps {
  onSuccess: (participant: Participant) => void;
  initialReferralCode?: string;
}

export default function RegistrationForm({ onSuccess, initialReferralCode = '' }: RegistrationFormProps) {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    referredBy: initialReferralCode
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // تحديث كود الإحالة عند تغييره
  useEffect(() => {
    if (initialReferralCode) {
      setFormData(prev => ({ ...prev, referredBy: initialReferralCode }));
    }
  }, [initialReferralCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'حدث خطأ في التسجيل';
        showError(errorMessage);
        throw new Error(errorMessage);
      }

      // Create participant object with the response data
      const participant: Participant = {
        id: data.participant.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        referral_code: data.participant.referral_code,
        referred_by: formData.referredBy || undefined,
        registration_date: new Date().toISOString(),
        progress: 0,
        shares: 0,
        facebook_followed: false,
        instagram_followed: false,
        youtube_followed: false,
        tiktok_followed: false,
        twitter_followed: false,
        facebook_channel_followed: false,
      };

      showSuccess('🎉 تم التسجيل بنجاح! مرحباً بك في المسابقة');
      onSuccess(participant);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      // عرض الإشعار فقط إذا لم يتم عرضه مسبقاً
      if (!(err instanceof Error) || !err.message.includes('حدث خطأ في التسجيل')) {
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // مسح رسالة الخطأ للحقل عند التعديل
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // التحقق الفوري من الحقل
    validateField(name, value);
  };

  const validateField = (fieldName: string, value: string) => {
    let validation: { isValid: boolean; message?: string } = { isValid: true };
    
    switch (fieldName) {
      case 'name':
        validation = validateName(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'phone':
        validation = validatePhone(value);
        break;
      case 'city':
        validation = validateCity(value);
        break;
      case 'referredBy':
        if (value && value.trim().length > 0) {
          validation = {
            isValid: validateReferralCode(value),
            message: validateReferralCode(value) ? undefined : 'كود الإحالة غير صحيح'
          };
        }
        break;
    }
    
    if (!validation.isValid && validation.message) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: validation.message! }));
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">📝 سجل في المسابقة</h3>
        <p className="text-gray-600">املأ البيانات التالية للمشاركة في المسابقة</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              الاسم الكامل *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`input transition-all duration-200 ${fieldErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="أدخل اسمك الكامل"
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`input transition-all duration-200 ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="example@email.com"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              رقم الهاتف *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={`input transition-all duration-200 ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="7xxxxxxxx"
            />
            {fieldErrors.phone && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">{fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-2" />
              المدينة *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className={`input transition-all duration-200 ${fieldErrors.city ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="المدينة"
            />
            {fieldErrors.city && (
              <p className="text-red-500 text-sm mt-1 animate-fade-in">{fieldErrors.city}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="referredBy" className="block text-sm font-semibold text-gray-700 mb-2">
            <Gift className="inline w-4 h-4 mr-2" />
            كود الإحالة (اختياري)
          </label>
          <input
            type="text"
            id="referredBy"
            name="referredBy"
            value={formData.referredBy}
            onChange={handleChange}
            className={`input transition-all duration-200 ${fieldErrors.referredBy ? 'border-red-500 focus:border-red-500' : ''} ${initialReferralCode ? 'bg-green-50 border-green-300' : ''}`}
            placeholder="أدخل كود الإحالة إذا كان لديك"
            readOnly={!!initialReferralCode}
          />
          {fieldErrors.referredBy && (
            <p className="text-red-500 text-sm mt-1 animate-fade-in">{fieldErrors.referredBy}</p>
          )}
          {initialReferralCode && (
            <p className="text-green-600 text-sm mt-1 animate-fade-in flex items-center">
              <Gift className="w-4 h-4 ml-1" />
              تم تطبيق كود الإحالة تلقائياً
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              جاري التسجيل...
            </div>
          ) : (
            'سجل في المسابقة'
          )}
        </button>
      </form>
    </div>
  );
}
