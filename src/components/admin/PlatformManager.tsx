// src/components/admin/PlatformManager.tsx
// مدير الشبكات الاجتماعية الديناميكية

'use client';

import { useState, useEffect } from 'react';
import { SocialPlatform, AddPlatformInput, ActionType } from '@/types/saas';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Form, FormField } from '@/components/ui/Form';
import { useNotification } from '@/hooks/useNotification';

interface PlatformManagerProps {
  contestId: string;
  onPlatformsChange?: (platforms: SocialPlatform[]) => void;
}

export function PlatformManager({ contestId, onPlatformsChange }: PlatformManagerProps) {
  const { showSuccess, showError } = useNotification();
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddPlatformInput>({
    name: '',
    display_name: '',
    url: '',
    action_type: ActionType.FOLLOW,
    action_description: '',
    auto_verify: false,
  });

  useEffect(() => {
    fetchPlatforms();
  }, [contestId]);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch(`/api/v1/contests/${contestId}/platforms`);
      if (response.ok) {
        const data = await response.json();
        setPlatforms(data);
        onPlatformsChange?.(data);
      }
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  const handleAddPlatform = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.display_name || !formData.url || !formData.name) {
      showError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/contests/${contestId}/platforms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccess('تم إضافة الشبكة بنجاح');
        setFormData({
          name: '',
          display_name: '',
          url: '',
          action_type: ActionType.FOLLOW,
          action_description: '',
          auto_verify: false,
        });
        setShowForm(false);
        await fetchPlatforms();
      } else {
        showError('فشل إضافة الشبكة');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'حدث خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlatform = async (platformId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشبكة؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/contests/${contestId}/platforms/${platformId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess('تم حذف الشبكة بنجاح');
        await fetchPlatforms();
      } else {
        showError('فشل حذف الشبكة');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'حدث خطأ');
    }
  };

  const getPlatformIcon = (name: string) => {
    const icons: Record<string, string> = {
      facebook: '👍',
      instagram: '📷',
      youtube: '📺',
      tiktok: '🎵',
      twitter: '🐦',
      custom: '🔗',
    };
    return icons[name.toLowerCase()] || '🔗';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الشبكات الاجتماعية</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ إلغاء' : '➕ إضافة شبكة'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">إضافة شبكة جديدة</h3>
          <Form onSubmit={handleAddPlatform}>
            <FormField label="اسم الشبكة" required>
              <select
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">اختر الشبكة</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter</option>
                <option value="custom">مخصص</option>
              </select>
            </FormField>

            <FormField label="اسم العرض" required>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="مثال: صفحة Facebook الرسمية"
              />
            </FormField>

            <FormField label="الرابط" required>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://facebook.com/yourpage"
              />
            </FormField>

            <FormField label="نوع الإجراء" required>
              <select
                value={formData.action_type}
                onChange={(e) => setFormData({ ...formData, action_type: e.target.value as ActionType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value={ActionType.FOLLOW}>متابعة</option>
                <option value={ActionType.LIKE}>إعجاب</option>
                <option value={ActionType.SHARE}>مشاركة</option>
                <option value={ActionType.SUBSCRIBE}>اشتراك</option>
                <option value={ActionType.CUSTOM}>مخصص</option>
              </select>
            </FormField>

            <FormField label="وصف الإجراء">
              <textarea
                value={formData.action_description}
                onChange={(e) => setFormData({ ...formData, action_description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="مثال: تابع صفحتنا على Facebook"
                rows={3}
              />
            </FormField>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto_verify"
                checked={formData.auto_verify}
                onChange={(e) => setFormData({ ...formData, auto_verify: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="auto_verify" className="text-sm">
                تفعيل التحقق التلقائي
              </label>
            </div>

            <Button type="submit" isLoading={isLoading} fullWidth className="mt-4">
              إضافة الشبكة
            </Button>
          </Form>
        </Card>
      )}

      {/* قائمة الشبكات */}
      <div className="space-y-3">
        {platforms.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500">
              لا توجد شبكات مضافة حتى الآن
            </div>
          </Card>
        ) : (
          platforms.map((platform) => (
            <Card key={platform.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <span className="text-3xl">{getPlatformIcon(platform.name)}</span>
                <div className="flex-1">
                  <h4 className="font-semibold">{platform.display_name}</h4>
                  <p className="text-sm text-gray-600">{platform.action_description || `إجراء: ${platform.action_type}`}</p>
                  <p className="text-xs text-gray-500 mt-1">{platform.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {platform.auto_verify && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    تحقق تلقائي
                  </span>
                )}
                {!platform.is_active && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    معطل
                  </span>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeletePlatform(platform.id)}
                >
                  حذف
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
