'use client';

import { ExternalLink, Loader2 } from 'lucide-react';
import useSocialLinks from '@/hooks/useSocialLinks';

interface SocialLinksProps {
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}

export default function SocialLinks({
  showLabels = false,
  compact = false,
  className = ''
}: SocialLinksProps) {
  const { getActiveSocialLinks, loading, error } = useSocialLinks();

  if (loading) {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
        <span className="text-sm text-gray-500">جاري التحميل...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        خطأ في تحميل روابط التواصل
      </div>
    );
  }

  const activeLinks = getActiveSocialLinks();

  if (activeLinks.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        لا توجد روابط متاحة حالياً
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {activeLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
              bg-white/10 backdrop-blur-sm border border-white/20
              hover:bg-white/20 hover:border-white/30 hover:scale-105
              text-white group
              ${compact ? 'text-sm' : 'text-base'}
            `}
            title={`زيارة ${link.label}`}
          >
            <Icon className={`w-5 h-5 ${link.color} group-hover:scale-110 transition-transform`} />
            {showLabels && (
              <span className="font-medium">{link.label}</span>
            )}
            <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        );
      })}
    </div>
  );
}
