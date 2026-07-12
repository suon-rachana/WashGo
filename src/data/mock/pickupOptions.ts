export interface PickupSizeOption {
  id: string;
  label: string;
  detail: string;
}

export interface PickupDateOption {
  id: string;
  label: string;
}

export interface PickupTimeOption {
  id: string;
  label: string;
  detail: string;
}

// Shared between app/pickup (selection) and app/summary (readback of the selected id).
export const sizeOptions: PickupSizeOption[] = [
  { id: 'small', label: 'Small', detail: '1–3 kg' },
  { id: 'medium', label: 'Medium', detail: '4–7 kg' },
  { id: 'large', label: 'Large', detail: '8–12 kg' },
  { id: 'extra-large', label: 'Extra Large', detail: '12+ kg' },
];

export const dateOptions: PickupDateOption[] = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
];

export const timeOptions: PickupTimeOption[] = [
  { id: 'morning', label: 'Morning', detail: '8:00 AM – 11:00 AM' },
  { id: 'afternoon', label: 'Afternoon', detail: '1:00 PM – 4:00 PM' },
  { id: 'evening', label: 'Evening', detail: '5:00 PM – 8:00 PM' },
];
