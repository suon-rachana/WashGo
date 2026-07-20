import { useCallback } from 'react';

import { useSettingsStore } from '@/src/store/settingsStore';
import { translations, type TranslationKey } from './translations';

export type TranslationParams = Record<string, string | number>;

// Future: add a Khmer font such as Hanuman or Battambang — falls back to the
// system font for now since none is bundled yet.
export function useTranslation() {
  const language = useSettingsStore((state) => state.language);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => {
      const template = translations[language][key];
      if (!params) return template;
      // `{{paramName}}` interpolation — the only convention notification
      // messages (and any future parameterized copy) need to support.
      return Object.entries(params).reduce(
        (result, [paramKey, value]) => result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value)),
        template
      );
    },
    [language]
  );

  return { t, language };
}
