import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { useTranslation } from '@/src/i18n';
import type { Coordinates } from '@/src/utils/coordinates';

interface UseCurrentLocationOptions {
  onLocated: (coordinates: Coordinates) => void;
}

/**
 * Shared foreground-location flow for both the real MapView and the mock
 * fallback canvas — permission is requested only on demand (button tap),
 * never on mount, and never upgraded to background tracking.
 */
export function useCurrentLocation({ onLocated }: UseCurrentLocationOptions) {
  const { t } = useTranslation();
  const [isLocating, setIsLocating] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );

  const requestCurrentLocation = useCallback(async () => {
    if (isLocating) return;
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('locationPermissionRequired'), t('locationPermissionMessage'));
        return;
      }
      if (isMountedRef.current) setHasPermission(true);

      const position = await Location.getCurrentPositionAsync({});
      if (!isMountedRef.current) return;
      onLocated({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    } catch {
      if (isMountedRef.current) {
        Alert.alert(t('locationPermissionRequired'), t('unableToGetCurrentLocation'));
      }
    } finally {
      if (isMountedRef.current) setIsLocating(false);
    }
  }, [isLocating, onLocated, t]);

  return { isLocating, hasPermission, requestCurrentLocation };
}
