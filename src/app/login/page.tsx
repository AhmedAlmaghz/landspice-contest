'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const searchValue = loginMethod === 'email' ? email : phone;

      // البحث عن المشارك باستخدام البريد الإلكتروني أو رقم الهاتف
      const response = await fetch(`/api/participants/search?${loginMethod}=${encodeURIComponent(searchValue)}`);

      if (!response.ok) {
        throw new Error('لم يتم العثور على حساب بهذه البيانات');
      }

      const data = await response.json();

      if (data.participant) {
        // حفظ بيانات المشارك في localStorage
        localStorage.setItem('contestParticipant', JSON.stringify(data.participant));

        // توجيه إلى لوحة التحكم
        router.push('/dashboard');
      } else {
        setError('لم يتم العثور على حساب بهذه البيانات');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🌶️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">ادخل بيانات حسابك للوصول إلى لوحة التحكم</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold transition-colors ${
              loginMethod === 'email'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            البريد الإلكتروني
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold transition-colors ${
              loginMethod === 'phone'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            رقم الهاتف
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {loginMethod === 'email' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="أدخل رقم هاتفك"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة إلى الصفحة الرئيسية
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>مساعدة:</strong> إذا كنت تواجه مشكلة في تسجيل الدخول، تأكد من إدخال البيانات الصحيحة التي استخدمتها أثناء التسجيل في المسابقة.
          </p>
        </div>
      </div>
    </div>
  );
}
