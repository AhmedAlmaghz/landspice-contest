'use client';

import { useState } from 'react';
import { Trophy, Shuffle, Save, X, Award } from 'lucide-react';
import { Participant } from '@/types';

interface DrawSystemProps {
  participants: Participant[];
  onDraw: (count: number) => Promise<Participant[]>;
  onSave: (winners: Participant[]) => Promise<void>;
}

export default function DrawSystem({ participants, onDraw, onSave }: DrawSystemProps) {
  const [winnersCount, setWinnersCount] = useState(1);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const eligibleCount = participants.filter(p => p.progress >= 50).length;

  const handleDraw = async () => {
    if (winnersCount < 1 || winnersCount > eligibleCount) {
      alert('عدد الفائزين غير صحيح');
      return;
    }

    setIsDrawing(true);
    try {
      const drawnWinners = await onDraw(winnersCount);
      setWinners(drawnWinners);
      setShowPreview(true);
    } catch (error) {
      console.error('Error drawing winners:', error);
      alert('حدث خطأ في السحب');
    } finally {
      setIsDrawing(false);
    }
  };

  const handleSave = async () => {
    if (winners.length === 0) return;

    setIsSaving(true);
    try {
      await onSave(winners);
      alert('تم حفظ الفائزين بنجاح!');
      setWinners([]);
      setShowPreview(false);
    } catch (error) {
      console.error('Error saving winners:', error);
      alert('حدث خطأ في الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReDraw = () => {
    setWinners([]);
    setShowPreview(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">نظام السحب العشوائي</h3>
          <p className="text-sm text-gray-600">اختر عدد الفائزين وابدأ السحب</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <p className="text-sm text-blue-600 font-medium mb-1">إجمالي المشاركين</p>
          <p className="text-3xl font-bold text-blue-900">{participants.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <p className="text-sm text-green-600 font-medium mb-1">المؤهلون للسحب</p>
          <p className="text-3xl font-bold text-green-900">{eligibleCount}</p>
          <p className="text-xs text-green-600 mt-1">التقدم ≥ 50%</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
          <p className="text-sm text-purple-600 font-medium mb-1">الفائزون المختارون</p>
          <p className="text-3xl font-bold text-purple-900">{winners.length}</p>
        </div>
      </div>

      {/* Draw Controls */}
      {!showPreview && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              عدد الفائزين:
            </label>
            <input
              type="number"
              min="1"
              max={eligibleCount}
              value={winnersCount}
              onChange={(e) => setWinnersCount(parseInt(e.target.value) || 1)}
              className="w-full md:w-64 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-semibold"
            />
            <p className="text-sm text-gray-500 mt-1">
              الحد الأقصى: {eligibleCount} مشارك
            </p>
          </div>

          <button
            onClick={handleDraw}
            disabled={isDrawing || eligibleCount === 0}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDrawing ? (
              <>
                <Shuffle className="w-5 h-5 animate-spin" />
                جاري السحب...
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5" />
                إجراء السحب العشوائي
              </>
            )}
          </button>
        </div>
      )}

      {/* Winners Preview */}
      {showPreview && winners.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-600" />
              <h4 className="text-xl font-bold text-gray-900">🎉 الفائزون المختارون</h4>
            </div>

            <div className="space-y-3">
              {winners.map((winner, index) => (
                <div
                  key={winner.id}
                  className="bg-white rounded-lg p-4 border-2 border-yellow-300 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{winner.name}</p>
                      <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                        <span>📧 {winner.email}</span>
                        <span>📱 {winner.phone}</span>
                        <span>📍 {winner.city}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">التقدم</p>
                      <p className="text-2xl font-bold text-green-600">{winner.progress}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-success flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Save className="w-5 h-5 animate-pulse" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ النتائج
                </>
              )}
            </button>

            <button
              onClick={handleReDraw}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Shuffle className="w-5 h-5" />
              إعادة السحب
            </button>

            <button
              onClick={() => {
                setWinners([]);
                setShowPreview(false);
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* No Eligible Participants */}
      {eligibleCount === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">لا يوجد مشاركون مؤهلون للسحب</p>
          <p className="text-sm text-gray-400 mt-2">يجب أن يكون التقدم 50% على الأقل</p>
        </div>
      )}
    </div>
  );
}
