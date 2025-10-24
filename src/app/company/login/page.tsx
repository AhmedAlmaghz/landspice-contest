'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, AlertCircle, Loader } from 'lucide-react';

export default function CompanyLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          type: 'company'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userRole', 'company');
        localStorage.setItem('userEmail', email);
        router.push('/company/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-full mb-4">
            <span className="text-6xl">🏢</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">LandSpice</h1>
          <p className="text-purple-100">دخول الشركات</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-purple-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-white text-sm font-semibold mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-purple-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-purple-200 text-sm">
              ليس لديك حساب؟{' '}
              <Link
                href="/register/company"
                className="text-white font-semibold hover:text-purple-200 transition-colors"
              >
                سجل الآن
              </Link>
            </p>
            <p className="text-purple-200 text-sm">
              <Link
                href="/"
                className="text-white font-semibold hover:text-purple-200 transition-colors"
              >
                العودة للصفحة الرئيسية
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-purple-200 text-xs mt-6">
          © 2025 LandSpice. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
