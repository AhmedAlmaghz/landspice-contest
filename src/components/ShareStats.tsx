'use client';

import { Share2, Users, TrendingUp, Award } from 'lucide-react';

interface ShareStatsProps {
  totalShares: number;
  totalReferrals: number;
}

export default function ShareStats({ totalShares, totalReferrals }: ShareStatsProps) {
  // حساب المستوى بناءً على عدد المشاركات
  const getShareLevel = (shares: number): { level: string; color: string; icon: string } => {
    if (shares === 0) {
      return { level: 'مبتدئ', color: 'gray', icon: '🌱' };
    } else if (shares < 5) {
      return { level: 'نشط', color: 'blue', icon: '⭐' };
    } else if (shares < 10) {
      return { level: 'متميز', color: 'purple', icon: '🔥' };
    } else if (shares < 20) {
      return { level: 'محترف', color: 'orange', icon: '💎' };
    } else {
      return { level: 'أسطوري', color: 'yellow', icon: '👑' };
    }
  };

  // رسالة تشجيعية بناءً على الإحصائيات
  const getEncouragementMessage = (): string => {
    if (totalShares === 0) {
      return 'ابدأ بمشاركة المسابقة مع أصدقائك الآن!';
    } else if (totalShares < 5) {
      return 'بداية رائعة! استمر في المشاركة';
    } else if (totalShares < 10) {
      return 'أداء ممتاز! أنت في الطريق الصحيح';
    } else if (totalShares < 20) {
      return 'مذهل! أنت من أفضل المشاركين';
    } else {
      return 'أنت بطل المشاركة! استمر في التألق';
    }
  };

  const shareLevel = getShareLevel(totalShares);
  const encouragement = getEncouragementMessage();

  return (
    <div className="space-y-6">
      {/* Main Stats Card */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            📊 إحصائيات المشاركة
          </h3>
          <p className="text-gray-600">
            {encouragement}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total Shares */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <Share2 className="w-6 h-6" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {totalShares}
              </div>
              <div className="text-sm text-gray-600">
                مشاركة
              </div>
            </div>
          </div>

          {/* Total Referrals */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {totalReferrals}
              </div>
              <div className="text-sm text-gray-600">
                إحالة ناجحة
              </div>
            </div>
          </div>
        </div>

        {/* Level Badge */}
        <div className={`bg-gradient-to-r from-${shareLevel.color}-500 to-${shareLevel.color}-600 rounded-xl p-4 text-white text-center`}>
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-2">{shareLevel.icon}</span>
            <Award className="w-6 h-6" />
          </div>
          <div className="text-lg font-bold mb-1">
            مستوى المشاركة: {shareLevel.level}
          </div>
          <div className="text-sm text-white/90">
            {totalShares < 20 
              ? `شارك ${20 - totalShares} مرة أخرى للوصول للمستوى التالي`
              : 'لقد وصلت للمستوى الأعلى! 🎉'
            }
          </div>
        </div>
      </div>

      {/* Achievements */}
      {totalShares > 0 && (
        <div className="card">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
            🏆 إنجازاتك
          </h4>
          <div className="space-y-3">
            {/* First Share */}
            <div className={`flex items-center p-3 rounded-lg ${totalShares >= 1 ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-100'}`}>
              <div className="text-2xl mr-3">
                {totalShares >= 1 ? '✅' : '⬜'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">المشاركة الأولى</div>
                <div className="text-sm text-gray-600">شارك المسابقة لأول مرة</div>
              </div>
            </div>

            {/* 5 Shares */}
            <div className={`flex items-center p-3 rounded-lg ${totalShares >= 5 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-100'}`}>
              <div className="text-2xl mr-3">
                {totalShares >= 5 ? '✅' : '⬜'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">مشارك نشط</div>
                <div className="text-sm text-gray-600">شارك 5 مرات أو أكثر</div>
              </div>
            </div>

            {/* 10 Shares */}
            <div className={`flex items-center p-3 rounded-lg ${totalShares >= 10 ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-100'}`}>
              <div className="text-2xl mr-3">
                {totalShares >= 10 ? '✅' : '⬜'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">مشارك محترف</div>
                <div className="text-sm text-gray-600">شارك 10 مرات أو أكثر</div>
              </div>
            </div>

            {/* First Referral */}
            {totalReferrals > 0 && (
              <div className="flex items-center p-3 rounded-lg bg-yellow-100 border-2 border-yellow-300">
                <div className="text-2xl mr-3">✅</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">مُحيل ناجح</div>
                  <div className="text-sm text-gray-600">حصلت على إحالة ناجحة</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      {totalShares === 0 && (
        <div className="card bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              💡 نصائح لزيادة فرصك
            </h4>
            <ul className="text-sm text-gray-700 space-y-2 text-right">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>شارك المسابقة على جميع منصات التواصل الاجتماعي</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>أرسل رابط الإحالة لأصدقائك مباشرة</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>شارك في المجموعات والقنوات المختلفة</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>كلما زادت مشاركاتك، زادت فرصك في الفوز</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
