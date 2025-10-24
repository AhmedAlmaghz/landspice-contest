'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Users, Calendar, Share2, ArrowRight, Loader } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import SocialActions from '@/components/SocialActions';
import { Participant, ContestSettings } from '@/types';

interface Contest {
  id: number;
  title: string;
  description: string;
  status: string;
  end_date: string;
  prize_description: string;
  max_participants: number;
  rules: string;
  company_id: number;
  company_name: string;
}

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function ParticipantContestPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.contestId as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [settings, setSettings] = useState<ContestSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // التحقق من أن المستخدم مشارك
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    if (role !== 'participant') {
      router.push(`/contest/${contestId}`);
      return;
    }

    fetchData();
  }, [contestId, router]);

  const fetchData = async () => {
    try {
      setLoading(true);

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

        // جلب إعدادات المسابقة (تتضمن روابط وسائل التواصل)
        const settingsResponse = await fetch(`/api/v1/contests/${contestId}/settings`);
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData.data);
        }
      }

      // جلب بيانات المشارك
      const participantId = localStorage.getItem('participantId');
      if (participantId) {
        const participantResponse = await fetch(`/api/participants/${participantId}`);
        if (participantResponse.ok) {
          const participantData = await participantResponse.json();
          setParticipant(participantData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">المسابقة غير موجودة</h1>
            <p className="text-gray-600">عذراً، لم نتمكن من العثور على هذه المسابقة</p>
            <Link href="/contests" className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-semibold">
              العودة إلى المسابقات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">بيانات المشارك غير موجودة</h1>
            <p className="text-gray-600">يرجى تسجيل الدخول أولاً</p>
            <Link href="/login" className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-semibold">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

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
                  <p className="text-white font-semibold">{company.name}</p>
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

            {/* Social Actions Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <SocialActions
                participant={participant}
                settings={settings}
                onProgressUpdate={(updatedParticipant) => {
                  setParticipant(updatedParticipant);
                }}
              />
            </div>
          </div>

          {/* Right Column - Progress and Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">تقدمك</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">النسبة المئوية</span>
                    <span className="text-sm font-semibold text-gray-900">{participant.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${participant.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المشاركات</span>
                    <span className="text-lg font-bold text-purple-600">{participant.shares}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">الإجراءات</span>
                    <span className="text-lg font-bold text-blue-600">{participant.total_actions || 0}</span>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              {company && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات الشركة</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">الاسم</p>
                      <p className="font-semibold text-gray-900">{company.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                      <p className="font-semibold text-gray-900 break-all">{company.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">رقم الهاتف</p>
                      <p className="font-semibold text-gray-900">{company.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">💡 نصائح</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>✅ تابع جميع المنصات الاجتماعية لزيادة فرصك</li>
                  <li>✅ شارك المسابقة مع أصدقائك</li>
                  <li>✅ استخدم رابط الإحالة الخاص بك</li>
                  <li>✅ كل إجراء يزيد من فرصك في الفوز</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
