import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

export interface LoadingStateProps {
  message?: string;
}

// Reusable inline loading indicator for screens/sections waiting on a
// backend call (profile, addresses, ...). Not a full-screen splash — pair
// with a container that already owns the screen's SafeAreaView/background.
export function LoadingState({ message }: LoadingStateProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.xxl,
      paddingHorizontal: Spacing.xl,
    },
    message: {
      marginTop: Spacing.md,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
