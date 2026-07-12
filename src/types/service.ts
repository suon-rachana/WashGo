import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type ServicePriceType = 'kg' | 'item' | 'fixed';
export type ServiceBadge = 'Popular' | 'Fastest' | 'Premium';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  price: number;
  priceType: ServicePriceType;
  badge?: ServiceBadge;
  color?: string;
  comingSoon?: boolean;
}
