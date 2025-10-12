/**
 * بيانات منصات التواصل الاجتماعي
 * يحتوي على جميع المعلومات المتعلقة بكل منصة
 */

export interface SocialPlatformData {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  gradient: string;
  followText: string;
  followedText: string;
  instructions: string;
  urlPattern: string;
  shareSupported: boolean;
  shareMethod: 'direct' | 'clipboard';
  shareText?: string;
}

export const socialPlatformsData: SocialPlatformData[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    nameAr: 'فيسبوك',
    icon: 'facebook',
    color: '#1877F2',
    gradient: 'from-blue-600 to-blue-700',
    followText: 'تابع صفحتنا',
    followedText: 'متابع ✓',
    instructions: 'اضغط على زر "متابعة" أو "إعجاب" في الصفحة',
    urlPattern: 'https://facebook.com/',
    shareSupported: true,
    shareMethod: 'direct',
    shareText: 'شارك هذه المسابقة الرائعة مع أصدقائك على فيسبوك!'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    nameAr: 'انستجرام',
    icon: 'instagram',
    color: '#E4405F',
    gradient: 'from-pink-600 via-purple-600 to-orange-500',
    followText: 'تابع حسابنا',
    followedText: 'متابع ✓',
    instructions: 'اضغط على زر "متابعة" في الحساب',
    urlPattern: 'https://instagram.com/',
    shareSupported: true,
    shareMethod: 'clipboard',
    shareText: 'انسخ الرابط وشاركه في قصتك أو منشورك على انستجرام!'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    nameAr: 'يوتيوب',
    icon: 'youtube',
    color: '#FF0000',
    gradient: 'from-red-600 to-red-700',
    followText: 'اشترك في القناة',
    followedText: 'مشترك ✓',
    instructions: 'اضغط على زر "اشتراك" في القناة',
    urlPattern: 'https://youtube.com/',
    shareSupported: true,
    shareMethod: 'clipboard',
    shareText: 'انسخ الرابط وشاركه في تعليق أو وصف الفيديو!'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    nameAr: 'تيك توك',
    icon: 'tiktok',
    color: '#000000',
    gradient: 'from-gray-900 to-black',
    followText: 'تابع حسابنا',
    followedText: 'متابع ✓',
    instructions: 'اضغط على زر "متابعة" في الحساب',
    urlPattern: 'https://tiktok.com/',
    shareSupported: true,
    shareMethod: 'clipboard',
    shareText: 'انسخ الرابط وشاركه في فيديو تيك توك!'
  },
  {
    id: 'twitter',
    name: 'Twitter (X)',
    nameAr: 'تويتر',
    icon: 'twitter',
    color: '#1DA1F2',
    gradient: 'from-sky-500 to-blue-600',
    followText: 'تابع حسابنا',
    followedText: 'متابع ✓',
    instructions: 'اضغط على زر "متابعة" في الحساب',
    urlPattern: 'https://twitter.com/',
    shareSupported: true,
    shareMethod: 'direct',
    shareText: 'غرّد عن المسابقة وشارك الفرصة مع متابعيك!'
  },
  {
    id: 'facebook_channel',
    name: 'Facebook Channel',
    nameAr: 'قناة فيسبوك',
    icon: 'facebook',
    color: '#0866FF',
    gradient: 'from-blue-700 to-indigo-700',
    followText: 'تابع القناة',
    followedText: 'متابع ✓',
    instructions: 'اضغط على زر "متابعة" في القناة',
    urlPattern: 'https://facebook.com/',
    shareSupported: true,
    shareMethod: 'direct',
    shareText: 'شارك المسابقة على قناة فيسبوك!'
  }
];

/**
 * الحصول على بيانات منصة معينة
 */
export function getPlatformData(platformId: string): SocialPlatformData | undefined {
  return socialPlatformsData.find(p => p.id === platformId);
}

/**
 * الحصول على لون المنصة
 */
export function getPlatformColor(platformId: string): string {
  const platform = getPlatformData(platformId);
  return platform?.color || '#6B7280';
}

/**
 * الحصول على اسم المنصة بالعربية
 */
export function getPlatformNameAr(platformId: string): string {
  const platform = getPlatformData(platformId);
  return platform?.nameAr || platformId;
}

/**
 * رسائل تشجيعية بناءً على التقدم
 */
export function getEncouragementMessage(completedCount: number, totalCount: number): string {
  const percentage = (completedCount / totalCount) * 100;
  
  if (percentage === 0) {
    return '🎯 ابدأ الآن! تابع صفحاتنا لزيادة فرصك في الفوز';
  } else if (percentage < 30) {
    return '💪 بداية رائعة! استمر في المتابعة';
  } else if (percentage < 50) {
    return '🔥 أنت في منتصف الطريق! استمر';
  } else if (percentage < 80) {
    return '⭐ ممتاز! أوشكت على الانتهاء';
  } else if (percentage < 100) {
    return '🎉 رائع جداً! خطوة واحدة فقط';
  } else {
    return '🏆 مبروك! أكملت جميع المتابعات';
  }
}

/**
 * حساب النسبة المئوية للتقدم
 */
export function calculateProgress(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}
