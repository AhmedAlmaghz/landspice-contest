'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, Home, Trophy, Users, BarChart3, LogIn, Building2 } from 'lucide-react';
import { ROUTES } from '@/lib/navigation';
import SearchBar from './SearchBar';

export default function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName') || localStorage.getItem('userEmail');
    setUserRole(role);
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUserRole(null);
    setUserName(null);
    router.push(ROUTES.HOME);
  };

  // الروابط العامة للجميع
  const publicLinks = [
    { label: 'الرئيسية', href: ROUTES.HOME, icon: Home },
    { label: 'المسابقات', href: ROUTES.ALL_CONTESTS, icon: Trophy },
    { label: 'الشركات', href: ROUTES.ALL_COMPANIES, icon: Building2 },
    { label: 'تسجيل', href: ROUTES.REGISTER, icon: LogIn },
  ];

  // روابط الإدارة
  const adminLinks = [
    { label: 'لوحة التحكم', href: ROUTES.ADMIN, icon: BarChart3 },
    { label: 'الشركات', href: ROUTES.ADMIN_COMPANIES, icon: Users },
    { label: 'المسابقات', href: ROUTES.ADMIN_CONTESTS, icon: Trophy },
    { label: 'الشبكات', href: ROUTES.ADMIN_PLATFORMS, icon: Users },
  ];

  // روابط الشركة
  const companyLinks = [
    { label: 'لوحة التحكم', href: ROUTES.COMPANY_DASHBOARD, icon: BarChart3 },
    { label: 'المسابقات', href: ROUTES.COMPANY_CONTESTS, icon: Trophy },
    { label: 'المشاركون', href: ROUTES.COMPANY_PARTICIPANTS, icon: Users },
    { label: 'الشبكات', href: ROUTES.COMPANY_PLATFORMS, icon: Users },
    { label: 'التحليلات', href: ROUTES.COMPANY_ANALYTICS, icon: BarChart3 },
  ];

  // روابط المشارك
  const participantLinks = [
    { label: 'لوحة التحكم', href: ROUTES.PARTICIPANT_DASHBOARD, icon: BarChart3 },
    { label: 'المسابقات', href: ROUTES.PARTICIPANT_CONTESTS, icon: Trophy },
    { label: 'الملف الشخصي', href: ROUTES.PARTICIPANT_PROFILE, icon: User },
    { label: 'الإحالات', href: ROUTES.PARTICIPANT_REFERRALS, icon: Users },
  ];

  let navigationLinks = publicLinks;
  if (userRole === 'admin') navigationLinks = adminLinks;
  else if (userRole === 'company') navigationLinks = companyLinks;
  else if (userRole === 'participant') navigationLinks = participantLinks;

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">L</span>
            </div>
            <span className="hidden sm:inline">LandSpice</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block">
            <SearchBar />
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center gap-4">
            {userRole ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{userName}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Links for Guests */}
                <Link
                  href={ROUTES.ADMIN_LOGIN}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  دخول الإدارة
                </Link>
                <Link
                  href={ROUTES.COMPANY_LOGIN}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  دخول الشركة
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-white/20 py-4 space-y-2">
            {navigationLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile User Actions */}
            {userRole ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            ) : (
              <>
                <Link
                  href={ROUTES.ADMIN_LOGIN}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  دخول الإدارة
                </Link>
                <Link
                  href={ROUTES.COMPANY_LOGIN}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  دخول الشركة
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
