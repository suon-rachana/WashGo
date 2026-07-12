import { useCallback } from 'react';

import { useSettingsStore } from '@/src/store/settingsStore';
import { translations, type TranslationKey } from './translations';

// Future: add a Khmer font such as Hanuman or Battambang — falls back to the
// system font for now since none is bundled yet.
export function useTranslation() {
  const language = useSettingsStore((state) => state.language);

  const t = useCallback((key: TranslationKey) => translations[language][key], [language]);

  return { t, language };
}
