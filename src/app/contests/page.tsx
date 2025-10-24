'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavigationHeader from '@/components/NavigationHeader';
import { Trophy, Calendar, Users, MapPin, ArrowRight, Loader, Search } from 'lucide-react';

interface Contest {
  id: number;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  prize_description: string;
  max_participants: number;
  current_participants: number;
  company_name: string;
  company_id: number;
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchContests();
  }, [searchTerm, filterStatus, currentPage]);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const response = await fetch(`/api/v1/contests?${params}`);
      if (response.ok) {
        const data = await response.json();
        setContests(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'نشطة' },
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'قادمة' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'مكتملة' },
    };
    const config = statusMap[status] || statusMap.upcoming;
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">جميع المسابقات</h1>
            <p className="text-xl text-purple-100">استكشف المسابقات المتاحة وشارك للفوز بجوائز مذهلة</p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن مسابقة..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'upcoming', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-500'
                }`}
              >
                {status === 'all' && 'الكل'}
                {status === 'active' && 'نشطة'}
                {status === 'upcoming' && 'قادمة'}
                {status === 'completed' && 'مكتملة'}
              </button>
            ))}
          </div>
        </div>

        {/* Contests Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مسابقات</h3>
            <p className="text-gray-500">حاول تغيير معايير البحث أو الفلترة</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contests.map((contest) => (
                <div
                  key={contest.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold line-clamp-2">{contest.title}</h3>
                      {getStatusBadge(contest.status)}
                    </div>
                    <p className="text-sm text-purple-100">{contest.company_name}</p>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contest.description}</p>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>{formatDate(contest.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>{contest.current_participants}/{contest.max_participants}</span>
                      </div>
                    </div>

                    {/* Prize */}
                    {contest.prize_description && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-4">
                        <p className="text-xs font-semibold text-yellow-800">🏆 الجوائز</p>
                        <p className="text-xs text-yellow-700 line-clamp-2">{contest.prize_description}</p>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Link
                      href={`/contest/${contest.id}`}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      عرض التفاصيل
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  السابق
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">هل أنت مستعد للمشاركة؟</h2>
          <p className="text-purple-100 mb-6">انضم إلى آلاف المشاركين وشارك في المسابقات المثيرة</p>
          <Link
            href="/register/participant"
            className="inline-block bg-white text-purple-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            سجل الآن
          </Link>
        </div>
      </section>
    </div>
  );
}
