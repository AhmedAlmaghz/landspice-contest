// src/hooks/useNotification.ts
import { useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Store للإشعارات (يمكن استبداله بـ Context API أو Redux)
let notifications: Notification[] = [];
let listeners: Array<(notifications: Notification[]) => void> = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...notifications]));
}

function addNotification(notification: Notification) {
  notifications.push(notification);
  notifyListeners();

  if (notification.duration !== Infinity) {
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.duration || 3000);
  }
}

function removeNotification(id: string) {
  notifications = notifications.filter(n => n.id !== id);
  notifyListeners();
}

export function useNotification() {
  const showSuccess = useCallback((message: string, duration?: number) => {
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      message,
      duration,
    });
  }, []);

  const showError = useCallback((message: string, duration?: number) => {
    addNotification({
      id: Date.now().toString(),
      type: 'error',
      message,
      duration,
    });
  }, []);

  const showWarning = useCallback((message: string, duration?: number) => {
    addNotification({
      id: Date.now().toString(),
      type: 'warning',
      message,
      duration,
    });
  }, []);

  const showInfo = useCallback((message: string, duration?: number) => {
    addNotification({
      id: Date.now().toString(),
      type: 'info',
      message,
      duration,
    });
  }, []);

  const removeNotificationById = useCallback((id: string) => {
    removeNotification(id);
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification: removeNotificationById,
  };
}

// Hook لاستخدام الإشعارات في المكونات
export function useNotifications() {
  const [notificationsList, setNotificationsList] = require('react').useState<Notification[]>([]);

  require('react').useEffect(() => {
    listeners.push(setNotificationsList);
    setNotificationsList([...notifications]);

    return () => {
      listeners = listeners.filter(listener => listener !== setNotificationsList);
    };
  }, []);

  return notificationsList;
}
