'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Copy, Share2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

export default function ParticipantReferrals() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const referralCode = 'ABC123XYZ';
  const referralLink = `http://localhost:3000/register/participant?ref=${referralCode}`;

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

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">الإحالات</h1>
        <p className="text-gray-600 mb-8">شارك كود الإحالة الخاص بك واحصل على مكافآت</p>

        {/* Referral Code Card */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-md p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">كود الإحالة الخاص بك</h2>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
            <p className="text-purple-100 text-sm mb-2">الكود</p>
            <p className="text-3xl font-bold">{referralCode}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Copy className="w-5 h-5" />
              {copied ? 'تم النسخ!' : 'نسخ الرابط'}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
              مشاركة
            </button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">رابط الإحالة</h3>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <code className="text-sm text-gray-600 break-all">{referralLink}</code>
            <button
              onClick={handleCopy}
              className="ml-4 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Referrals Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-gray-600 text-sm mt-2">أصدقاء أحالوا</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Gift className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-3xl font-bold text-gray-900">150</p>
            <p className="text-gray-600 text-sm mt-2">نقطة مكافآت</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Gift className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-3xl font-bold text-gray-900">2</p>
            <p className="text-gray-600 text-sm mt-2">جائزة فزت بها</p>
          </div>
        </div>
      </div>
    </div>
  );
}
