export interface Promotion {
  id: string;
  title: string;
  ctaLabel: string;
  discountPercent: number;
}

export const promotions: Promotion[] = [
  { id: 'promo-first-order', title: '20% OFF your first order', ctaLabel: 'Book now', discountPercent: 20 },
];
