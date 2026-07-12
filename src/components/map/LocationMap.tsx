import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';

import { useCurrentLocation } from '@/src/hooks/useCurrentLocation';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { useSettingsStore } from '@/src/store/settingsStore';
import { ColorScheme, Radius, Shadows, Spacing } from '@/src/theme';
import { DarkMapStyle } from '@/src/theme/mapStyles';
import type { Coordinates } from '@/src/utils/coordinates';

const REGION_DELTA = 0.015;
const ANIMATE_DURATION_MS = 500;

interface LocationMapProps {
  initialRegion: Region;
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

/**
 * Real interactive map: the map pans/zooms underneath a fixed center pin
 * rather than using a draggable marker. Selected coordinates update once
 * movement settles (onRegionChangeComplete), not on every frame.
 */
export function LocationMap({ initialRegion, onCoordinatesChange }: LocationMapProps) {
  const colors = useThemeColors();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const { t } = useTranslation();
  const styles = createStyles(colors);
  const mapRef = useRef<MapView>(null);

  const handleLocated = useCallback(
    (coordinates: Coordinates) => {
      onCoordinatesChange(coordinates);
      mapRef.current?.animateToRegion(
        { ...coordinates, latitudeDelta: REGION_DELTA, longitudeDelta: REGION_DELTA },
        ANIMATE_DURATION_MS
      );
    },
    [onCoordinatesChange]
  );

  const { isLocating, hasPermission, requestCurrentLocation } = useCurrentLocation({ onLocated: handleLocated });

  const handleRegionChangeComplete = useCallback(
    (region: Region) => {
      onCoordinatesChange({ latitude: region.latitude, longitude: region.longitude });
    },
    [onCoordinatesChange]
  );

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={hasPermission}
        showsMyLocationButton={false}
        showsCompass
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        customMapStyle={themeMode === 'dark' ? DarkMapStyle : undefined}
        accessible
        accessibilityLabel={t('chooseLocation')}
        accessibilityHint={t('moveMapToSelectPickupPoint')}
      />

      <View pointerEvents="none" style={styles.centerPinContainer}>
        <View style={styles.pinMarker}>
          <View style={styles.pinHalo} />
          <Ionicons name="location" size={40} color={colors.primary} />
        </View>
      </View>

      <Pressable
        onPress={requestCurrentLocation}
        disabled={isLocating}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t('currentLocation')}
        accessibilityHint={t('locatingYou')}
        accessibilityState={{ disabled: isLocating, busy: isLocating }}
        style={styles.currentLocationButton}
      >
        {isLocating ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="locate" size={20} color={colors.primary} />
        )}
      </Pressable>
    </View>
  );
}

const MAP_HEIGHT = 300;

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    mapContainer: {
      height: MAP_HEIGHT,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      marginBottom: Spacing.xl,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    centerPinContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pinMarker: {
      width: 64,
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      // Offset upward so the pin's visual tip (not its center) marks the
      // selected coordinate — matches how the icon's anchor sits in its box.
      marginBottom: 20,
    },
    pinHalo: {
      position: 'absolute',
      width: 64,
      height: 64,
      borderRadius: Radius.circle,
      backgroundColor: `${colors.primary}1A`,
    },
    currentLocationButton: {
      position: 'absolute',
      bottom: Spacing.md,
      right: Spacing.md,
      width: 40,
      height: 40,
      borderRadius: Radius.circle,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.sm,
    },
  });
