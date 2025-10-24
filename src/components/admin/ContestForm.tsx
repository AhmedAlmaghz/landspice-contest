// src/components/admin/ContestForm.tsx
// نموذج إنشاء/تحديث المسابقة

'use client';

import { useState } from 'react';
import { Contest, CreateContestInput, ContestStatus } from '@/types/saas';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Form, FormField } from '@/components/ui/Form';
import { useNotification } from '@/hooks/useNotification';

interface ContestFormProps {
  contest?: Contest;
  onSubmit: (data: CreateContestInput) => Promise<void>;
  isLoading?: boolean;
}

export function ContestForm({ contest, onSubmit, isLoading = false }: ContestFormProps) {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState<CreateContestInput>({
    title: contest?.title || '',
    description: contest?.description || '',
    banner_url: contest?.banner_url || '',
    start_date: contest?.start_date ? new Date(contest.start_date).toISOString().split('T')[0] : '',
    end_date: contest?.end_date ? new Date(contest.end_date).toISOString().split('T')[0] : '',
    prize_description: contest?.prize_description || '',
    max_participants: contest?.max_participants || undefined,
    require_email_verification: contest?.require_email_verification ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'عنوان المسابقة مطلوب';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'تاريخ البداية مطلوب';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'تاريخ النهاية مطلوب';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate <= startDate) {
        newErrors.end_date = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
      }
    }

    if (formData.max_participants && formData.max_participants < 1) {
      newErrors.max_participants = 'عدد المشاركين يجب أن يكون أكبر من 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('يرجى تصحيح الأخطاء');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
      });
      showSuccess(contest ? 'تم تحديث المسابقة بنجاح' : 'تم إنشاء المسابقة بنجاح');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'حدث خطأ');
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">
        {contest ? 'تحديث المسابقة' : 'إنشاء مسابقة جديدة'}
      </h2>

      <Form onSubmit={handleSubmit}>
        <FormField label="عنوان المسابقة" error={errors.title} required>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="مثال: مسابقة الصيف 2025"
          />
        </FormField>

        <FormField label="الوصف">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="وصف المسابقة"
            rows={4}
          />
        </FormField>

        <FormField label="رابط الصورة">
          <input
            type="url"
            name="banner_url"
            value={formData.banner_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="https://example.com/banner.jpg"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="تاريخ البداية" error={errors.start_date} required>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </FormField>

          <FormField label="تاريخ النهاية" error={errors.end_date} required>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </FormField>
        </div>

        <FormField label="وصف الجوائز">
          <textarea
            name="prize_description"
            value={formData.prize_description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="وصف الجوائز"
            rows={3}
          />
        </FormField>

        <FormField label="الحد الأقصى للمشاركين" error={errors.max_participants}>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="اتركه فارغاً للحد غير المحدود"
            min="1"
          />
        </FormField>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="require_email_verification"
            name="require_email_verification"
            checked={formData.require_email_verification}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="require_email_verification" className="text-sm">
            طلب التحقق من البريد الإلكتروني
          </label>
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" isLoading={isLoading} fullWidth>
            {contest ? 'تحديث' : 'إنشاء'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
