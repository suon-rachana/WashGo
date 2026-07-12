import type { Service } from '@/src/types/service';

export function formatServicePrice(service: Pick<Service, 'price' | 'priceType'>): string {
  const amount = `$${service.price.toFixed(2)}`;

  switch (service.priceType) {
    case 'kg':
      return `From ${amount} / kg`;
    case 'item':
      return `From ${amount} / item`;
    case 'fixed':
      return `Flat ${amount}`;
    default:
      return amount;
  }
}
