'use client';

import { useState, useRef } from 'react';
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
  const { showSuccess, showInfo, showError } = useNotification();
  const [isSharing, setIsSharing] = useState(false);
  const [justShared, setJustShared] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastShareTime = useRef<number>(0);

  const handleShare = async () => {
    // Debouncing: منع المشاركة المتكررة السريعة
    const now = Date.now();
    if (now - lastShareTime.current < 2000) {
      showInfo('⏳ يرجى الانتظار قليلاً قبل المشاركة مرة أخرى');
      return;
    }
    lastShareTime.current = now;

    // تأثير بصري
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

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
          showInfo(`📋 تم نسخ الرابط بنجاح! ${getCustomShareMessage(platform.id)}`);
        } else {
          showSuccess(`🎉 رائع! تمت مشاركة المسابقة على ${platform.nameAr} بنجاح!`);
        }
        
        // استدعاء callback
        if (onShare) {
          onShare();
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      showError(`❌ ${errorMessage}. يرجى المحاولة مرة أخرى.`);
    } finally {
      setIsSharing(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`btn bg-gradient-to-r ${platform.gradient} text-white disabled:opacity-50 hover:scale-105 hover:shadow-lg transition-all duration-300 ${isAnimating ? 'scale-95' : 'scale-100'}`}
        title={`مشاركة على ${platform.nameAr}`}
      >
        {isSharing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : justShared ? (
          <Check className="w-4 h-4 animate-bounce" />
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
    <div className={`card hover:scale-105 transition-all duration-300 ${isAnimating ? 'scale-95' : 'scale-100'}`}>
      {/* Platform Icon */}
      <div className="flex justify-center mb-4">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${platform.gradient} transition-all duration-300 hover:shadow-xl ${isAnimating ? 'animate-pulse' : ''}`}
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
        className={`btn w-full bg-gradient-to-r ${platform.gradient} text-white disabled:opacity-50 hover:scale-105 hover:shadow-xl transition-all duration-300`}
      >
        {isSharing ? (
          <>
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            جاري المشاركة...
          </>
        ) : justShared ? (
          <>
            <Check className="w-4 h-4 ml-2 animate-bounce" />
            ✅ تمت المشاركة!
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
