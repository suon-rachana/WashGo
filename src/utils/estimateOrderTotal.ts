import type { Promotion } from '@/src/data/mock/promotions';
import type { Service } from '@/src/types/service';

// Mock flat fees — would come from the laundry shop / delivery provider in a real backend.
export const PICKUP_FEE = 1.0;
export const RETURN_DELIVERY_FEE = 1.5;

export interface OrderTotalEstimate {
  laundryFee: number;
  pickupFee: number;
  returnDeliveryFee: number;
  discountAmount: number;
  total: number;
}

export function estimateOrderTotal(
  selectedServices: Pick<Service, 'price'>[],
  promotion?: Promotion
): OrderTotalEstimate {
  const laundryFee = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const discountAmount = promotion ? laundryFee * (promotion.discountPercent / 100) : 0;
  const total = laundryFee + PICKUP_FEE + RETURN_DELIVERY_FEE - discountAmount;

  return { laundryFee, pickupFee: PICKUP_FEE, returnDeliveryFee: RETURN_DELIVERY_FEE, discountAmount, total };
}
