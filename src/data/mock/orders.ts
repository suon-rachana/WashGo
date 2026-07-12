import type { OrderStepId } from '@/src/data/mock/order';

export type OrderStatus = 'active' | 'completed' | 'cancelled';

export interface OrderSummary {
  id: string;
  laundryId: string;
  serviceIds: string;
  addressId: string;
  sizeId: string;
  dateId: string;
  timeId: string;
  status: OrderStatus;
  currentStepId: OrderStepId;
  notes: string;
  total: number;
  createdAt: string;
}

// The single source of truth for an order's full booking details. Tracking and
// Order Details both look an order up by `id` here instead of relying on route
// params for laundry/services/address/size/date/time — that way both screens
// show the same data regardless of which screen navigated to them.
export const mockOrders: OrderSummary[] = [
  {
    id: '#WG2507180001',
    laundryId: 'laundry-1',
    serviceIds: 'wash-fold,express',
    addressId: 'home',
    sizeId: 'medium',
    dateId: 'today',
    timeId: 'morning',
    status: 'active',
    currentStepId: 'rider-assigned',
    notes: 'Please call upon arrival — gate code is 1234.',
    total: 4.26,
    createdAt: '2026-07-18',
  },
  {
    id: '#WG2507150007',
    laundryId: 'laundry-2',
    serviceIds: 'dry-cleaning,ironing',
    addressId: 'current-location',
    sizeId: 'large',
    dateId: 'today',
    timeId: 'afternoon',
    status: 'completed',
    currentStepId: 'delivered',
    notes: 'Leave with the receptionist if unavailable.',
    total: 5.3,
    createdAt: '2026-07-15',
  },
  {
    id: '#WG2506280014',
    laundryId: 'laundry-4',
    serviceIds: 'wash-fold',
    addressId: 'home',
    sizeId: 'small',
    dateId: 'tomorrow',
    timeId: 'evening',
    status: 'completed',
    currentStepId: 'delivered',
    notes: 'No additional notes.',
    total: 3.46,
    createdAt: '2026-06-28',
  },
  {
    id: '#WG2507100003',
    laundryId: 'laundry-3',
    serviceIds: 'express',
    addressId: 'home',
    sizeId: 'medium',
    dateId: 'today',
    timeId: 'morning',
    status: 'cancelled',
    currentStepId: 'order-placed',
    notes: 'Cancelled by customer before pickup.',
    total: 3.3,
    createdAt: '2026-07-10',
  },
];
