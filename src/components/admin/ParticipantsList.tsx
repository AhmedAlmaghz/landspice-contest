'use client';

import { Participant } from '@/types';
import { Mail, Phone, MapPin, Award, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';

interface ParticipantsListProps {
  participants: Participant[];
  onDelete?: (id: number) => void;
  onView?: (participant: Participant) => void;
}

export default function ParticipantsList({ participants, onDelete, onView }: ParticipantsListProps) {
  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getProgressLabel = (progress: number) => {
    if (progress === 100) return 'مكتمل';
    if (progress >= 50) return 'متقدم';
    if (progress >= 25) return 'متوسط';
    return 'مبتدئ';
  };

  if (participants.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Award className="w-16 h-16 mx-auto" />
        </div>
        <p className="text-gray-600 text-lg">لا توجد نتائج</p>
        <p className="text-gray-400 text-sm mt-2">جرّب تغيير معايير البحث أو الفلترة</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold">#</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">الاسم</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">معلومات الاتصال</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">المدينة</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">التقدم</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">المشاركات</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">الإحالات</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {participants.map((participant, index) => (
              <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{participant.name}</p>
                      <p className="text-xs text-gray-500">كود: {participant.referral_code}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{participant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{participant.phone}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {participant.city}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(participant.progress)} transition-all duration-500`}
                          style={{ width: `${participant.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{participant.progress}%</span>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      participant.progress === 100 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {getProgressLabel(participant.progress)}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-900">{participant.shares}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {participant.referred_by ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">نعم</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm">لا</span>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(participant)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف ${participant.name}؟`)) {
                            onDelete(participant.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          عرض <span className="font-semibold text-gray-900">{participants.length}</span> مشارك
        </p>
      </div>
    </div>
  );
}
