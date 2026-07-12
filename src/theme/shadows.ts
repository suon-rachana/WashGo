import type { ViewStyle } from 'react-native';

import { Colors } from './colors';

/**
 * WashGo elevation presets. No custom shadows should be created outside this file.
 */

const shadow = (offsetY: number, opacity: number, radius: number, elevation: number): ViewStyle => ({
  shadowColor: Colors.text,
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const Shadows = {
  none: {} as ViewStyle,
  sm: shadow(1, 0.06, 2, 2),
  md: shadow(4, 0.08, 8, 4),
  lg: shadow(8, 0.12, 16, 8),
} as const;

export type ShadowToken = keyof typeof Shadows;
