// src/components/ui/NotificationContainer.tsx
'use client';

import { useNotifications } from '@/hooks/useNotification';

export function NotificationContainer() {
  const notifications = useNotifications();

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`}
        >
          <span className="text-lg font-bold">{getIcon(notification.type)}</span>
          <span>{notification.message}</span>
        </div>
      ))}
    </div>
  );
}
