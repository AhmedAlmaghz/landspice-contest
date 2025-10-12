'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Gift, 
  Settings, 
  TrendingUp,
  Download,
  LogOut,
  Send
} from 'lucide-react';
import { Participant, ContestStats } from '@/types';
import StatsCard from '@/components/admin/StatsCard';
import SearchFilter from '@/components/admin/SearchFilter';
import ParticipantsList from '@/components/admin/ParticipantsList';
import DrawSystem from '@/components/admin/DrawSystem';
import SettingsPanel from '@/components/admin/SettingsPanel';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import PublishHistory from '@/components/admin/PublishHistory';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState<ContestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgress, setFilterProgress] = useState('all');
  const [filterCity, setFilterCity] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load participants
      const participantsRes = await fetch('/api/participants');
      const participantsData = await participantsRes.json();
      setParticipants(participantsData.participants || []);

      // Load stats
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData.stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout?admin=true', {
        method: 'POST',
      });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch('/api/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participants-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('حدث خطأ في التصدير');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'لوحة المعلومات', icon: BarChart3 },
    { id: 'analytics', label: 'التحليلات', icon: TrendingUp },
    { id: 'participants', label: 'المشاركون', icon: Users },
    { id: 'draw', label: 'السحب العشوائي', icon: Gift },
    { id: 'publish', label: 'النشر', icon: Send },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    
    const matchesProgress = filterProgress === 'all' ||
      (filterProgress === 'completed' && p.progress >= 100) ||
      (filterProgress === 'incomplete' && p.progress < 100);
    
    const matchesCity = filterCity === 'all' || p.city === filterCity;
    
    return matchesSearch && matchesProgress && matchesCity;
  });

  const cities = Array.from(new Set(participants.map(p => p.city)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                🌶️ لوحة تحكم LandSpice
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">تصدير</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-x-auto">
          <div className="flex border-b min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="إجمالي المشاركين"
                value={stats.total}
                icon="users"
                color="blue"
                trend={12}
              />
              <StatsCard
                title="مكتملين 100%"
                value={stats.completed}
                icon="check"
                color="green"
                trend={8}
              />
              <StatsCard
                title="إجمالي المشاركات"
                value={stats.total_shares}
                icon="share"
                color="orange"
                trend={15}
              />
              <StatsCard
                title="إجمالي الإحالات"
                value={stats.total_referrals}
                icon="link"
                color="purple"
                trend={10}
              />
            </div>

            {/* Recent Participants */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">المشاركون الجدد</h3>
              <ParticipantsList 
                participants={participants.slice(0, 10)}
                onRefresh={loadData}
              />
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div className="space-y-6">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterProgress={filterProgress}
              onProgressFilterChange={setFilterProgress}
              filterCity={filterCity}
              onCityFilterChange={setFilterCity}
              cities={cities}
            />
            <ParticipantsList 
              participants={filteredParticipants}
              onRefresh={loadData}
            />
          </div>
        )}

        {/* Draw Tab */}
        {activeTab === 'draw' && (
          <DrawSystem onDrawComplete={loadData} />
        )}

        {/* Publish Tab */}
        {activeTab === 'publish' && (
          <PublishHistory />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <SettingsPanel onSave={loadData} />
        )}
      </div>
    </div>
  );
}
