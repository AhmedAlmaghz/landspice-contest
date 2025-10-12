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
  Send,
  CheckCircle,
  Share2,
  Link,
  Eye
} from 'lucide-react';
import { Participant, ContestStats, Winner } from '@/types';
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
  const [winners, setWinners] = useState<Winner[]>([]);
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

      // Load winners
      const winnersRes = await fetch('/api/draw');
      const winnersData = await winnersRes.json();
      setWinners(winnersData.winners || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const conductDraw = async () => {
    try {
      const response = await fetch('/api/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numberOfWinners: 10,
          minProgress: 50
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWinners(data.winners);
        alert('تم إجراء السحب العشوائي بنجاح!');
      } else {
        const error = await response.json();
        alert(error.error || 'حدث خطأ في إجراء السحب');
      }
    } catch (error) {
      console.error('Error conducting draw:', error);
      alert('حدث خطأ في إجراء السحب');
    }
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "الاسم,البريد الإلكتروني,الهاتف,المدينة,تاريخ التسجيل,كود الإحالة,التقدم,المشاركات\n"
      + participants.map(p => 
        `${p.name},${p.email},${p.phone},${p.city},${new Date(p.registration_date).toLocaleDateString('ar-SA')},${p.referral_code},${p.progress}%,${p.shares}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contest_participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
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
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
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
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {stats?.total || 0}
                </h3>
                <p className="text-gray-600">إجمالي المشاركين</p>
              </div>
              
              <div className="card text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {stats?.completed || 0}
                </h3>
                <p className="text-gray-600">مكتملين 100%</p>
              </div>
              
              <div className="card text-center">
                <Share2 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {stats?.total_shares || 0}
                </h3>
                <p className="text-gray-600">إجمالي المشاركات</p>
              </div>
              
              <div className="card text-center">
                <Link className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {stats?.total_referrals || 0}
                </h3>
                <p className="text-gray-600">إجمالي الإحالات</p>
              </div>
            </div>

            {/* Recent Participants */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-6">المشاركون الجدد</h3>
              <div className="space-y-4">
                {participants.slice(0, 5).map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">{participant.name}</h4>
                      <p className="text-sm text-gray-600">{participant.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{participant.city}</p>
                      <p className="text-sm font-semibold text-purple-600">{participant.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-6">قائمة المشاركين</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-semibold">الاسم</th>
                    <th className="text-right py-3 px-4 font-semibold">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 font-semibold">الهاتف</th>
                    <th className="text-right py-3 px-4 font-semibold">المدينة</th>
                    <th className="text-right py-3 px-4 font-semibold">التقدم</th>
                    <th className="text-right py-3 px-4 font-semibold">المشاركات</th>
                    <th className="text-right py-3 px-4 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{participant.name}</td>
                      <td className="py-3 px-4">{participant.email}</td>
                      <td className="py-3 px-4">{participant.phone}</td>
                      <td className="py-3 px-4">{participant.city}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="progress-bar w-20">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${participant.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">{participant.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{participant.shares}</td>
                      <td className="py-3 px-4">
                        <button className="btn btn-secondary text-sm px-3 py-1">
                          <Eye className="w-4 h-4 mr-1" />
                          عرض
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Draw Tab */}
        {activeTab === 'draw' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-6">السحب العشوائي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عدد الفائزين:
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    min={1}
                    max={50}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الحد الأدنى للتقدم:
                  </label>
                  <input
                    type="number"
                    defaultValue={50}
                    min={0}
                    max={100}
                    className="input"
                  />
                </div>
              </div>
              <button
                onClick={conductDraw}
                className="btn btn-primary"
              >
                <Gift className="w-4 h-4 mr-2" />
                إجراء السحب العشوائي
              </button>
            </div>

            {winners.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-6">الفائزون</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {winners.map((winner, index) => (
                    <div key={winner.id} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg text-center">
                      <h4 className="text-2xl font-bold mb-2">🥇 المركز {index + 1}</h4>
                      <p className="font-semibold">{winner.name}</p>
                      <p className="text-sm opacity-90">{winner.email}</p>
                      <p className="text-sm opacity-90">{winner.phone}</p>
                      <p className="text-sm opacity-90">{winner.city}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4 justify-center">
                  <button className="btn btn-success">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    إعلان النتائج
                  </button>
                  <button className="btn btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    تصدير قائمة الفائزين
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <SettingsPanel
              initialSettings={{
                contest_title: 'مسابقة LandSpice',
                prize_description: 'جوائز قيمة للفائزين',
                end_date: '',
                facebook_url: 'https://facebook.com/LandSpice25',
                instagram_url: 'https://instagram.com/LandSpice25',
                youtube_url: 'https://youtube.com/@LandSpice',
                tiktok_url: 'https://tiktok.com/@LandSpice',
                twitter_url: 'https://x.com/LandSpice25',
                whatsapp_channel_url: 'https://whatsapp.com/channel/0029Vb62xmZC6ZvZa3u0Yn0C',
              }}
              onSave={async (settings) => {
                const response = await fetch('/api/social-links', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(settings),
                });

                if (!response.ok) {
                  throw new Error('فشل في حفظ الإعدادات');
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
