'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Users, Calendar, MapPin, Share2, Heart } from 'lucide-react';

interface Contest {
  id: number;
  title: string;
  description: string;
  status: string;
  end_date: string;
  prize_description: string;
  max_participants: number;
}

interface Winner {
  id: number;
  position: number;
  name: string;
  city: string;
  prize_description: string;
}

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  subscription_plan: string;
}

export default function CompanyPublicPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contests' | 'winners'>('contests');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات الشركة
        const companyResponse = await fetch(`/api/v1/companies/${companyId}`);
        if (companyResponse.ok) {
          const data = await companyResponse.json();
          setCompany(data.company);
          setContests(data.contests || []);
          setWinners(data.winners || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الشركة غير موجودة</h1>
          <p className="text-gray-600">عذراً، لم نتمكن من العثور على هذه الشركة</p>
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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-purple-600">
                {company.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">{company.name}</h1>
              <p className="text-purple-100 mt-2">صفحة المسابقات والفائزين</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-purple-100 text-sm">البريد الإلكتروني</p>
              <p className="text-white font-semibold">{company.email}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-purple-100 text-sm">رقم الهاتف</p>
              <p className="text-white font-semibold">{company.phone}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-purple-100 text-sm">خطة الاشتراك</p>
              <p className="text-white font-semibold capitalize">{company.subscription_plan}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/register/participant"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              🎯 اشترك في المسابقات
            </Link>
            <button className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
              <Heart className="w-5 h-5" />
              متابعة
            </button>
            <button className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              مشاركة
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('contests')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'contests'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              المسابقات ({contests.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('winners')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'winners'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              الفائزون ({winners.length})
            </div>
          </button>
        </div>

        {/* Contests Tab */}
        {activeTab === 'contests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.length > 0 ? (
              contests.map((contest) => (
                <div
                  key={contest.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Status Badge */}
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">{contest.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          contest.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : contest.status === 'ended'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {contest.status === 'active'
                          ? 'نشطة'
                          : contest.status === 'ended'
                          ? 'منتهية'
                          : 'قادمة'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {contest.description}
                    </p>

                    {/* Contest Info */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>ينتهي: {new Date(contest.end_date).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>المشاركون: {contest.max_participants}</span>
                      </div>
                    </div>

                    {/* Prize */}
                    <div className="bg-purple-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-purple-900 font-semibold">الجوائز:</p>
                      <p className="text-sm text-purple-800 mt-1 whitespace-pre-wrap">
                        {contest.prize_description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Link
                      href="/register/participant"
                      className="w-full block text-center px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      اشترك الآن
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد مسابقات حالياً</p>
              </div>
            )}
          </div>
        )}

        {/* Winners Tab */}
        {activeTab === 'winners' && (
          <div className="space-y-4">
            {winners.length > 0 ? (
              winners.map((winner, index) => (
                <div
                  key={winner.id}
                  className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  {/* Position Badge */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                      winner.position === 1
                        ? 'bg-yellow-500'
                        : winner.position === 2
                        ? 'bg-gray-400'
                        : winner.position === 3
                        ? 'bg-orange-500'
                        : 'bg-purple-600'
                    }`}
                  >
                    {winner.position === 1 ? '🥇' : winner.position === 2 ? '🥈' : winner.position === 3 ? '🥉' : winner.position}
                  </div>

                  {/* Winner Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{winner.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {winner.city}
                      </div>
                    </div>
                  </div>

                  {/* Prize */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600">الجائزة</p>
                    <p className="text-lg font-bold text-purple-600">{winner.prize_description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لم يتم إعلان الفائزين بعد</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">هل تريد المشاركة في مسابقاتنا؟</h2>
          <p className="text-purple-100 mb-6">انضم إلينا الآن واحصل على فرصة للفوز بجوائز قيمة</p>
          <Link
            href="/register/participant"
            className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            اشترك الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
