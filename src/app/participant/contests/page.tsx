'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Breadcrumb from '@/components/Breadcrumb';

interface Contest {
  id: number;
  title: string;
  company: string;
  end_date: string;
  progress: number;
}

export default function ParticipantContests() {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'participant') {
      router.push('/register/participant');
      return;
    }

    setTimeout(() => {
      setContests([
        { id: 1, title: 'مسابقة المتابعة الأولى', company: 'شركة A', end_date: '2025-11-23', progress: 80 },
        { id: 2, title: 'مسابقة المشاركة الثانية', company: 'شركة B', end_date: '2025-11-30', progress: 60 },
        { id: 3, title: 'مسابقة الإحالات', company: 'شركة C', end_date: '2025-12-07', progress: 40 },
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
      <Navigation userRole="participant" />
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">المسابقات</h1>
        <p className="text-gray-600 mb-8">المسابقات التي تشارك فيها</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <Link
              key={contest.id}
              href={`/contest/${contest.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-900">{contest.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{contest.company}</p>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">التقدم</span>
                  <span className="text-sm font-semibold text-gray-900">{contest.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${contest.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(contest.end_date).toLocaleDateString('ar-SA')}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
