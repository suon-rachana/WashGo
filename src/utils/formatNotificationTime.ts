import type { TranslationKey, TranslationParams } from '@/src/i18n';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Buckets a notification's ISO timestamp into a friendly relative label. Always
// diffs against the real current time (never a fixed "now"), so the output stays
// correct no matter when the app is actually run — a negative/near-zero diff
// (clock skew, or a mock date that hasn't arrived yet) safely falls into "Just now"
// rather than showing a negative duration.
export function formatNotificationTime(
  iso: string,
  t: (key: TranslationKey, params?: TranslationParams) => string
): string {
  const createdDate = new Date(iso);
  const diffMs = Date.now() - createdDate.getTime();

  if (diffMs < MINUTE) return t('justNow');
  if (diffMs < HOUR) return t('minutesAgo', { count: Math.floor(diffMs / MINUTE) });
  if (diffMs < DAY) return t('hoursAgo', { count: Math.floor(diffMs / HOUR) });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameCalendarDay(createdDate, yesterday)) return t('yesterday');

  // Absolute fallback always renders in Latin/English form (e.g. "Jul 18"),
  // matching the existing precedent in OrderSummaryCard's formatOrderDate.
  return createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
