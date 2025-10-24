'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Users, Calendar, MapPin, Share2, ArrowRight } from 'lucide-react';
import ContestSubscribeForm from '@/components/ContestSubscribeForm';

interface Contest {
  id: number;
  title: string;
  description: string;
  status: string;
  end_date: string;
  prize_description: string;
  max_participants: number;
  rules: string;
}

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface SocialPlatform {
  id: number;
  platform_name: string;
  platform_url: string;
  action_type: string;
  position: number;
}

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params.contestId as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات المسابقة
        const contestResponse = await fetch(`/api/v1/contests/${contestId}`);
        if (contestResponse.ok) {
          const data = await contestResponse.json();
          setContest(data.data);
          
          // جلب بيانات الشركة
          if (data.data.company_id) {
            const companyResponse = await fetch(`/api/companies/${data.data.company_id}`);
            if (companyResponse.ok) {
              const companyData = await companyResponse.json();
              setCompany(companyData.company);
            }
          }

          // جلب المنصات الاجتماعية
          const platformsResponse = await fetch(`/api/v1/contests/${contestId}/platforms`);
          if (platformsResponse.ok) {
            const platformsData = await platformsResponse.json();
            setPlatforms(platformsData.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contestId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">المسابقة غير موجودة</h1>
          <p className="text-gray-600">عذراً، لم نتمكن من العثور على هذه المسابقة</p>
          <Link href="/" className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-semibold">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            {company && (
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <p className="text-purple-100 text-sm">من</p>
                  <Link
                    href={`/${company.id}`}
                    className="text-white font-semibold hover:text-purple-100 transition-colors"
                  >
                    {company.name}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{contest.title}</h1>
              <p className="text-purple-100 text-lg mb-4">{contest.description}</p>

              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-purple-100 text-sm">الحالة</p>
                  <p className="text-white font-semibold capitalize">
                    {contest.status === 'active'
                      ? 'نشطة'
                      : contest.status === 'ended'
                      ? 'منتهية'
                      : 'قادمة'}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-purple-100 text-sm">تاريخ الانتهاء</p>
                  <p className="text-white font-semibold">
                    {new Date(contest.end_date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-purple-100 text-sm">المشاركون</p>
                  <p className="text-white font-semibold">{contest.max_participants}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Contest */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">عن المسابقة</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {contest.description}
              </p>
            </div>

            {/* Prizes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                الجوائز
              </h2>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {contest.prize_description}
                </p>
              </div>
            </div>

            {/* Rules */}
            {contest.rules && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">شروط المسابقة</h2>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {contest.rules}
                </div>
              </div>
            )}

            {/* Social Platforms */}
            {platforms.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-blue-500" />
                  المنصات الاجتماعية
                </h2>
                <div className="space-y-3">
                  {platforms.map((platform, index) => (
                    <a
                      key={platform.id}
                      href={platform.platform_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{platform.platform_name}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {platform.action_type === 'follow' ? 'متابعة' : 'مشاركة'}
                        </p>
                      </div>
                      <div className="text-purple-600 font-semibold">
                        {index + 1}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Subscribe Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ContestSubscribeForm
                contestId={parseInt(contestId)}
                contestTitle={contest.title}
                onSuccess={() => setShowSubscribeForm(false)}
              />

              {company && (
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات الشركة</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">الاسم</p>
                      <p className="font-semibold text-gray-900">{company.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                      <p className="font-semibold text-gray-900">{company.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">رقم الهاتف</p>
                      <p className="font-semibold text-gray-900">{company.phone}</p>
                    </div>
                    <Link
                      href={`/${company.id}`}
                      className="mt-4 block w-full text-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
                    >
                      عرض جميع مسابقات الشركة
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
