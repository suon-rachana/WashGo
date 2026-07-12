import { Colors, getColors, type ColorScheme, type ThemeMode } from './colors';
import { Radius } from './radius';
import { Shadows } from './shadows';
import { Spacing } from './spacing';
import { FontWeight, Typography } from './typography';

/**
 * WashGo global theme object — every design token combined in one place.
 */

export interface AppTheme {
  colors: ColorScheme;
  spacing: typeof Spacing;
  radius: typeof Radius;
  typography: typeof Typography;
  fontWeight: typeof FontWeight;
  shadows: typeof Shadows;
}

export const Theme: AppTheme = {
  colors: Colors,
  spacing: Spacing,
  radius: Radius,
  typography: Typography,
  fontWeight: FontWeight,
  shadows: Shadows,
};

export function getTheme(themeMode: ThemeMode): AppTheme {
  return {
    colors: getColors(themeMode),
    spacing: Spacing,
    radius: Radius,
    typography: Typography,
    fontWeight: FontWeight,
    shadows: Shadows,
  };
}
