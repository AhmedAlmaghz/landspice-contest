'use client';

import { useState, useEffect } from 'react';
import { History, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';

interface PublishRecord {
  id: number;
  content: string;
  platforms: string[];
  status: 'published' | 'scheduled' | 'failed';
  createdAt: string;
  scheduleDate?: string;
}

export default function PublishHistory() {
  const [history, setHistory] = useState<PublishRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/publish');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: number) => {
    if (!confirm('هل تريد حذف هذا السجل؟')) return;

    try {
      await fetch(`/api/publish/${id}`, { method: 'DELETE' });
      setHistory(history.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'تم النشر';
      case 'scheduled':
        return 'مجدول';
      case 'failed':
        return 'فشل';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-full">
          <History className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">سجل النشر</h3>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">لا يوجد سجل نشر حتى الآن</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(record.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                    {getStatusText(record.status)}
                  </span>
                </div>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <p className="text-gray-700 mb-3 line-clamp-2">{record.content}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-2">
                  {record.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
                <span className="text-gray-500">
                  {new Date(record.createdAt).toLocaleDateString('ar-YE')}
                </span>
              </div>

              {record.scheduleDate && (
                <div className="mt-2 text-sm text-blue-600">
                  مجدول: {new Date(record.scheduleDate).toLocaleString('ar-YE')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
