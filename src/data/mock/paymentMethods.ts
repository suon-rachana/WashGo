import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export interface PaymentMethod {
  id: string;
  label: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  /** True when linking a real account for this method isn't implemented yet —
   * shown with a "Coming Soon" badge instead of pretending it's connected. */
  comingSoon?: boolean;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay with cash when your laundry is delivered.',
    icon: 'cash-outline',
  },
  {
    id: 'khqr',
    label: 'KHQR',
    description: 'Scan and pay instantly with any KHQR-supported app.',
    icon: 'qr-code-outline',
    comingSoon: true,
  },
  {
    id: 'aba',
    label: 'ABA Pay',
    description: 'Pay directly from your ABA Mobile account.',
    icon: 'phone-portrait-outline',
    comingSoon: true,
  },
  {
    id: 'acleda',
    label: 'ACLEDA',
    description: 'Pay directly from your ACLEDA Mobile account.',
    icon: 'business-outline',
    comingSoon: true,
  },
  {
    id: 'wing',
    label: 'Wing',
    description: 'Pay using your Wing wallet balance.',
    icon: 'wallet-outline',
    comingSoon: true,
  },
];

export const DEFAULT_PAYMENT_METHOD_ID = 'cod';
