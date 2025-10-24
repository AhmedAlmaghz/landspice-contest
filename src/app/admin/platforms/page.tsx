'use client';

import { useState, useEffect } from 'react';
import { Share2, Plus, Edit2, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';

interface SocialPlatform {
  id: number;
  contest_id: number;
  platform_name: string;
  platform_url: string;
  action_type: string;
  is_active: boolean;
  verification_type: string;
  position: number;
}

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedContest, setSelectedContest] = useState<number | null>(null);
  const [contests, setContests] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    platform_name: '',
    platform_url: '',
    action_type: 'follow',
    verification_type: 'automatic'
  });

  useEffect(() => {
    fetchContests();
    if (selectedContest) {
      fetchPlatforms();
    }
  }, [selectedContest]);

  const fetchContests = async () => {
    try {
      const response = await fetch('/api/v1/contests');
      if (response.ok) {
        const data = await response.json();
        setContests(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedContest(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
    }
  };

  const fetchPlatforms = async () => {
    if (!selectedContest) return;
    try {
      const response = await fetch(`/api/v1/contests/${selectedContest}/platforms`);
      if (response.ok) {
        const data = await response.json();
        setPlatforms(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContest) return;

    try {
      const response = await fetch(`/api/v1/contests/${selectedContest}/platforms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          position: platforms.length
        })
      });

      if (response.ok) {
        setFormData({
          platform_name: '',
          platform_url: '',
          action_type: 'follow',
          verification_type: 'automatic'
        });
        setShowForm(false);
        fetchPlatforms();
      }
    } catch (error) {
      console.error('Error creating platform:', error);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/v1/contests/${selectedContest}/platforms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      });

      if (response.ok) {
        fetchPlatforms();
      }
    } catch (error) {
      console.error('Error updating platform:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشبكة؟')) return;

    try {
      const response = await fetch(`/api/v1/contests/${selectedContest}/platforms/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchPlatforms();
      }
    } catch (error) {
      console.error('Error deleting platform:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Share2 className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">إدارة الشبكات الاجتماعية</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            شبكة جديدة
          </button>
        </div>

        {/* Contest Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">اختر المسابقة:</label>
          <select
            value={selectedContest || ''}
            onChange={(e) => setSelectedContest(Number(e.target.value))}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {contests.map((contest) => (
              <option key={contest.id} value={contest.id}>
                {contest.title}
              </option>
            ))}
          </select>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="اسم الشبكة (Facebook, Instagram, etc)"
                  value={formData.platform_name}
                  onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="url"
                  placeholder="رابط الشبكة"
                  value={formData.platform_url}
                  onChange={(e) => setFormData({ ...formData, platform_url: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={formData.action_type}
                  onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="follow">متابعة</option>
                  <option value="share">مشاركة</option>
                  <option value="like">إعجاب</option>
                  <option value="comment">تعليق</option>
                </select>
                <select
                  value={formData.verification_type}
                  onChange={(e) => setFormData({ ...formData, verification_type: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="automatic">تحقق تلقائي</option>
                  <option value="manual">تحقق يدوي</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Platforms List */}
        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {platforms.length === 0 ? (
              <div className="p-8 text-center text-gray-500">لا توجد شبكات اجتماعية</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700"></th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">الشبكة</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">نوع الإجراء</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">التحقق</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">الحالة</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {platforms.map((platform) => (
                    <tr key={platform.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 cursor-move">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                      </td>
                      <td className="px-6 py-3 font-semibold">{platform.platform_name}</td>
                      <td className="px-6 py-3">
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {platform.action_type === 'follow' ? 'متابعة' :
                           platform.action_type === 'share' ? 'مشاركة' :
                           platform.action_type === 'like' ? 'إعجاب' : 'تعليق'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm">
                          {platform.verification_type === 'automatic' ? 'تلقائي' : 'يدوي'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {platform.is_active ? (
                          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">نشط</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">معطل</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleActive(platform.id, platform.is_active)}
                            className={platform.is_active ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}
                          >
                            {platform.is_active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(platform.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
