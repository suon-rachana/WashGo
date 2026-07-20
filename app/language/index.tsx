import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SelectableOption } from '@/src/components/common';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { useSettingsStore, type Language } from '@/src/store/settingsStore';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

// Each language's own name is shown in its own script regardless of the active
// app locale (standard language-picker convention) — not run through t().
const LANGUAGE_OPTIONS: { id: Language; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'km', label: 'Khmer / ភាសាខ្មែរ' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{t('language')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.optionList}>
          {LANGUAGE_OPTIONS.map((option) => (
            <SelectableOption
              key={option.id}
              title={option.label}
              selected={language === option.id}
              onPress={() => setLanguage(option.id)}
              accessibilityLabel={`Select ${option.label}`}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.md,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: Spacing.sm,
      marginLeft: -Spacing.xxs,
    },
    title: {
      fontSize: Typography.headline.fontSize,
      lineHeight: Typography.headline.lineHeight,
      fontWeight: Typography.headline.fontWeight,
      color: colors.text,
    },
    content: {
      paddingHorizontal: Spacing.xl,
    },
    optionList: {
      gap: Spacing.md,
    },
  });
