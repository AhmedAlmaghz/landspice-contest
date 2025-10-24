'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  LogOut, 
  Share2, 
  TrendingUp, 
  Award,
  Link as LinkIcon,
  CheckCircle,
  Clock
} from 'lucide-react';
import ProgressTracker from '@/components/ProgressTracker';
import ShareButton from '@/components/ShareButton';
import ReferralLinkBox from '@/components/ReferralLinkBox';
import ShareStats from '@/components/ShareStats';
import { Participant } from '@/types';

export default function UserDashboard() {
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParticipant();
  }, []);

  const loadParticipant = async () => {
    try {
      // Get participant from localStorage
      const saved = localStorage.getItem('contestParticipant');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setParticipant(data);
        } catch (parseError) {
          console.error('Error parsing participant data:', parseError);
          localStorage.removeItem('contestParticipant');
          router.push('/');
          return;
        }
        
        // Refresh from API
        const response = await fetch(`/api/participants?email=${data.email}`);
        if (response.ok) {
          const result = await response.json();
          if (result.participants && result.participants.length > 0) {
            const updated = result.participants[0];
            setParticipant(updated);
            localStorage.setItem('contestParticipant', JSON.stringify(updated));
          }
        }
      }
    } catch (error) {
      console.error('Error loading participant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      localStorage.removeItem('contestParticipant');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!participant) {
    router.push('/');
    return null;
  }

  const level = Math.floor(participant.progress / 20);
  const levels = ['مبتدئ 🌱', 'متوسط 🌿', 'متقدم 🌳', 'محترف ⭐', 'نجم 🏆'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{participant.name}</h2>
                <p className="text-white/80 text-sm">{participant.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">
            مرحباً بك في لوحة التحكم! 👋
          </h1>
          <p className="text-white/80 text-lg">
            تابع تقدمك وشارك المسابقة مع أصدقائك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">تقدمك في المسابقة</h3>
              </div>
              <ProgressTracker 
                completedCount={[
                  participant.facebook_followed,
                  participant.instagram_followed,
                  participant.youtube_followed,
                  participant.tiktok_followed,
                  participant.twitter_followed,
                  participant.facebook_channel_followed
                ].filter(Boolean).length}
                totalCount={6}
                progressPercentage={participant.progress}
              />
              
              {/* Level Badge */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">مستواك الحالي</p>
                    <p className="text-2xl font-bold text-gray-900">{levels[level]}</p>
                  </div>
                  <div className="text-5xl">{levels[level].split(' ')[1]}</div>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Share2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">شارك المسابقة</h3>
              </div>
              <p className="text-gray-600 mb-6">
                شارك رابط الإحالة الخاص بك مع أصدقائك واحصل على نقاط إضافية!
              </p>
              <ReferralLinkBox referralCode={participant.referral_code} />
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ShareButton platform={{
                  id: 'facebook',
                  name: 'Facebook',
                  nameAr: 'فيسبوك',
                  icon: 'facebook',
                  color: '#1877F2',
                  gradient: 'from-blue-600 to-blue-700',
                  followText: 'مشاركة',
                  followedText: 'تم',
                  instructions: '',
                  urlPattern: '',
                  shareSupported: true,
                  shareMethod: 'direct'
                }} referralCode={participant.referral_code} compact />
                <ShareButton platform={{
                  id: 'twitter',
                  name: 'Twitter',
                  nameAr: 'تويتر',
                  icon: 'twitter',
                  color: '#1DA1F2',
                  gradient: 'from-sky-500 to-blue-600',
                  followText: 'مشاركة',
                  followedText: 'تم',
                  instructions: '',
                  urlPattern: '',
                  shareSupported: true,
                  shareMethod: 'direct'
                }} referralCode={participant.referral_code} compact />
                <ShareButton platform={{
                  id: 'whatsapp',
                  name: 'WhatsApp',
                  nameAr: 'واتساب',
                  icon: 'whatsapp',
                  color: '#25D366',
                  gradient: 'from-green-500 to-green-600',
                  followText: 'مشاركة',
                  followedText: 'تم',
                  instructions: '',
                  urlPattern: '',
                  shareSupported: true,
                  shareMethod: 'direct'
                }} referralCode={participant.referral_code} compact />
                <button
                  onClick={async () => {
                    const url = `${window.location.origin}?ref=${participant.referral_code}`;
                    try {
                      await navigator.clipboard.writeText(url);
                      // سيتم عرض Toast إذا كان NotificationContext متاح
                      console.log('تم نسخ الرابط بنجاح');
                    } catch (err) {
                      console.error('فشل نسخ الرابط:', err);
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 hover:scale-105 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  📋 نسخ
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-yellow-600" />
                <h3 className="text-2xl font-bold text-gray-900">الإنجازات</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { 
                    name: 'المتابع النشط', 
                    desc: 'تابع جميع المنصات', 
                    achieved: participant.progress >= 100,
                    icon: '✅'
                  },
                  { 
                    name: 'المشارك الاجتماعي', 
                    desc: 'شارك 5 مرات', 
                    achieved: (participant.shares || 0) >= 5,
                    icon: '🎯'
                  },
                  { 
                    name: 'سفير المسابقة', 
                    desc: '3 إحالات ناجحة', 
                    achieved: false,
                    icon: '🌟'
                  },
                  { 
                    name: 'البطل الشامل', 
                    desc: 'أكمل كل شيء', 
                    achieved: participant.progress >= 100 && (participant.shares || 0) >= 5,
                    icon: '🏆'
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      achievement.achieved
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                        <p className="text-sm text-gray-600">{achievement.desc}</p>
                      </div>
                      {achievement.achieved ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">إحصائياتك</h3>
              <ShareStats 
                totalShares={participant.shares || 0}
                totalReferrals={0}
              />
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">معلومات مهمة</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">•</span>
                  <span>أكمل جميع المتطلبات لزيادة فرصك في الفوز</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">•</span>
                  <span>شارك رابط الإحالة مع أصدقائك</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">•</span>
                  <span>تابع صفحاتنا بشكل حقيقي</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-300">•</span>
                  <span>سيتم الإعلان عن الفائزين قريباً</span>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <a
                  href="/"
                  className="block w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg text-center transition-colors"
                >
                  الصفحة الرئيسية
                </a>
                <button
                  onClick={() => loadParticipant()}
                  className="block w-full px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg text-center transition-colors"
                >
                  تحديث البيانات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
