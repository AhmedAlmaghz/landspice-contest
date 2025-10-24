'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/navigation';
import { hasPermission, Permission } from '@/lib/permissions';
import { UserRole } from '@/types/saas';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: Permission;
  fallbackRoute?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallbackRoute = ROUTES.HOME,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // الحصول على بيانات الجلسة من localStorage
        const userSession = localStorage.getItem('userSession');
        const userRole = localStorage.getItem('userRole') as UserRole | null;

        if (!userSession || !userRole) {
          router.push(fallbackRoute);
          return;
        }

        // التحقق من الدور المطلوب
        if (requiredRole) {
          const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          if (!roles.includes(userRole)) {
            router.push(fallbackRoute);
            return;
          }
        }

        // التحقق من الصلاحية المطلوبة
        if (requiredPermission) {
          if (!hasPermission(userRole, requiredPermission)) {
            router.push(fallbackRoute);
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Authorization check failed:', error);
        router.push(fallbackRoute);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [requiredRole, requiredPermission, router, fallbackRoute]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h1>
          <p className="text-gray-600">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
