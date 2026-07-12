import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type NotificationCategory = 'orders' | 'promotions';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export const notifications: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'orders',
    icon: 'bicycle-outline',
    title: 'Rider Assigned',
    message: 'Chenda is on the way to pick up your laundry.',
    time: '2 min ago',
    isRead: false,
  },
  {
    id: 'notif-2',
    category: 'orders',
    icon: 'cube-outline',
    title: 'Laundry Picked Up',
    message: 'Your laundry has been picked up and is on its way to the shop.',
    time: '1 hr ago',
    isRead: false,
  },
  {
    id: 'notif-3',
    category: 'orders',
    icon: 'sparkles-outline',
    title: 'Cleaning Started',
    message: 'Your laundry partner has started cleaning your items.',
    time: '3 hr ago',
    isRead: true,
  },
  {
    id: 'notif-4',
    category: 'orders',
    icon: 'checkmark-done-outline',
    title: 'Ready for Delivery',
    message: 'Your laundry is clean and ready to be delivered.',
    time: 'Yesterday',
    isRead: true,
  },
  {
    id: 'notif-5',
    category: 'orders',
    icon: 'home-outline',
    title: 'Delivered',
    message: 'Your laundry has been delivered. Enjoy your fresh clothes!',
    time: '2 days ago',
    isRead: true,
  },
  {
    id: 'notif-6',
    category: 'promotions',
    icon: 'pricetag-outline',
    title: '20% Off Your First Order',
    message: 'Use code WASHGO20 to save on your next pickup.',
    time: '3 days ago',
    isRead: true,
  },
];
