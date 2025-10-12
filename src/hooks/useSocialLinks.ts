'use client';

import { useState, useEffect } from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  twitter: string;
  facebook_channel: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
}

const socialLinksConfig: SocialLink[] = [
  {
    name: 'facebook',
    url: '',
    icon: Facebook,
    color: 'text-blue-600 hover:text-blue-700',
    label: 'فيسبوك'
  },
  {
    name: 'instagram',
    url: '',
    icon: Instagram,
    color: 'text-pink-600 hover:text-pink-700',
    label: 'انستجرام'
  },
  {
    name: 'youtube',
    url: '',
    icon: Youtube,
    color: 'text-red-600 hover:text-red-700',
    label: 'يوتيوب'
  },
  {
    name: 'tiktok',
    url: '',
    icon: Facebook, // استخدم أيقونة عامة لحين إضافة أيقونة TikTok
    color: 'text-gray-800 hover:text-gray-900',
    label: 'تيك توك'
  },
  {
    name: 'twitter',
    url: '',
    icon: Twitter,
    color: 'text-sky-600 hover:text-sky-700',
    label: 'تويتر'
  },
  {
    name: 'facebook_channel',
    url: '',
    icon: Facebook,
    color: 'text-blue-600 hover:text-blue-700',
    label: 'قناة فيسبوك'
  }
];

export default function useSocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/social-links');

      if (!response.ok) {
        // إذا فشل الـ API، استخدم البيانات الافتراضية
        console.warn('API request failed, using default social links');
        setSocialLinks({
          facebook: 'https://facebook.com/LandSpice25',
          instagram: 'https://instagram.com/LandSpice25',
          youtube: 'https://youtube.com/@LandSpice',
          tiktok: 'https://tiktok.com/@LandSpice',
          twitter: 'https://x.com/LandSpice25',
          facebook_channel: 'https://whatsapp.com/channel/0029Vb62xmZC6ZvZa3u0Yn0C',
        });
        return;
      }

      const data = await response.json();

      // التأكد من وجود البيانات
      if (!data.socialLinks) {
        throw new Error('البيانات المرجعة غير صحيحة');
      }

      setSocialLinks(data.socialLinks);
    } catch (err) {
      console.error('Error fetching social links:', err);

      // استخدم البيانات الافتراضية في حالة الخطأ
      setSocialLinks({
        facebook: 'https://facebook.com/LandSpice25',
        instagram: 'https://instagram.com/LandSpice25',
        youtube: 'https://youtube.com/@LandSpice',
        tiktok: 'https://tiktok.com/@LandSpice',
        twitter: 'https://x.com/LandSpice25',
        facebook_channel: 'https://whatsapp.com/channel/0029Vb62xmZC6ZvZa3u0Yn0C',
      });

      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const getSocialLinksWithConfig = (): SocialLink[] => {
    if (!socialLinks) return socialLinksConfig;

    return socialLinksConfig.map(link => ({
      ...link,
      url: socialLinks[link.name as keyof SocialLinks] || link.url
    }));
  };

  const getActiveSocialLinks = (): SocialLink[] => {
    return getSocialLinksWithConfig().filter(link => link.url && link.url !== '#');
  };

  return {
    socialLinks,
    loading,
    error,
    getSocialLinksWithConfig,
    getActiveSocialLinks,
    refetch: fetchSocialLinks
  };
}
