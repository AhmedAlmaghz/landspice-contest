'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, User } from 'lucide-react';
import { ROUTES, NAVIGATION_ITEMS } from '@/lib/navigation';

interface NavigationProps {
  userRole?: 'admin' | 'company' | 'participant';
  userName?: string;
}

export default function Navigation({ userRole = 'admin', userName }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getNavigationItems = () => {
    if (userRole === 'admin') return NAVIGATION_ITEMS.ADMIN;
    if (userRole === 'company') return NAVIGATION_ITEMS.COMPANY;
    if (userRole === 'participant') return NAVIGATION_ITEMS.PARTICIPANT;
    return [];
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('userRole');
    router.push(ROUTES.HOME);
  };

  const navigationItems = getNavigationItems();
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">LandSpice</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {userName && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">{userName}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
