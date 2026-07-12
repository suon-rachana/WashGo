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
  label: string;
}

export const orderSteps: OrderStep[] = [
  { id: 'order-placed', label: 'Order Placed' },
  { id: 'rider-assigned', label: 'Rider Assigned' },
  { id: 'picked-up', label: 'Picked Up' },
  { id: 'at-laundry-shop', label: 'At Laundry Shop' },
  { id: 'cleaning-in-progress', label: 'Cleaning in Progress' },
  { id: 'ready-for-delivery', label: 'Ready for Delivery' },
  { id: 'out-for-delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
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

// Shared status-badge label for an order: cancelled orders aren't part of the
// linear timeline, everything else reads its label from the current step.
export function getOrderStatusLabel(status: 'active' | 'completed' | 'cancelled', currentStepId: OrderStepId): string {
  if (status === 'cancelled') return 'Cancelled';
  return orderSteps.find((step) => step.id === currentStepId)?.label ?? 'Processing';
}
