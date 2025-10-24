'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

interface Platform {
  id: number;
  name: string;
  url: string;
  followers: number;
}

export default function CompanyPlatforms() {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'company') {
      router.push('/company/login');
      return;
    }

    setTimeout(() => {
      setPlatforms([
        { id: 1, name: 'Facebook', url: 'https://facebook.com/company', followers: 5000 },
        { id: 2, name: 'Instagram', url: 'https://instagram.com/company', followers: 3000 },
        { id: 3, name: 'Twitter', url: 'https://twitter.com/company', followers: 2000 },
      ]);
      setLoading(false);
    }, 500);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole="company" />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">الشبكات الاجتماعية</h1>
            <p className="text-gray-600">إدارة حساباتك على الشبكات الاجتماعية</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            <Plus className="w-5 h-5" />
            إضافة منصة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <div key={platform.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-8 h-8 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900">{platform.name}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4 truncate">{platform.url}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{platform.followers.toLocaleString()} متابع</span>
                <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
                  عرض
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
