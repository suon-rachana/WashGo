import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export interface PaymentMethod {
  id: string;
  label: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>['name'];
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
  },
  {
    id: 'aba',
    label: 'ABA Pay',
    description: 'Pay directly from your ABA Mobile account.',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'wing',
    label: 'Wing',
    description: 'Pay using your Wing wallet balance.',
    icon: 'wallet-outline',
  },
  {
    id: 'card',
    label: 'Card ending 4242',
    description: 'Visa card on file.',
    icon: 'card-outline',
  },
];

export const DEFAULT_PAYMENT_METHOD_ID = 'cod';
