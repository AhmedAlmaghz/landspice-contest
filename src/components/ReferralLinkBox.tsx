'use client';

import { useState } from 'react';
import { Copy, Check, Link as LinkIcon, Share2 } from 'lucide-react';
import { copyToClipboard, nativeShare } from '@/lib/shareUtils';
import { useNotification } from '@/contexts/NotificationContext';

interface ReferralLinkBoxProps {
  referralCode: string;
  showNativeShare?: boolean;
}

export default function ReferralLinkBox({ 
  referralCode, 
  showNativeShare = true 
}: ReferralLinkBoxProps) {
  const { showSuccess, showError } = useNotification();
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const referralUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}?ref=${referralCode}` 
    : '';

  const handleCopy = async () => {
    const success = await copyToClipboard(referralUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSuccess('📋 تم نسخ رابط الإحالة بنجاح!');
    } else {
      showError('فشل النسخ. يرجى نسخ الرابط يدوياً.');
    }
  };

  const handleNativeShare = async () => {
    setIsSharing(true);
    const shareText = `🎉 انضم إلى مسابقة LandSpice الرائعة!\n\n✨ فرصة للفوز بجوائز قيمة`;
    
    const success = await nativeShare({
      url: referralUrl,
      text: shareText
    });
    
    if (!success) {
      // إذا فشلت المشاركة الأصلية، نسخ الرابط
      await handleCopy();
    }
    
    setIsSharing(false);
  };

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
          <LinkIcon className="w-6 h-6" />
        </div>
      </div>

      <h4 className="text-xl font-bold text-gray-800 mb-2 text-center">
        🔗 رابط الإحالة الخاص بك
      </h4>
      
      <p className="text-sm text-gray-600 mb-4 text-center">
        شارك هذا الرابط مع أصدقائك واحصل على نقاط إضافية عند تسجيلهم
      </p>

      {/* Referral Code Display */}
      <div className="bg-white rounded-lg p-4 mb-4 border-2 border-purple-300">
        <div className="text-center mb-2">
          <span className="text-xs text-gray-500 font-semibold">كود الإحالة</span>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-purple-600 font-mono tracking-wider">
            {referralCode}
          </span>
        </div>
      </div>

      {/* URL Display */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          الرابط الكامل
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="input flex-1 bg-white text-sm font-mono"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={handleCopy}
            className={`btn px-4 transition-all duration-300 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'btn-secondary'
            }`}
            title="نسخ الرابط"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
        {copied && (
          <p className="text-green-600 text-sm mt-2 animate-fade-in flex items-center justify-center">
            <Check className="w-4 h-4 ml-1" />
            تم نسخ الرابط بنجاح!
          </p>
        )}
      </div>

      {/* Native Share Button (للأجهزة المحمولة) */}
      {showNativeShare && typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          disabled={isSharing}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          <Share2 className="w-4 h-4 ml-2" />
          {isSharing ? 'جاري المشاركة...' : 'مشاركة الرابط'}
        </button>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-xs text-blue-800 text-center">
          💡 <strong>نصيحة:</strong> كلما زاد عدد الأشخاص الذين يسجلون عبر رابطك، زادت فرصك في الفوز!
        </p>
      </div>
    </div>
  );
}
