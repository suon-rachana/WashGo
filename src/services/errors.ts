// Shared normalized error vocabulary for the service layer. Like
// AuthErrorCode in authService, these map 1:1 to i18n keys — services never
// return raw Supabase/Postgres error text to the UI.
export type ServiceErrorCode = 'not_configured' | 'not_authenticated' | 'not_found' | 'network_error' | 'unknown';

export function normalizeServiceError(error: unknown): ServiceErrorCode {
  if (!error) return 'unknown';
  const err = error as { code?: string; message?: string };
  const message = err.message?.toLowerCase() ?? '';

  // PostgREST's "no rows returned" code for .single().
  if (err.code === 'PGRST116') return 'not_found';
  if (message.includes('network') || message.includes('fetch failed') || message.includes('failed to fetch')) {
    return 'network_error';
  }
  return 'unknown';
}
