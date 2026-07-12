import { Colors } from '@/src/theme';
import type { Service } from '@/src/types/service';

// Icons are Ionicons placeholders for now. Each is tagged with the custom WashGo
// SVG icon it should eventually be swapped for once the icon set is designed
// (see assets/icons/). Swapping is a one-line change per service — just replace
// `icon` with a custom icon component and update ServiceCard's renderer.
export const services: Service[] = [
  {
    id: 'wash-fold',
    title: 'Wash & Fold',
    description: 'We wash, dry, and neatly fold your clothes.',
    icon: 'shirt-outline', // TODO: replace with custom "wash-fold" SVG icon
    price: 1.2,
    priceType: 'kg',
    badge: 'Popular',
    color: Colors.primary,
  },
  {
    id: 'dry-cleaning',
    title: 'Dry Cleaning',
    description: 'Professional cleaning for delicate fabrics.',
    icon: 'sparkles-outline', // TODO: replace with custom "dry-cleaning" SVG icon
    price: 2.5,
    priceType: 'item',
    badge: 'Premium',
    color: Colors.primary,
  },
  {
    id: 'ironing',
    title: 'Ironing',
    description: 'Freshly pressed and wrinkle-free.',
    icon: 'flame-outline', // TODO: replace with custom "ironing" SVG icon
    price: 1.0,
    priceType: 'item',
    color: Colors.primary,
  },
  {
    id: 'express',
    title: 'Express Service',
    description: 'Same-day turnaround for urgent orders.',
    icon: 'flash-outline', // TODO: replace with custom "express" SVG icon
    price: 1.0,
    priceType: 'fixed',
    badge: 'Fastest',
    color: Colors.primary,
  },
];
