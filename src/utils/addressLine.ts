// Supabase stores one free-text `address_line` per address, while the
// existing AddressForm collects street/city/province separately (unchanged
// per the "don't redesign the screen" constraint) — this is the join point
// between the two shapes.
export function combineAddressLine(street: string, city: string, province: string): string {
  return [street, city, province].filter(Boolean).join(', ');
}
