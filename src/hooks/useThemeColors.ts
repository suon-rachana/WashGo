import { useMemo } from 'react';

import { useSettingsStore } from '@/src/store/settingsStore';
import { getColors, type ColorScheme } from '@/src/theme';

// Reads the current theme mode from the settings store and resolves it to
// its color tokens, so components re-render with the right palette whenever
// the user switches Light/Dark mode in Settings.
export function useThemeColors(): ColorScheme {
  const themeMode = useSettingsStore((state) => state.themeMode);
  return useMemo(() => getColors(themeMode), [themeMode]);
}
