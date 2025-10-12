'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface AnalyticsProps {
  trackingId?: string;
}

export default function Analytics({ trackingId = 'G-XXXXXXXXXX' }: AnalyticsProps) {
  useEffect(() => {
    // تحميل Google Analytics
    if (typeof window !== 'undefined' && trackingId) {
      // إضافة السكريبت
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script1);

      // إعداد gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', trackingId);
    }
  }, [trackingId]);

  return null;
}

// دوال تتبع الأحداث
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// تتبع التسجيل
export const trackRegistration = (referralCode?: string) => {
  trackEvent('registration', 'User', referralCode ? 'With Referral' : 'Direct');
};

// تتبع المتابعة
export const trackFollow = (platform: string) => {
  trackEvent('follow', 'Social', platform);
};

// تتبع المشاركة
export const trackShare = (platform: string) => {
  trackEvent('share', 'Social', platform);
};

// تتبع السحب
export const trackDraw = (winnersCount: number) => {
  trackEvent('draw', 'Contest', 'Winners', winnersCount);
};
