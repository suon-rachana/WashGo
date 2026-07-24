import { useCallback } from 'react';

import { useSettingsStore } from '@/src/store/settingsStore';
import { translations, type TranslationKey } from './translations';

export type TranslationParams = Record<string, string | number>;

// Khmer uses the bundled static Battambang weights (see src/theme/fonts.ts);
// English keeps the platform's default system font.
export function useTranslation() {
  const language = useSettingsStore((state) => state.language);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => {
      const template = translations[language][key];
      const resolved = !params
        ? template
        : // `{{paramName}}` interpolation — the only convention notification
          // messages (and any future parameterized copy) need to support.
          Object.entries(params).reduce(
            (result, [paramKey, value]) => result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value)),
            template
          );
      // Defensive normalization: Khmer relies on combining vowel/sign marks,
      // and copy-pasting translations from docs/spreadsheets can silently
      // introduce NFD (decomposed) or mixed-normalization sequences that
      // read identically but fail to shape correctly on-device. Normalizing
      // every resolved string to NFC costs nothing when the text is already
      // normalized (the common case) and guards against that whole class of
      // "one word renders as a box" bugs going forward.
      return resolved.normalize('NFC');
    },
    [language]
  );

  return { t, language };
}
