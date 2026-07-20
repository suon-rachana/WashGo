import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  actionLabel?: string;
  onActionPress?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = 'search-outline',
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={26} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onActionPress ? (
        <Button title={actionLabel} variant="accent" onPress={onActionPress} style={styles.action} />
      ) : null}
    </View>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: Spacing.xxl,
      paddingHorizontal: Spacing.xl,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: Radius.circle,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.md,
    },
    title: {
      fontSize: Typography.subtitle.fontSize,
      lineHeight: Typography.subtitle.lineHeight,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xxs,
      textAlign: 'center',
    },
    description: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
      textAlign: 'center',
    },
    action: {
      marginTop: Spacing.lg,
    },
  });
