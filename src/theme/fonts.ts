import type { Language } from '@/src/store/settingsStore';

/**
 * Font-family resolution for WashGo's two supported locales.
 *
 * English keeps using the platform's default system font (San Francisco on
 * iOS, Roboto on Android) — it is never overridden, so English screens look
 * exactly as they did before Khmer support was added.
 *
 * Khmer uses static Noto Sans Khmer weights (regular/medium/semibold/bold),
 * loaded once via expo-font in app/_layout.tsx (see NOTO_SANS_KHMER_FONTS
 * below) and referenced everywhere else purely by family-name string.
 */

export type FontWeightKey = 'regular' | 'medium' | 'semibold' | 'bold';

export const LatinFontFamily: Record<FontWeightKey, string | undefined> = {
  regular: undefined,
  medium: undefined,
  semibold: undefined,
  bold: undefined,
};

export const KhmerFontFamily: Record<FontWeightKey, string> = {
  regular: 'NotoSansKhmer-Regular',
  medium: 'NotoSansKhmer-Medium',
  semibold: 'NotoSansKhmer-SemiBold',
  bold: 'NotoSansKhmer-Bold',
};

// Passed directly to expo-font's useFonts() — the single place the static
// Noto Sans Khmer font files are read from disk. Family-name keys must match
// KhmerFontFamily's values exactly.
export const NOTO_SANS_KHMER_FONTS: Record<string, number> = {
  [KhmerFontFamily.regular]: require('../../assets/fonts/NotoSansKhmer-Regular.ttf'),
  [KhmerFontFamily.medium]: require('../../assets/fonts/NotoSansKhmer-Medium.ttf'),
  [KhmerFontFamily.semibold]: require('../../assets/fonts/NotoSansKhmer-SemiBold.ttf'),
  [KhmerFontFamily.bold]: require('../../assets/fonts/NotoSansKhmer-Bold.ttf'),
};

// The one place "which font family for this language + weight" is decided —
// every component should call this (directly or via useTypography()) rather
// than branching on language itself.
export function getFontFamily(language: Language, weight: FontWeightKey): string | undefined {
  return language === 'km' ? KhmerFontFamily[weight] : LatinFontFamily[weight];
}
