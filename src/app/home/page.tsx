'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavigationHeader from '@/components/NavigationHeader';
import { Trophy, Users, Calendar, MapPin, Share2, Heart, CheckCircle, ArrowRight } from 'lucide-react';

interface Contest {
  id: number;
  title: string;
  description: string;
  status: string;
  end_date: string;
  prize_description: string;
  max_participants: number;
  company_id: number;
  company_name: string;
}

interface Winner {
  id: number;
  position: number;
  name: string;
  city: string;
  prize_description: string;
}

export default function HomePage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contests' | 'winners'>('contests');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب المسابقات
        const contestsResponse = await fetch('/api/v1/contests');
        if (contestsResponse.ok) {
          const data = await contestsResponse.json();
          setContests(data.data || []);
        }

        // جلب الفائزين
        const winnersResponse = await fetch('/api/draw');
        if (winnersResponse.ok) {
          const data = await winnersResponse.json();
          setWinners(data.winners || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <NavigationHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  const featuredContest = contests.length > 0 ? contests[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              🎉 انضم إلى مسابقة<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                المتابعة والمشاركة
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              تابع الشركات المفضلة لديك، شارك على وسائل التواصل الاجتماعي، واربح جوائز قيمة!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register/participant"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                🎯 اشترك الآن
              </Link>
              <Link
                href="/register/company"
                className="px-8 py-4 bg-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/30 transition-colors shadow-lg border border-white/30 backdrop-blur-sm"
              >
                🏢 سجل شركتك
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Contest Section */}
      {featuredContest && (
        <section className="py-16 px-4 bg-white/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">🏆 المسابقة المميزة</h2>
            
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Contest Info */}
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">من</p>
                        <Link href={`/${featuredContest.company_id}`} className="text-lg font-bold text-gray-900 hover:text-purple-600">
                          {featuredContest.company_name}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{featuredContest.title}</h3>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">{featuredContest.description}</p>

                  {/* Contest Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span>ينتهي: {new Date(featuredContest.end_date).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>المشاركون: {featuredContest.max_participants}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span>الحالة: {featuredContest.status === 'active' ? '🟢 نشطة' : '🔴 منتهية'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/contest/${featuredContest.id}`}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                      عرض التفاصيل
                    </Link>
                    <Link
                      href="/register/participant"
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      اشترك الآن
                    </Link>
                  </div>
                </div>

                {/* Prizes Section */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    الجوائز
                  </h4>
                  <div className="bg-white rounded-lg p-6 mb-6 border-2 border-yellow-400">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {featuredContest.prize_description}
                    </p>
                  </div>

                  {/* Social Actions */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-gray-900">للمشاركة:</h5>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      <Share2 className="w-5 h-5" />
                      مشاركة على Facebook
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-sky-400 text-white rounded-lg font-semibold hover:bg-sky-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                      مشاركة على Twitter
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                      <Heart className="w-5 h-5" />
                      متابعة على Instagram
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Contests Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">📋 جميع المسابقات</h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 justify-center border-b border-white/30 pb-4">
            <button
              onClick={() => setActiveTab('contests')}
              className={`px-6 py-3 font-bold text-lg transition-colors ${
                activeTab === 'contests'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              المسابقات ({contests.length})
            </button>
            <button
              onClick={() => setActiveTab('winners')}
              className={`px-6 py-3 font-bold text-lg transition-colors ${
                activeTab === 'winners'
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              الفائزون ({winners.length})
            </button>
          </div>

          {/* Contests Grid */}
          {activeTab === 'contests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.length > 0 ? (
                contests.map((contest) => (
                  <Link
                    key={contest.id}
                    href={`/contest/${contest.id}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden group"
                  >
                    <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex-1 group-hover:text-purple-600 transition-colors">
                          {contest.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          contest.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {contest.status === 'active' ? '🟢 نشطة' : '🔴 منتهية'}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contest.description}</p>

                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          {new Date(contest.end_date).toLocaleDateString('ar-SA')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          {contest.max_participants} مشارك
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-purple-900 font-semibold mb-1">الجوائز</p>
                        <p className="text-sm text-purple-800 line-clamp-2">{contest.prize_description}</p>
                      </div>

                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        اشترك الآن
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Trophy className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">لا توجد مسابقات حالياً</p>
                </div>
              )}
            </div>
          )}

          {/* Winners List */}
          {activeTab === 'winners' && (
            <div className="space-y-4">
              {winners.length > 0 ? (
                winners.map((winner) => (
                  <div
                    key={winner.id}
                    className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Position Badge */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-white ${
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
                  <Users className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">لم يتم إعلان الفائزين بعد</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">هل أنت مستعد للبدء؟</h2>
          <p className="text-xl text-white/90 mb-8">
            انضم إلى آلاف المشاركين وفز بجوائز قيمة من خلال متابعة الشركات المفضلة لديك والمشاركة على وسائل التواصل الاجتماعي
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register/participant"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              🎯 اشترك الآن
            </Link>
            <Link
              href="/register/company"
              className="px-8 py-4 bg-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/30 transition-colors shadow-lg border border-white/30 backdrop-blur-sm"
            >
              🏢 أطلق مسابقتك
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-white/70">
          <p>© 2025 LandSpice. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
