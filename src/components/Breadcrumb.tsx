'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { BREADCRUMB_ITEMS, ROUTES } from '@/lib/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const items = BREADCRUMB_ITEMS[pathname as keyof typeof BREADCRUMB_ITEMS] || [];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>

          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
