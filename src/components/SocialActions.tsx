'use client';

import { Participant, ContestSettings } from '@/types';
import SocialFollowButton from './SocialFollowButton';
import ProgressTracker from './ProgressTracker';
import ReferralLinkBox from './ReferralLinkBox';
import ShareButton from './ShareButton';
import ShareStats from './ShareStats';
import { socialPlatformsData } from '@/lib/socialPlatforms';
import { useFollowProgress } from '@/hooks/useFollowProgress';

interface SocialActionsProps {
  participant: Participant;
  settings: ContestSettings | null;
  onProgressUpdate: (participant: Participant) => void;
}

export default function SocialActions({ participant: initialParticipant, settings, onProgressUpdate }: SocialActionsProps) {
  const {
    participant: currentParticipant, // البيانات المحدثة من الـ hook
    completedCount,
    progressPercentage,
    isPlatformCompleted,
    updateProgress,
    isUpdating,
    error
  } = useFollowProgress(initialParticipant);

  // استخدام البيانات المحدثة في باقي المكون
  const participant = currentParticipant;

  // الحصول على رابط المنصة من الإعدادات
  const getPlatformUrl = (platformId: string): string => {
    switch (platformId) {
      case 'facebook':
        return settings?.facebook_url || 'https://facebook.com/LandSpice25';
      case 'instagram':
        return settings?.instagram_url || 'https://instagram.com/LandSpice25';
      case 'youtube':
        return settings?.youtube_url || 'https://youtube.com/@LandSpice';
      case 'tiktok':
        return settings?.tiktok_url || 'https://tiktok.com/@LandSpice';
      case 'twitter':
        return settings?.twitter_url || 'https://x.com/LandSpice25';
      case 'facebook_channel':
        return settings?.facebook_channel_url || 'https://whatsapp.com/channel/0029Vb62xmZC6ZvZa3u0Yn0C';
      default:
        return '#';
    }
  };

  // معالجة المتابعة
  const handleFollow = async (platformId: string) => {
    const result = await updateProgress(platformId, 'follow');

    if (result.success && result.data) {
      // البيانات المحلية يتم تحديثها تلقائياً بواسطة الـ hook
      // يمكن للمكون الأب الوصول إلى البيانات المحدثة من خلال currentParticipant
      console.log('تم تحديث التقدم بنجاح:', result.data);
    }
  };

  // معالجة المشاركة
  const handleShare = async (platformId: string) => {
    try {
      // تحديث عدد المشاركات
      const result = await updateProgress(platformId, 'share');
      if (result.success && result.data) {
        // البيانات المحلية يتم تحديثها تلقائياً بواسطة الـ hook
        console.log('تم تحديث المشاركة بنجاح:', result.data);
      }
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  // عرض رسالة خطأ إذا كان هناك خطأ في الـ hook
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <p className="text-lg font-semibold">حدث خطأ في تحديث التقدم</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary"
        >
          إعادة تحميل الصفحة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Tracker */}
      <ProgressTracker
        completedCount={completedCount}
        totalCount={6}
        progressPercentage={progressPercentage}
      />

      {/* Loading indicator when updating */}
      {isUpdating && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">جاري تحديث التقدم...</span>
          </div>
        </div>
      )}

      {/* Social Media Follow Section */}
      <div className="card">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            📱 تابع صفحاتنا على وسائل التواصل
          </h3>
          <p className="text-gray-600 text-lg">
            اضغط على كل منصة وتابعنا لزيادة فرصك في الفوز
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPlatformsData.map((platform) => (
            <SocialFollowButton
              key={platform.id}
              platform={platform}
              url={getPlatformUrl(platform.id)}
              isFollowed={isPlatformCompleted(platform.id)}
              onFollow={() => handleFollow(platform.id)}
            />
          ))}
        </div>
      </div>

      {/* Referral Link Section */}
      <ReferralLinkBox 
        referralCode={participant.referral_code}
        showNativeShare={true}
      />

      {/* Share Section */}
      <div className="card">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            📢 شارك المسابقة على وسائل التواصل
          </h3>
          <p className="text-gray-600 text-lg">
            شارك المسابقة مع أصدقائك على جميع المنصات واحصل على نقاط إضافية
          </p>
        </div>

        {/* Share Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {socialPlatformsData.filter(p => p.shareSupported).map((platform) => (
            <ShareButton
              key={`share-${platform.id}`}
              platform={platform}
              referralCode={participant.referral_code}
              onShare={() => handleShare(platform.id)}
              compact={true}
            />
          ))}
        </div>
      </div>

      {/* Share Statistics */}
      <ShareStats 
        totalShares={participant.shares}
        totalReferrals={0}
      />
    </div>
  );
}
