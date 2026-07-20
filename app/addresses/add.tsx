import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddressForm, type AddressFormValues } from '@/src/components/profile';
import { isSupabaseDataSource } from '@/src/config/dataSource';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { addressService } from '@/src/services/addressService';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import { combineAddressLine } from '@/src/utils/addressLine';

export default function AddAddressScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (values: AddressFormValues) => {
    if (!isSupabaseDataSource) {
      // Mock only — nothing to persist to. Log so the submitted values are
      // visible during development, then return to the address list.
      console.log('Address saved (mock):', values);
      router.back();
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    const { error } = await addressService.add({
      label: values.label,
      address_line: combineAddressLine(values.street, values.city, values.province),
      delivery_instructions: values.notes || null,
    });
    setIsSaving(false);

    if (error) {
      setErrorMessage(error === 'not_authenticated' ? t('sessionExpired') : t('unableToAddAddress'));
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Add Address</Text>
        <Text style={styles.subtitle}>Save a new pickup or delivery location.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {errorMessage ? (
          <Text style={styles.errorText} accessibilityLiveRegion="polite">
            {errorMessage}
          </Text>
        ) : null}
        <AddressForm submitLabel="Save Address" onSubmit={handleSave} loading={isSaving} />
      </ScrollView>
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
      marginBottom: Spacing.xxs,
    },
    subtitle: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
    content: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
    errorText: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.danger,
      marginBottom: Spacing.md,
    },
  });
