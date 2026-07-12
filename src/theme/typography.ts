import type { TextStyle } from 'react-native';

/**
 * WashGo typography tokens.
 * No custom fonts are bundled yet, so `fontFamily` stays undefined (system default).
 * Swap it once brand fonts (e.g. Poppins) are added to assets/fonts and loaded via expo-font.
 */

export const FontFamily: Record<'regular' | 'medium' | 'semibold' | 'bold', string | undefined> = {
  regular: undefined,
  medium: undefined,
  semibold: undefined,
  bold: undefined,
};

export const FontWeight: Record<'regular' | 'medium' | 'semibold' | 'bold', TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export interface TypographyVariant {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing: number;
}

type TypographyVariantKey =
  | 'display'
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyMedium'
  | 'caption'
  | 'button'
  | 'label';

export const Typography: Record<TypographyVariantKey, TypographyVariant> = {
  display: { fontSize: 34, lineHeight: 42, fontWeight: FontWeight.bold, letterSpacing: 0.25 },
  headline: { fontSize: 28, lineHeight: 36, fontWeight: FontWeight.bold, letterSpacing: 0 },
  title: { fontSize: 22, lineHeight: 30, fontWeight: FontWeight.semibold, letterSpacing: 0 },
  subtitle: { fontSize: 18, lineHeight: 26, fontWeight: FontWeight.semibold, letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: FontWeight.regular, letterSpacing: 0 },
  bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: FontWeight.medium, letterSpacing: 0 },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: FontWeight.regular, letterSpacing: 0.1 },
  button: { fontSize: 16, lineHeight: 20, fontWeight: FontWeight.semibold, letterSpacing: 0.2 },
  label: { fontSize: 12, lineHeight: 16, fontWeight: FontWeight.medium, letterSpacing: 0.4 },
};
