'use client';

import { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Trash2, Eye, Play, Pause } from 'lucide-react';

interface Contest {
  id: number;
  company_id: number;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  end_date?: string;
  max_participants?: number;
  created_at: string;
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    end_date: '',
    prize_description: '',
    rules: ''
  });

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await fetch('/api/v1/contests');
      if (response.ok) {
        const data = await response.json();
        setContests(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          status: 'draft',
          end_date: '',
          prize_description: '',
          rules: ''
        });
        setShowForm(false);
        fetchContests();
      }
    } catch (error) {
      console.error('Error creating contest:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'مسودة' },
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'نشطة' },
      ended: { bg: 'bg-red-100', text: 'text-red-800', label: 'منتهية' },
      cancelled: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'ملغاة' }
    };
    const s = statusMap[status] || statusMap.draft;
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">إدارة المسابقات</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            مسابقة جديدة
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="عنوان المسابقة"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="datetime-local"
                  placeholder="تاريخ الانتهاء"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                placeholder="وصف المسابقة"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <textarea
                placeholder="وصف الجوائز"
                value={formData.prize_description}
                onChange={(e) => setFormData({ ...formData, prize_description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <textarea
                placeholder="القواعس"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  إنشاء
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

        {/* Contests List */}
        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">العنوان</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">الحالة</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">تاريخ الإنشاء</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((contest) => (
                  <tr key={contest.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 font-semibold">{contest.title}</td>
                    <td className="px-6 py-3">{getStatusBadge(contest.status)}</td>
                    <td className="px-6 py-3">{new Date(contest.created_at).toLocaleDateString('ar-SA')}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800" title="عرض">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-800" title="تعديل">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        {contest.status === 'draft' && (
                          <button className="text-green-600 hover:text-green-800" title="تفعيل">
                            <Play className="w-5 h-5" />
                          </button>
                        )}
                        {contest.status === 'active' && (
                          <button className="text-orange-600 hover:text-orange-800" title="إيقاف">
                            <Pause className="w-5 h-5" />
                          </button>
                        )}
                        <button className="text-red-600 hover:text-red-800" title="حذف">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
