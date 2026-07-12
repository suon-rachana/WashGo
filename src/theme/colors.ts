/**
 * WashGo color tokens.
 * Single source of truth for every color used in the app — never hardcode a hex value elsewhere.
 */

export type ThemeMode = 'light' | 'dark';

export const Palette = {
  primary: '#3A4EFB',
  secondary: '#33A4FA',
  accent: '#E3FF3B',
  // Darkened accent for pressed states — accent itself is too light to dim via opacity alone.
  accentPressed: '#C8E034',
  dark: '#252943',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  // One step above `card` — used for modals, pressed/selected fills, and other
  // content that needs to read as "on top of" a regular card.
  elevatedSurface: '#F1F5F9',
  inputBackground: '#FFFFFF',
  border: '#E8EAF3',
  mutedText: '#6B7280',
  secondaryText: '#475569',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#FFFFFF',
} as const;

export const Colors = {
  primary: Palette.primary,
  secondary: Palette.secondary,
  accent: Palette.accent,
  accentPressed: Palette.accentPressed,

  background: Palette.background,
  surface: Palette.surface,
  card: Palette.card,
  elevatedSurface: Palette.elevatedSurface,
  inputBackground: Palette.inputBackground,
  border: Palette.border,

  text: Palette.dark,
  textSecondary: Palette.secondaryText,
  textMuted: Palette.mutedText,

  success: Palette.success,
  warning: Palette.warning,
  danger: Palette.danger,

  // Text/icon color to use on top of a filled color surface (e.g. label inside a primary button).
  onPrimary: Palette.white,
  onSecondary: Palette.white,
  onAccent: Palette.dark,
  onSuccess: Palette.white,
  onWarning: Palette.white,
  onDanger: Palette.white,
  onDark: Palette.white,
} as const;

// Premium dark palette — deliberately not pure black, keeps the brand colors intact.
export const DarkPalette = {
  primary: '#3A4EFB',
  secondary: '#33A4FA',
  accent: '#E3FF3B',
  accentPressed: '#C8E034',
  dark: '#0F172A',
  background: '#0F172A',
  surface: '#111827',
  card: '#1E293B',
  elevatedSurface: '#263548',
  inputBackground: '#233247',
  border: '#334155',
  mutedText: '#64748B',
  secondaryText: '#94A3B8',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#F8FAFC',
} as const;

export const DarkColors = {
  primary: DarkPalette.primary,
  secondary: DarkPalette.secondary,
  accent: DarkPalette.accent,
  accentPressed: DarkPalette.accentPressed,

  background: DarkPalette.background,
  surface: DarkPalette.surface,
  card: DarkPalette.card,
  elevatedSurface: DarkPalette.elevatedSurface,
  inputBackground: DarkPalette.inputBackground,
  border: DarkPalette.border,

  text: DarkPalette.white,
  textSecondary: DarkPalette.secondaryText,
  textMuted: DarkPalette.mutedText,

  success: DarkPalette.success,
  warning: DarkPalette.warning,
  danger: DarkPalette.danger,

  onPrimary: Palette.white,
  onSecondary: Palette.white,
  onAccent: DarkPalette.dark,
  onSuccess: Palette.white,
  onWarning: Palette.white,
  onDanger: Palette.white,
  onDark: Palette.white,
} as const;

export type ColorToken = keyof typeof Colors;

// Structural (not literal) type so both the light and dark token sets satisfy
// it despite having different hex values for the same keys.
export type ColorScheme = Record<ColorToken, string>;

// Single source of truth for resolving a theme mode to its color tokens —
// every screen/component that needs theme-aware colors goes through this.
export function getColors(themeMode: ThemeMode): ColorScheme {
  return themeMode === 'dark' ? DarkColors : Colors;
}
