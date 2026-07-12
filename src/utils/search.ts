export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

/**
 * Case-insensitive, whitespace-trimmed substring match across any number of fields.
 * An empty query always matches (i.e. "no filter applied").
 */
export function matchesSearch(query: string, fields: (string | null | undefined)[]): boolean {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return true;
  return fields.some((field) => field?.toLowerCase().includes(normalizedQuery));
}
