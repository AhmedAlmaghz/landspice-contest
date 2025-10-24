// src/components/admin/CompanyForm.tsx
// نموذج إنشاء/تحديث الشركة

'use client';

import { useState } from 'react';
import { Company, CreateCompanyInput } from '@/types/saas';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Form, FormField } from '@/components/ui/Form';
import { useNotification } from '@/hooks/useNotification';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CreateCompanyInput) => Promise<void>;
  isLoading?: boolean;
}

export function CompanyForm({ company, onSubmit, isLoading = false }: CompanyFormProps) {
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState<CreateCompanyInput>({
    name: company?.name || '',
    email: company?.email || '',
    phone: company?.phone || '',
    country: company?.country || '',
    city: company?.city || '',
    website_url: company?.website_url || '',
    description: company?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // مسح الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'اسم الشركة مطلوب';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (formData.phone && !/^\d{7,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
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
      await onSubmit(formData);
      showSuccess(company ? 'تم تحديث الشركة بنجاح' : 'تم إنشاء الشركة بنجاح');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'حدث خطأ');
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">
        {company ? 'تحديث الشركة' : 'إنشاء شركة جديدة'}
      </h2>

      <Form onSubmit={handleSubmit}>
        <FormField label="اسم الشركة" error={errors.name} required>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="مثال: شركة النور"
          />
        </FormField>

        <FormField label="البريد الإلكتروني" error={errors.email} required>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="company@example.com"
            disabled={!!company}
          />
        </FormField>

        <FormField label="رقم الهاتف" error={errors.phone}>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="+966501234567"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="الدولة">
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="السعودية"
            />
          </FormField>

          <FormField label="المدينة">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="الرياض"
            />
          </FormField>
        </div>

        <FormField label="موقع الويب">
          <input
            type="url"
            name="website_url"
            value={formData.website_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="https://example.com"
          />
        </FormField>

        <FormField label="الوصف">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="وصف الشركة"
            rows={4}
          />
        </FormField>

        <div className="flex gap-4 mt-6">
          <Button type="submit" isLoading={isLoading} fullWidth>
            {company ? 'تحديث' : 'إنشاء'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
