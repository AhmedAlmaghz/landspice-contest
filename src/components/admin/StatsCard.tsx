'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'purple' | 'blue' | 'green' | 'orange' | 'pink';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    border: 'border-purple-200',
  },
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    border: 'border-green-200',
  },
  orange: {
    bg: 'bg-orange-100',
    icon: 'text-orange-600',
    border: 'border-orange-200',
  },
  pink: {
    bg: 'bg-pink-100',
    icon: 'text-pink-600',
    border: 'border-pink-200',
  },
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-2 ${colors.border} hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">من الأسبوع الماضي</span>
            </div>
          )}
        </div>
        
        <div className={`${colors.bg} p-4 rounded-full`}>
          <Icon className={`w-8 h-8 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}
