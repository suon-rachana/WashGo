import { create } from 'zustand';

import { notifications as seedNotifications, type WashGoNotification } from '@/src/data/mock/notifications';

interface NotificationsState {
  notifications: WashGoNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

// Global (client-only) notifications state — shared between the notification
// bell on Home, the Profile menu row, and the Notifications screen so marking
// one (or all) as read updates every badge immediately. No backend; resets on
// app restart, mirroring src/store/favorites.ts.
export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: seedNotifications,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id && !notification.isRead ? { ...notification, isRead: true } : notification
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.isRead ? notification : { ...notification, isRead: true }
      ),
    })),
}));
