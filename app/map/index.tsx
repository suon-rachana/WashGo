import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Region } from 'react-native-maps';

import { Button, Card } from '@/src/components/ui';
import { LocationMap, MapErrorBoundary, MockMapCanvas } from '@/src/components/map';
import { mapLocationAddress } from '@/src/data/mock';
import { useCurrentLocation } from '@/src/hooks/useCurrentLocation';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';
import { formatCoordinates, type Coordinates } from '@/src/utils/coordinates';

// Default pickup coordinates for Siem Reap, Cambodia — used as the initial
// map center and as the fallback selection if the user never moves the map.
const INITIAL_COORDINATES: Coordinates = {
  latitude: 13.3671,
  longitude: 103.8448,
};
const REGION_DELTA = 0.015;
const INITIAL_REGION: Region = {
  ...INITIAL_COORDINATES,
  latitudeDelta: REGION_DELTA,
  longitudeDelta: REGION_DELTA,
};

export default function ChooseLocationScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();
  const { laundryId, serviceIds } = useLocalSearchParams<{ laundryId?: string; serviceIds?: string }>();

  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates>(INITIAL_COORDINATES);

  const handleCoordinatesChange = useCallback((coordinates: Coordinates) => {
    setSelectedCoordinates(coordinates);
  }, []);

  // Only used by MapErrorBoundary's fallback below, for the rare case the
  // real MapView fails to render on a native platform (web already renders
  // the mock canvas on its own — see LocationMap.web.tsx). The real
  // LocationMap owns its own current-location flow so it can animate the
  // camera internally.
  const { isLocating: isFallbackLocating, requestCurrentLocation: requestFallbackLocation } = useCurrentLocation({
    onLocated: handleCoordinatesChange,
  });

  const handleConfirm = () => {
    // `/pickup` is an index route; see the Href-cast note in app/(tabs)/home.tsx —
    // the local typed-routes generator doesn't collapse index files to their parent path.
    router.replace({
      pathname: '/pickup',
      params: {
        ...(laundryId ? { laundryId } : {}),
        ...(serviceIds ? { serviceIds } : {}),
        selectedLocation: mapLocationAddress.id,
        latitude: String(selectedCoordinates.latitude),
        longitude: String(selectedCoordinates.longitude),
      },
    } as unknown as Href);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to pickup details"
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{t('chooseLocation')}</Text>
        <Text style={styles.subtitle}>{t('moveMapToSelectPickupPoint')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MapErrorBoundary
          fallback={<MockMapCanvas onCurrentLocationPress={requestFallbackLocation} isLocating={isFallbackLocating} />}
        >
          <LocationMap initialRegion={INITIAL_REGION} onCoordinatesChange={handleCoordinatesChange} />
        </MapErrorBoundary>

        <Card variant="outlined" style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.previewIcon}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.previewTextWrap}>
              <Text style={styles.previewTitle}>{t('selectedLocation')}</Text>
              <Text style={styles.previewSubtitle}>{mapLocationAddress.detail}</Text>
            </View>
          </View>

          <View style={styles.coordRow}>
            <Text style={styles.coordLabel}>{t('selectedCoordinates')}</Text>
            <Text style={styles.coordValue}>{formatCoordinates(selectedCoordinates)}</Text>
          </View>
          {/* Future: use reverse geocoding to display the selected street address. */}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('confirmLocation')}
          fullWidth
          onPress={handleConfirm}
          accessibilityHint="Returns to pickup details with this location selected"
        />
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
      minWidth: 44,
      minHeight: 44,
      alignItems: 'flex-start',
      justifyContent: 'center',
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
    previewCard: {
      marginBottom: Spacing.xl,
    },
    previewHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
    },
    previewIcon: {
      width: 36,
      height: 36,
      borderRadius: Radius.circle,
      backgroundColor: `${colors.primary}1A`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    previewTextWrap: {
      flex: 1,
    },
    previewTitle: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xxs,
    },
    previewSubtitle: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
    },
    coordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    coordLabel: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
    },
    coordValue: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
    },
    footer: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
  });
