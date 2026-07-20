import type { TranslationKey } from '@/src/i18n';

export type OrderStepId =
  | 'order-placed'
  | 'rider-assigned'
  | 'picked-up'
  | 'at-laundry-shop'
  | 'cleaning-in-progress'
  | 'ready-for-delivery'
  | 'out-for-delivery'
  | 'delivered';

export interface OrderStep {
  id: OrderStepId;
  labelKey: TranslationKey;
}

// Canonical step list + translation key, reused by OrderTimeline, Orders tab,
// Tracking, and Order Details so the progress copy only has to be translated once.
export const orderSteps: OrderStep[] = [
  { id: 'order-placed', labelKey: 'orderStepPlaced' },
  { id: 'rider-assigned', labelKey: 'orderStepRiderAssigned' },
  { id: 'picked-up', labelKey: 'orderStepPickedUp' },
  { id: 'at-laundry-shop', labelKey: 'orderStepAtLaundryShop' },
  { id: 'cleaning-in-progress', labelKey: 'orderStepWashing' },
  { id: 'ready-for-delivery', labelKey: 'orderStepReadyForDelivery' },
  { id: 'out-for-delivery', labelKey: 'orderStepOutForDelivery' },
  { id: 'delivered', labelKey: 'orderStepDelivered' },
];

export interface Rider {
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
}

export const mockRider: Rider = {
  name: 'Chenda',
  rating: 4.9,
  vehicle: 'Honda Beat',
  plate: '1AB-1234',
};

// Shared status-badge translation key for an order: cancelled/completed orders show their
// status directly, active orders read the label of whichever step they're currently on.
export function getOrderStatusLabelKey(
  status: 'active' | 'completed' | 'cancelled',
  currentStepId: OrderStepId
): TranslationKey {
  if (status === 'cancelled') return 'cancelled';
  if (status === 'completed') return 'completed';
  return orderSteps.find((step) => step.id === currentStepId)?.labelKey ?? 'orderStepPlaced';
}
