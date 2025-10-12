'use client';

import { useState } from 'react';
import { Eye, Copy, Share2, Check } from 'lucide-react';

interface PostPreviewProps {
  content: string;
  onPublish?: () => void;
  platforms?: ('facebook' | 'twitter' | 'instagram' | 'whatsapp')[];
}

export default function PostPreview({ content, onPublish, platforms = ['facebook', 'twitter'] }: PostPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(platforms);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const platformColors = {
    facebook: 'bg-blue-600 hover:bg-blue-700',
    twitter: 'bg-sky-500 hover:bg-sky-600',
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    whatsapp: 'bg-green-600 hover:bg-green-700'
  };

  const platformNames = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-full">
          <Eye className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">معاينة المنشور</h3>
      </div>

      {/* Post Content */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-gray-200">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {content}
        </div>
      </div>

      {/* Character Count */}
      <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
        <span>عدد الأحرف: {content.length}</span>
        <span>عدد الكلمات: {content.split(/\s+/).length}</span>
      </div>

      {/* Platform Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          اختر المنصات للنشر:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all ${
                selectedPlatforms.includes(platform)
                  ? platformColors[platform]
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {selectedPlatforms.includes(platform) && (
                <Check className="w-4 h-4" />
              )}
              {platformNames[platform]}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              تم النسخ!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              نسخ النص
            </>
          )}
        </button>

        {onPublish && (
          <button
            onClick={onPublish}
            disabled={selectedPlatforms.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="w-5 h-5" />
            نشر الآن ({selectedPlatforms.length})
          </button>
        )}
      </div>

      {/* Publishing Note */}
      {selectedPlatforms.includes('instagram') && (
        <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>ملاحظة:</strong> Instagram لا يدعم النشر التلقائي. سيتم نسخ النص تلقائياً ويمكنك لصقه يدوياً.
          </p>
        </div>
      )}
    </div>
  );
}
