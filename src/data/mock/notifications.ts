import type { TranslationKey, TranslationParams } from '@/src/i18n';

export type NotificationType =
  | 'order_created'
  | 'rider_assigned'
  | 'pickup_started'
  | 'picked_up'
  | 'washing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'promotion'
  | 'system';

export interface WashGoNotification {
  id: string;
  type: NotificationType;
  titleKey: TranslationKey;
  messageKey: TranslationKey;
  /** Values interpolated into `messageKey` (e.g. `{{riderName}}`, `{{orderId}}`) via `t()`. */
  messageParams?: TranslationParams;
  createdAt: string;
  isRead: boolean;
  orderId?: string;
}

// Order-related notification types map 1:1 to an active/tracked order and should
// open Tracking (in progress) or Order Details (completed/cancelled) when pressed.
export const ORDER_NOTIFICATION_TYPES: NotificationType[] = [
  'order_created',
  'rider_assigned',
  'pickup_started',
  'picked_up',
  'washing',
  'ready',
  'out_for_delivery',
  'delivered',
];

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Timestamps are computed relative to the real current time (not a fixed
// literal date) so "Just now" / "X minutes ago" / "X hours ago" always demo
// correctly no matter when this app is actually run.
const now = Date.now();
const minutesAgo = (n: number) => new Date(now - n * MINUTE).toISOString();
const hoursAgo = (n: number) => new Date(now - n * HOUR).toISOString();
const daysAgo = (n: number) => new Date(now - n * DAY).toISOString();

// Seed data — connected to the existing mock orders/rider rather than inventing
// new ones. Each active order's most recent notification matches its current
// `currentStepId` in src/data/mock/orders.ts and is left unread; earlier steps
// in that order's history are marked read.
const seedNotifications: WashGoNotification[] = [
  {
    id: 'notif-1',
    type: 'out_for_delivery',
    titleKey: 'notifOutForDeliveryTitle',
    messageKey: 'notifOutForDeliveryMessage',
    messageParams: { eta: '7:15 PM' },
    createdAt: minutesAgo(12),
    isRead: false,
    orderId: '#WG2507200005',
  },
  {
    id: 'notif-2',
    type: 'promotion',
    titleKey: 'notifPromotionTitle',
    messageKey: 'notifPromotionMessage',
    messageParams: { percent: 20 },
    createdAt: minutesAgo(45),
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'washing',
    titleKey: 'notifWashingTitle',
    messageKey: 'notifWashingMessage',
    messageParams: { laundryName: 'BlueWash Express' },
    createdAt: hoursAgo(2),
    isRead: false,
    orderId: '#WG2507190002',
  },
  {
    id: 'notif-4',
    type: 'rider_assigned',
    titleKey: 'notifRiderAssignedTitle',
    messageKey: 'notifRiderAssignedMessage',
    messageParams: { riderName: 'Chenda' },
    createdAt: hoursAgo(6),
    isRead: false,
    orderId: '#WG2507180001',
  },
  {
    id: 'notif-5',
    type: 'ready',
    titleKey: 'notifReadyTitle',
    messageKey: 'notifReadyMessage',
    createdAt: hoursAgo(9),
    isRead: true,
    orderId: '#WG2507200005',
  },
  {
    id: 'notif-6',
    type: 'picked_up',
    titleKey: 'notifPickedUpTitle',
    messageKey: 'notifPickedUpMessage',
    messageParams: { laundryName: 'BlueWash Express' },
    createdAt: hoursAgo(23),
    isRead: true,
    orderId: '#WG2507190002',
  },
  {
    id: 'notif-7',
    type: 'pickup_started',
    titleKey: 'notifPickupStartedTitle',
    messageKey: 'notifPickupStartedMessage',
    messageParams: { riderName: 'Chenda' },
    createdAt: hoursAgo(28),
    isRead: true,
    orderId: '#WG2507190002',
  },
  {
    id: 'notif-8',
    type: 'rider_assigned',
    titleKey: 'notifRiderAssignedTitle',
    messageKey: 'notifRiderAssignedMessage',
    messageParams: { riderName: 'Chenda' },
    createdAt: hoursAgo(36),
    isRead: true,
    orderId: '#WG2507190002',
  },
  {
    id: 'notif-9',
    type: 'order_created',
    titleKey: 'notifOrderCreatedTitle',
    messageKey: 'notifOrderCreatedMessage',
    messageParams: { orderId: '#WG2507180001' },
    createdAt: daysAgo(2),
    isRead: true,
    orderId: '#WG2507180001',
  },
  {
    id: 'notif-10',
    type: 'delivered',
    titleKey: 'notifDeliveredTitle',
    messageKey: 'notifDeliveredMessage',
    createdAt: daysAgo(6),
    isRead: true,
    orderId: '#WG2507150007',
  },
  {
    id: 'notif-11',
    type: 'system',
    titleKey: 'notifSystemTitle',
    messageKey: 'notifSystemMessage',
    createdAt: daysAgo(10),
    isRead: true,
  },
];

export const notifications: WashGoNotification[] = [...seedNotifications].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

export function getUnreadNotificationCount(notificationList: WashGoNotification[]): number {
  return notificationList.filter((notification) => !notification.isRead).length;
}
