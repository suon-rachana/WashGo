import { create } from 'zustand';

import type { ThemeMode } from '@/src/theme';

export type Language = 'en' | 'km';

interface SettingsState {
  themeMode: ThemeMode;
  language: Language;
  setThemeMode: (themeMode: ThemeMode) => void;
  toggleThemeMode: () => void;
  setLanguage: (language: Language) => void;
}

// Global (client-only) app preferences — theme + language, controlled from the
// Settings screen. No backend; resets on app restart.
export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: 'light',
  language: 'en',
  setThemeMode: (themeMode) => set({ themeMode }),
  toggleThemeMode: () => set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
  setLanguage: (language) => set({ language }),
}));
