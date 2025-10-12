'use client';

import { useState } from 'react';
import { Calendar, Clock, Send } from 'lucide-react';

interface PublishSchedulerProps {
  onSchedule: (date: Date, time: string) => void;
  onPublishNow: () => void;
}

export default function PublishScheduler({ onSchedule, onPublishNow }: PublishSchedulerProps) {
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      alert('الرجاء اختيار التاريخ والوقت');
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    
    if (scheduledDateTime <= new Date()) {
      alert('الرجاء اختيار تاريخ ووقت في المستقبل');
      return;
    }

    onSchedule(scheduledDateTime, scheduleTime);
    setIsScheduled(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">جدولة النشر</h3>

      <div className="space-y-4">
        {/* Publish Now */}
        <button
          onClick={onPublishNow}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all"
        >
          <Send className="w-5 h-5" />
          نشر الآن
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو</span>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline ml-2" />
              التاريخ:
            </label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline ml-2" />
              الوقت:
            </label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSchedule}
            disabled={!scheduleDate || !scheduleTime}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calendar className="w-5 h-5" />
            جدولة النشر
          </button>
        </div>

        {isScheduled && (
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg animate-fade-in">
            <p className="text-green-800 font-medium">
              ✅ تم جدولة النشر بنجاح!
            </p>
            <p className="text-sm text-green-600 mt-1">
              سيتم النشر في: {scheduleDate} الساعة {scheduleTime}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
