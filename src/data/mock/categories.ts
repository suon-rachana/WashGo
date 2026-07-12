import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export interface Category {
  id: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: 'primary' | 'accent';
}

export const categories: Category[] = [
  { id: 'wash-fold', label: 'Wash & Fold', icon: 'shirt-outline', color: 'primary' },
  { id: 'dry-cleaning', label: 'Dry Cleaning', icon: 'sparkles-outline', color: 'primary' },
  { id: 'ironing', label: 'Ironing', icon: 'flame-outline', color: 'primary' },
  { id: 'express', label: 'Express', icon: 'flash-outline', color: 'primary' },
];
