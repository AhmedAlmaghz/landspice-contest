'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, Eye } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subscription_plan: string;
  max_contests: number;
  max_participants: number;
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subscription_plan: 'free'
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/v1/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: '', email: '', phone: '', subscription_plan: 'free' });
        setShowForm(false);
        fetchCompanies();
      }
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشركة؟')) return;
    
    try {
      const response = await fetch(`/api/v1/companies/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCompanies();
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">إدارة الشركات</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            شركة جديدة
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="اسم الشركة"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.subscription_plan}
                  onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="free">مجاني</option>
                  <option value="pro">احترافي</option>
                  <option value="enterprise">شامل</option>
                </select>
              </div>
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

        {/* Companies List */}
        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">اسم الشركة</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">الخطة</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">المسابقات</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{company.name}</td>
                    <td className="px-6 py-3">{company.email}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        company.subscription_plan === 'free' ? 'bg-gray-100 text-gray-800' :
                        company.subscription_plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {company.subscription_plan === 'free' ? 'مجاني' :
                         company.subscription_plan === 'pro' ? 'احترافي' : 'شامل'}
                      </span>
                    </td>
                    <td className="px-6 py-3">{company.max_contests}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-800">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
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
          </div>
        )}
      </div>
    </div>
  );
}
