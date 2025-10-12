'use client';

import { Trophy, Target, CheckCircle } from 'lucide-react';
import { getEncouragementMessage } from '@/lib/socialPlatforms';

interface ProgressTrackerProps {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
}

export default function ProgressTracker({ 
  completedCount, 
  totalCount, 
  progressPercentage 
}: ProgressTrackerProps) {
  const encouragementMessage = getEncouragementMessage(completedCount, totalCount);
  const isComplete = completedCount === totalCount;

  return (
    <div className="card">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          {isComplete ? (
            <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />
          ) : (
            <Target className="w-12 h-12 text-purple-600" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {isComplete ? '🎉 تهانينا!' : '📊 تقدمك في المسابقة'}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {encouragementMessage}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            التقدم الكلي
          </span>
          <span className="text-sm font-bold text-purple-600">
            {progressPercentage}%
          </span>
        </div>
        
        <div className="progress-bar h-4">
          <div 
            className="progress-fill h-full relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {completedCount}
          </div>
          <div className="text-xs text-gray-600">
            مكتمل
          </div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {totalCount - completedCount}
          </div>
          <div className="text-xs text-gray-600">
            متبقي
          </div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {totalCount}
          </div>
          <div className="text-xs text-gray-600">
            الإجمالي
          </div>
        </div>
      </div>

      {/* Completion Badge */}
      {isComplete && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white text-center animate-fade-in">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>
          <p className="font-bold text-lg mb-1">
            أكملت جميع المتابعات!
          </p>
          <p className="text-sm text-white/90">
            أنت الآن مؤهل للسحب على الجوائز 🎁
          </p>
        </div>
      )}
    </div>
  );
}
