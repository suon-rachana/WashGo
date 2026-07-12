export interface Coordinates {
  latitude: number;
  longitude: number;
}

const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

/**
 * Parses a route-param string (or undefined/malformed value) into a finite
 * number within valid coordinate bounds, or null if it can't be trusted.
 */
export function parseCoordinateParam(value: string | undefined, bounds: [number, number]): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const [min, max] = bounds;
  if (parsed < min || parsed > max) return null;
  return parsed;
}

export function parseLatitudeParam(value: string | undefined): number | null {
  return parseCoordinateParam(value, [MIN_LATITUDE, MAX_LATITUDE]);
}

export function parseLongitudeParam(value: string | undefined): number | null {
  return parseCoordinateParam(value, [MIN_LONGITUDE, MAX_LONGITUDE]);
}

export function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

export function formatCoordinates(coordinates: Coordinates): string {
  return `${formatCoordinate(coordinates.latitude)}, ${formatCoordinate(coordinates.longitude)}`;
}
