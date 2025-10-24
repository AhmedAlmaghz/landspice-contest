// src/components/admin/CompanyDashboard.tsx
// لوحة تحكم الشركة

'use client';

import { useEffect, useState } from 'react';
import { Company } from '@/types/saas';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CompanyDashboardProps {
  company: Company;
}

export function CompanyDashboard({ company }: CompanyDashboardProps) {
  const [stats, setStats] = useState({
    total_contests: 0,
    active_contests: 0,
    total_participants: 0,
    total_revenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [company.id]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/v1/companies/${company.id}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getSubscriptionBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'مجاني';
      case 'pro':
        return 'احترافي';
      case 'enterprise':
        return 'مؤسسي';
      default:
        return plan;
    }
  };

  return (
    <div className="space-y-6">
      {/* معلومات الشركة */}
      <Card>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-gray-600 mt-1">{company.email}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getSubscriptionBadgeColor(company.subscription_plan)}`}>
            {getPlanLabel(company.subscription_plan)}
          </span>
        </div>

        {company.description && (
          <p className="text-gray-700 mb-4">{company.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {company.phone && (
            <div>
              <span className="text-gray-600">الهاتف:</span>
              <p className="font-semibold">{company.phone}</p>
            </div>
          )}
          {company.city && (
            <div>
              <span className="text-gray-600">المدينة:</span>
              <p className="font-semibold">{company.city}</p>
            </div>
          )}
          {company.country && (
            <div>
              <span className="text-gray-600">الدولة:</span>
              <p className="font-semibold">{company.country}</p>
            </div>
          )}
          {company.website_url && (
            <div>
              <span className="text-gray-600">الموقع:</span>
              <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                {company.website_url}
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">إجمالي المسابقات</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">{stats.total_contests}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">المسابقات النشطة</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.active_contests}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">إجمالي المشاركين</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total_participants}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">الإيرادات</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">${stats.total_revenue}</p>
          </div>
        </Card>
      </div>

      {/* الإجراءات السريعة */}
      <Card>
        <h2 className="text-xl font-bold mb-4">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" fullWidth>
            ➕ إنشاء مسابقة جديدة
          </Button>
          <Button variant="secondary" fullWidth>
            👥 إدارة المشاركين
          </Button>
          <Button variant="outline" fullWidth>
            ⚙️ الإعدادات
          </Button>
        </div>
      </Card>

      {/* المسابقات الأخيرة */}
      <Card>
        <h2 className="text-xl font-bold mb-4">المسابقات الأخيرة</h2>
        <div className="text-center py-8 text-gray-500">
          لا توجد مسابقات حتى الآن
        </div>
      </Card>
    </div>
  );
}
