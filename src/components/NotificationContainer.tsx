'use client';

import Notification, { NotificationProps } from './Notification';

export type NotificationPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-center' 
  | 'bottom-center';

interface NotificationContainerProps {
  notifications: Omit<NotificationProps, 'onClose'>[];
  position?: NotificationPosition;
  onClose: (id: string) => void;
}

export default function NotificationContainer({ 
  notifications, 
  position = 'top-right',
  onClose 
}: NotificationContainerProps) {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 left-4';
      case 'top-left':
        return 'top-4 right-4';
      case 'bottom-right':
        return 'bottom-4 left-4';
      case 'bottom-left':
        return 'bottom-4 right-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        fixed ${getPositionStyles()}
        z-50 pointer-events-none
        flex flex-col gap-2
      `}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
