/**
 * دوال مساعدة للمشاركة على وسائل التواصل الاجتماعي
 */

export interface ShareData {
  url: string;
  text: string;
  hashtags?: string[];
}

/**
 * توليد رابط الإحالة مع كود المشارك
 */
export function generateReferralUrl(baseUrl: string, referralCode: string): string {
  return `${baseUrl}?ref=${referralCode}`;
}

/**
 * توليد نص المشاركة الافتراضي
 */
export function generateShareText(referralUrl: string, customText?: string): string {
  if (customText) {
    return `${customText}\n\n${referralUrl}`;
  }
  
  return `🎉 انضم إلى مسابقة LandSpice الرائعة!\n\n` +
         `✨ فرصة للفوز بجوائز قيمة\n` +
         `🎁 اشترك الآن وشارك مع أصدقائك\n\n` +
         `${referralUrl}`;
}

/**
 * توليد رابط مشاركة Facebook
 */
export function generateFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

/**
 * توليد رابط مشاركة Twitter
 */
export function generateTwitterShareUrl(text: string, url: string, hashtags?: string[]): string {
  const fullText = `${text}\n${url}`;
  let shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
  
  if (hashtags && hashtags.length > 0) {
    shareUrl += `&hashtags=${hashtags.join(',')}`;
  }
  
  return shareUrl;
}

/**
 * توليد رابط مشاركة WhatsApp
 */
export function generateWhatsAppShareUrl(text: string, url: string): string {
  const fullText = `${text}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(fullText)}`;
}

/**
 * توليد رابط مشاركة Telegram
 */
export function generateTelegramShareUrl(text: string, url: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

/**
 * توليد رابط مشاركة LinkedIn
 */
export function generateLinkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

/**
 * نسخ نص إلى الحافظة
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // محاولة استخدام Clipboard API أولاً (الطريقة الحديثة)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (clipboardError) {
        console.warn('Clipboard API failed:', clipboardError);
      }
    }

    // Fallback method باستخدام document.execCommand
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.readOnly = true;

      document.body.appendChild(textArea);

      // محاولة جعل العنصر مركزاً
      textArea.focus();
      textArea.select();

      const success = document.execCommand('copy');

      // تنظيف العنصر
      document.body.removeChild(textArea);

      if (success) {
        return true;
      }

      throw new Error('execCommand failed');

    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      return false;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * فتح نافذة مشاركة
 */
export function openShareWindow(url: string, title: string = 'مشاركة'): void {
  const width = 600;
  const height = 500;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  window.open(
    url,
    title,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
  );
}

/**
 * مشاركة عبر Web Share API (للأجهزة المحمولة)
 */
export async function nativeShare(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }
  
  try {
    await navigator.share({
      title: 'مسابقة LandSpice',
      text: data.text,
      url: data.url
    });
    return true;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
}

/**
 * مشاركة على منصة معينة
 */
export async function shareOnPlatform(
  platform: string,
  referralUrl: string,
  customText?: string
): Promise<{ success: boolean; method: 'native' | 'window' | 'clipboard' }> {
  const shareText = generateShareText(referralUrl, customText);
  
  // محاولة استخدام Native Share API أولاً (للأجهزة المحمولة)
  if (platform === 'native') {
    const success = await nativeShare({ url: referralUrl, text: shareText });
    if (success) {
      return { success: true, method: 'native' };
    }
  }
  
  let shareUrl = '';
  
  switch (platform) {
    case 'facebook':
      shareUrl = generateFacebookShareUrl(referralUrl);
      break;
    case 'twitter':
      shareUrl = generateTwitterShareUrl(shareText, referralUrl, ['LandSpice', 'مسابقة']);
      break;
    case 'whatsapp':
      shareUrl = generateWhatsAppShareUrl(shareText, referralUrl);
      break;
    case 'telegram':
      shareUrl = generateTelegramShareUrl(shareText, referralUrl);
      break;
    case 'linkedin':
      shareUrl = generateLinkedInShareUrl(referralUrl);
      break;
    case 'instagram':
    case 'tiktok':
    case 'youtube':
      // هذه المنصات لا تدعم المشاركة المباشرة، نسخ للحافظة
      const copied = await copyToClipboard(shareText);
      return { success: copied, method: 'clipboard' };
    default:
      return { success: false, method: 'window' };
  }
  
  if (shareUrl) {
    openShareWindow(shareUrl, `مشاركة على ${platform}`);
    return { success: true, method: 'window' };
  }
  
  return { success: false, method: 'window' };
}

/**
 * الحصول على رسالة المشاركة المخصصة لكل منصة
 */
export function getCustomShareMessage(platform: string): string {
  const messages: Record<string, string> = {
    facebook: '🎉 شارك هذه المسابقة الرائعة مع أصدقائك على فيسبوك!',
    twitter: '🐦 غرّد عن المسابقة وشارك الفرصة مع متابعيك!',
    instagram: '📸 انسخ الرابط وشاركه في قصتك أو منشورك!',
    tiktok: '🎵 انسخ الرابط وشاركه في فيديو تيك توك!',
    youtube: '🎥 انسخ الرابط وشاركه في تعليق أو وصف الفيديو!',
    whatsapp: '💬 أرسل الرابط لأصدقائك على واتساب!',
    telegram: '✈️ شارك المسابقة مع مجموعاتك على تيليجرام!',
    linkedin: '💼 شارك الفرصة مع شبكتك المهنية!',
  };
  
  return messages[platform] || 'شارك المسابقة مع أصدقائك!';
}
