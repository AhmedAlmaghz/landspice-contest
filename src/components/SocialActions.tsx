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

export default function SocialActions({ participant, settings, onProgressUpdate }: SocialActionsProps) {
  const { 
    completedCount, 
    progressPercentage, 
    isPlatformCompleted,
    updateProgress 
  } = useFollowProgress(participant);

  // الحصول على رابط المنصة من الإعدادات
  const getPlatformUrl = (platformId: string): string => {
    switch (platformId) {
      case 'facebook':
        return settings?.facebook_url || 'https://facebook.com/yourpage';
      case 'instagram':
        return settings?.instagram_url || 'https://instagram.com/yourpage';
      case 'youtube':
        return settings?.youtube_url || 'https://youtube.com/@yourchannel';
      case 'tiktok':
        return settings?.tiktok_url || 'https://tiktok.com/@yourpage';
      case 'twitter':
        return settings?.twitter_url || 'https://twitter.com/yourpage';
      case 'facebook_channel':
        return settings?.facebook_channel_url || 'https://facebook.com/yourchannel';
      default:
        return '#';
    }
  };

  // معالجة المتابعة
  const handleFollow = async (platformId: string) => {
    const result = await updateProgress(platformId, 'follow');
    
    if (result.success && result.data) {
      // تحديث بيانات المشارك
      const updatedParticipant = {
        ...participant,
        progress: result.data.progress || participant.progress,
        [`${platformId}_followed`]: true
      };
      onProgressUpdate(updatedParticipant);
    }
  };

  // معالجة المشاركة
  const handleShare = async (platformId: string) => {
    try {
      // تحديث عدد المشاركات
      const result = await updateProgress(platformId, 'share');
      if (result.success && result.data) {
        const updatedParticipant = {
          ...participant,
          shares: result.data.shares || participant.shares + 1
        };
        onProgressUpdate(updatedParticipant);
      }
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Tracker */}
      <ProgressTracker 
        completedCount={completedCount}
        totalCount={6}
        progressPercentage={progressPercentage}
      />

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
