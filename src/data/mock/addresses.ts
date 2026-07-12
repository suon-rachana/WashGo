import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  province: string;
  notes: string;
  isDefault?: boolean;
  icon: ComponentProps<typeof Ionicons>['name'];
  /** Formatted "street, city, province" display line — kept alongside the
   * structured fields so existing screens can keep rendering a single line
   * without re-deriving it themselves. */
  detail: string;
}

function formatAddressDetail(street: string, city: string, province: string): string {
  return [street, city, province].filter(Boolean).join(', ');
}

export const addresses: Address[] = [
  {
    id: 'current-location',
    label: 'Current Location',
    street: 'Using your live GPS location',
    city: '',
    province: '',
    notes: '',
    icon: 'locate-outline',
    detail: formatAddressDetail('Using your live GPS location', '', ''),
  },
  {
    id: 'home',
    label: 'Home',
    street: '12 Wat Bo Road',
    city: 'Siem Reap',
    province: 'Siem Reap Province',
    notes: 'Blue gate, ring the bell twice.',
    isDefault: true,
    icon: 'home-outline',
    detail: formatAddressDetail('12 Wat Bo Road', 'Siem Reap', 'Siem Reap Province'),
  },
  {
    id: 'work',
    label: 'Work',
    street: 'Sivatha Blvd',
    city: 'Siem Reap',
    province: 'Siem Reap Province',
    notes: '',
    icon: 'briefcase-outline',
    detail: formatAddressDetail('Sivatha Blvd', 'Siem Reap', 'Siem Reap Province'),
  },
];
