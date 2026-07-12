import React from 'react';
import {
  AccessibilityState,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Radius, Shadows, Spacing } from '@/src/theme';

export type CardVariant = 'elevated' | 'outlined' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  // Only meaningful when `onPress` is set — describes the pressable card for
  // screen readers (e.g. a selectable row's "selected" state).
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
}

const variantStyle = (colors: ColorScheme): Record<CardVariant, ViewStyle> => ({
  elevated: { backgroundColor: colors.card, ...Shadows.md },
  outlined: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  flat: { backgroundColor: colors.card },
});

const PADDING_STYLE: Record<CardPadding, number> = {
  none: Spacing.none,
  sm: Spacing.md,
  md: Spacing.xl,
  lg: Spacing.xxl,
};

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  disabled = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
}: CardProps) {
  const colors = useThemeColors();
  const cardStyle = [
    styles.base,
    variantStyle(colors)[variant],
    { padding: PADDING_STYLE[padding] },
    disabled && styles.disabled,
    style,
  ];

  if (!onPress) {
    return (
      <View testID={testID} style={cardStyle}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, ...accessibilityState }}
      style={({ pressed }) => [...cardStyle, pressed && !disabled && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
});
