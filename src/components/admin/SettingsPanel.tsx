'use client';

import { useState } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';

interface SettingsPanelProps {
  initialSettings: {
    contest_title: string;
    prize_description: string;
    end_date: string;
    facebook_url: string;
    instagram_url: string;
    youtube_url: string;
    tiktok_url: string;
    twitter_url: string;
    whatsapp_channel_url: string;
  };
  onSave: (settings: any) => Promise<void>;
}

export default function SettingsPanel({ initialSettings, onSave }: SettingsPanelProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
      setHasChanges(false);
      alert('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ في الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟')) {
      setSettings(initialSettings);
      setHasChanges(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">إعدادات المسابقة</h3>
            <p className="text-sm text-gray-600">تحديث معلومات وروابط المسابقة</p>
          </div>
        </div>

        {hasChanges && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            تغييرات غير محفوظة
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Contest Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">معلومات المسابقة</h4>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              عنوان المسابقة:
            </label>
            <input
              type="text"
              value={settings.contest_title}
              onChange={(e) => handleChange('contest_title', e.target.value)}
              className="input"
              placeholder="مسابقة LandSpice"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              وصف الجوائز:
            </label>
            <textarea
              value={settings.prize_description}
              onChange={(e) => handleChange('prize_description', e.target.value)}
              className="input min-h-[120px]"
              placeholder="اكتب وصف الجوائز..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تاريخ انتهاء المسابقة:
            </label>
            <input
              type="date"
              value={settings.end_date?.split('T')[0] || ''}
              onChange={(e) => handleChange('end_date', e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">روابط وسائل التواصل</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط Facebook:
              </label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                className="input"
                dir="ltr"
                placeholder="https://facebook.com/LandSpice25"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط Instagram:
              </label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="input"
                dir="ltr"
                placeholder="https://instagram.com/LandSpice25"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط YouTube:
              </label>
              <input
                type="url"
                value={settings.youtube_url}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                className="input"
                dir="ltr"
                placeholder="https://youtube.com/@LandSpice"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط TikTok:
              </label>
              <input
                type="url"
                value={settings.tiktok_url}
                onChange={(e) => handleChange('tiktok_url', e.target.value)}
                className="input"
                dir="ltr"
                placeholder="https://tiktok.com/@LandSpice"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط Twitter (X):
              </label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
                className="input"
                dir="ltr"
                placeholder="https://x.com/LandSpice25"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط WhatsApp Channel:
              </label>
              <input
                type="url"
                value={settings.whatsapp_channel_url}
                onChange={(e) => handleChange('whatsapp_channel_url', e.target.value)}
                className="input"
                dir="ltr"
                placeholder="https://whatsapp.com/channel/..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Save className="w-5 h-5 animate-pulse" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            استعادة الافتراضي
          </button>
        </div>
      </div>
    </div>
  );
}
