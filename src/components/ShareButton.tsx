'use client';

import { useState } from 'react';
import { Share2, Check, Loader2 } from 'lucide-react';
import { shareOnPlatform, getCustomShareMessage } from '@/lib/shareUtils';
import { SocialPlatformData } from '@/lib/socialPlatforms';
import { useNotification } from '@/contexts/NotificationContext';

interface ShareButtonProps {
  platform: SocialPlatformData;
  referralCode: string;
  onShare?: () => void;
  compact?: boolean;
}

export default function ShareButton({ 
  platform, 
  referralCode, 
  onShare,
  compact = false 
}: ShareButtonProps) {
  const { showSuccess, showInfo } = useNotification();
  const [isSharing, setIsSharing] = useState(false);
  const [justShared, setJustShared] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const referralUrl = `${baseUrl}?ref=${referralCode}`;
      
      const result = await shareOnPlatform(platform.id, referralUrl);
      
      if (result.success) {
        // إظهار رسالة نجاح
        setJustShared(true);
        setTimeout(() => setJustShared(false), 2000);
        
        // إشعار للمنصات التي تتطلب نسخ يدوي
        if (result.method === 'clipboard') {
          showInfo(`✅ تم نسخ الرابط! ${getCustomShareMessage(platform.id)}`);
        } else {
          showSuccess(`🎉 تمت مشاركة المسابقة على ${platform.nameAr} بنجاح!`);
        }
        
        // استدعاء callback
        if (onShare) {
          onShare();
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('حدث خطأ أثناء المشاركة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSharing(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`btn bg-gradient-to-r ${platform.gradient} text-white disabled:opacity-50 transition-all duration-300`}
        title={`مشاركة على ${platform.nameAr}`}
      >
        {isSharing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : justShared ? (
          <Check className="w-4 h-4" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {!compact && (
          <span className="mr-2">{platform.nameAr}</span>
        )}
      </button>
    );
  }

  return (
    <div className="card hover:scale-105 transition-transform duration-300">
      {/* Platform Icon */}
      <div className="flex justify-center mb-4">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${platform.gradient}`}
        >
          <Share2 className="w-8 h-8" />
        </div>
      </div>

      {/* Platform Name */}
      <h4 className="text-lg font-bold text-gray-800 mb-2 text-center">
        {platform.nameAr}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 text-center">
        {getCustomShareMessage(platform.id)}
      </p>

      {/* Share Button */}
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`btn w-full bg-gradient-to-r ${platform.gradient} text-white disabled:opacity-50`}
      >
        {isSharing ? (
          <>
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            جاري المشاركة...
          </>
        ) : justShared ? (
          <>
            <Check className="w-4 h-4 ml-2" />
            تمت المشاركة!
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة
          </>
        )}
      </button>
    </div>
  );
}
