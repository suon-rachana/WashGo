import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddressForm, type AddressFormValues } from '@/src/components/profile';
import { ErrorState, LoadingState } from '@/src/components/ui';
import { isSupabaseDataSource } from '@/src/config/dataSource';
import { addresses as mockAddresses } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { addressService } from '@/src/services/addressService';
import type { ServiceErrorCode } from '@/src/services/errors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import type { AddressRow } from '@/src/types/database';
import { combineAddressLine } from '@/src/utils/addressLine';

export default function EditAddressScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id?: string }>();

  const mockAddress = isSupabaseDataSource ? undefined : mockAddresses.find((item) => item.id === id);
  const [supabaseAddress, setSupabaseAddress] = useState<AddressRow | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseDataSource);
  const [loadError, setLoadError] = useState<ServiceErrorCode | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseDataSource || !id) return;

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    addressService.get(id).then(({ data, error }) => {
      if (cancelled) return;
      setIsLoading(false);
      if (error) {
        setLoadError(error);
        return;
      }
      setSupabaseAddress(data);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = async (values: AddressFormValues) => {
    if (!isSupabaseDataSource) {
      // Mock only — nothing to persist to. Log so the submitted values are
      // visible during development, then return to the address list.
      console.log(`Address ${id} updated (mock):`, values);
      router.back();
      return;
    }

    if (!id) return;
    setIsSaving(true);
    setSaveErrorMessage(null);
    const { error } = await addressService.update(id, {
      label: values.label,
      address_line: combineAddressLine(values.street, values.city, values.province),
      delivery_instructions: values.notes || null,
    });
    setIsSaving(false);

    if (error) {
      setSaveErrorMessage(error === 'not_authenticated' ? t('sessionExpired') : t('unableToUpdateAddress'));
      return;
    }
    router.back();
  };

  const notFound = isSupabaseDataSource ? !isLoading && !loadError && !supabaseAddress : !mockAddress;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Edit Address</Text>
        {!notFound ? <Text style={styles.subtitle}>Update this pickup or delivery location.</Text> : null}
      </View>

      {isSupabaseDataSource && isLoading ? (
        <LoadingState message={t('loadingAccount')} />
      ) : isSupabaseDataSource && loadError ? (
        <ErrorState
          message={loadError === 'not_authenticated' ? t('sessionExpired') : t('unableToLoadAddresses')}
          retryLabel={t('retry')}
          onRetry={() => router.replace({ pathname: '/addresses/edit', params: { id } })}
        />
      ) : notFound ? (
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>This address could not be found.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {saveErrorMessage ? (
            <Text style={styles.errorText} accessibilityLiveRegion="polite">
              {saveErrorMessage}
            </Text>
          ) : null}
          <AddressForm
            initialValues={
              isSupabaseDataSource && supabaseAddress
                ? {
                    label: supabaseAddress.label,
                    street: supabaseAddress.address_line,
                    city: '',
                    province: '',
                    notes: supabaseAddress.delivery_instructions ?? '',
                  }
                : mockAddress
                  ? {
                      label: mockAddress.label,
                      street: mockAddress.street,
                      city: mockAddress.city,
                      province: mockAddress.province,
                      notes: mockAddress.notes,
                    }
                  : undefined
            }
            submitLabel="Save Changes"
            onSubmit={handleSave}
            loading={isSaving}
          />
        </ScrollView>
      )}
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
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
    },
    notFoundText: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
