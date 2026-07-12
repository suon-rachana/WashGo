/**
 * WashGo spacing scale.
 * Every margin, padding, and gap must come from this scale.
 */

export const Spacing = {
  none: 0,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  xxxxl: 48,
  huge: 64,
} as const;

export type SpacingToken = keyof typeof Spacing;
