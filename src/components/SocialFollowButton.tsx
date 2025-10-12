'use client';

import { useState } from 'react';
import { Facebook, Instagram, Youtube, Twitter, ExternalLink, CheckCircle, Loader2, Video } from 'lucide-react';
import { SocialPlatformData } from '@/lib/socialPlatforms';
import { useNotification } from '@/contexts/NotificationContext';

interface SocialFollowButtonProps {
  platform: SocialPlatformData;
  url: string;
  isFollowed: boolean;
  onFollow: () => Promise<void>;
}

export default function SocialFollowButton({ 
  platform, 
  url, 
  isFollowed, 
  onFollow 
}: SocialFollowButtonProps) {
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getIcon = () => {
    const iconClass = "w-6 h-6";
    switch (platform.icon) {
      case 'facebook':
        return <Facebook className={iconClass} />;
      case 'instagram':
        return <Instagram className={iconClass} />;
      case 'youtube':
        return <Youtube className={iconClass} />;
      case 'twitter':
        return <Twitter className={iconClass} />;
      case 'tiktok':
        return <Video className={iconClass} />;
      default:
        return <ExternalLink className={iconClass} />;
    }
  };

  const handleClick = async () => {
    if (isFollowed) return;

    // فتح الرابط في نافذة جديدة
    window.open(url, '_blank', 'width=800,height=600');
    
    // إظهار نافذة التأكيد بعد ثانيتين
    setTimeout(() => {
      setShowConfirmation(true);
    }, 2000);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onFollow();
      setShowConfirmation(false);
      showSuccess(`✅ رائع! تمت متابعة ${platform.nameAr} بنجاح`);
    } catch (error) {
      console.error('Error confirming follow:', error);
      showError(`حدث خطأ أثناء تأكيد المتابعة. يرجى المحاولة مرة أخرى.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="social-card">
      {/* Platform Icon */}
      <div className="flex justify-center mb-4">
        <div 
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${platform.gradient} transform transition-transform hover:scale-110`}
        >
          {getIcon()}
        </div>
      </div>

      {/* Platform Name */}
      <h4 className="text-xl font-bold text-gray-800 mb-2 text-center">
        {platform.nameAr}
      </h4>

      {/* Status */}
      <div className="text-center mb-4">
        {isFollowed ? (
          <div className="flex items-center justify-center text-green-600 font-semibold">
            <CheckCircle className="w-5 h-5 ml-2" />
            <span>{platform.followedText}</span>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            {platform.instructions}
          </p>
        )}
      </div>

      {/* Follow Button */}
      {!isFollowed && !showConfirmation && (
        <button
          onClick={handleClick}
          className={`btn w-full bg-gradient-to-r ${platform.gradient} text-white hover:shadow-xl transition-all duration-300`}
        >
          <ExternalLink className="w-4 h-4 ml-2" />
          {platform.followText}
        </button>
      )}

      {/* Followed Badge */}
      {isFollowed && (
        <div className="w-full p-3 bg-green-50 border-2 border-green-200 rounded-lg text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <span className="text-sm font-semibold text-green-700">
            تمت المتابعة بنجاح
          </span>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && !isFollowed && (
        <div className="animate-fade-in">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-3">
            <p className="text-sm text-gray-700 text-center mb-3">
              ✅ هل قمت بمتابعة {platform.nameAr}؟
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="btn btn-success flex-1 text-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التأكيد...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 ml-2" />
                    نعم، تابعت
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="btn btn-secondary flex-1 text-sm disabled:opacity-50"
              >
                لا، لم أتابع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
