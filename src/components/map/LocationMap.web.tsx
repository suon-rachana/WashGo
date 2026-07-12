import { useCurrentLocation } from '@/src/hooks/useCurrentLocation';
import type { Coordinates } from '@/src/utils/coordinates';

import { MockMapCanvas } from './MockMapCanvas';

interface LocationMapProps {
  initialRegion: Coordinates & { latitudeDelta: number; longitudeDelta: number };
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

// react-native-maps has no functional web implementation, and importing it
// (even unused) pulls in native-only RN internals that fail Metro's web
// bundle. This platform-specific file replaces LocationMap.tsx on web
// builds — see AGENTS.md's RN platform-extension convention — so the mock
// canvas is what actually ships there, without ever touching that import.
export function LocationMap({ onCoordinatesChange }: LocationMapProps) {
  const { isLocating, requestCurrentLocation } = useCurrentLocation({ onLocated: onCoordinatesChange });

  return <MockMapCanvas onCurrentLocationPress={requestCurrentLocation} isLocating={isLocating} />;
}
