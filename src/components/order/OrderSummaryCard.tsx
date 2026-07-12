import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, type BadgeVariant } from '@/src/components/ui';
import { laundries } from '@/src/data/mock/laundries';
import { getOrderStatusLabel } from '@/src/data/mock/order';
import type { OrderSummary } from '@/src/data/mock/orders';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

export interface OrderSummaryCardProps {
  order: OrderSummary;
  onTrackPress?: () => void;
}

const STATUS_BADGE_VARIANT: Record<OrderSummary['status'], BadgeVariant> = {
  active: 'primary',
  completed: 'success',
  cancelled: 'neutral',
};

function formatOrderDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function OrderSummaryCard({ order, onTrackPress }: OrderSummaryCardProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const laundry = laundries.find((item) => item.id === order.laundryId);
  const statusLabel = getOrderStatusLabel(order.status, order.currentStepId);

  return (
    <Card variant="elevated">
      <View style={styles.header}>
        <Text style={styles.laundryName} numberOfLines={1}>
          {laundry?.name ?? 'Unknown laundry'}
        </Text>
        <Badge label={statusLabel} variant={STATUS_BADGE_VARIANT[order.status]} />
      </View>

      <Text style={styles.orderId}>{order.id}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{formatOrderDate(order.createdAt)}</Text>
        <Text style={styles.total}>${order.total.toFixed(2)}</Text>
      </View>

      {order.status === 'active' && onTrackPress ? (
        <Button
          title="Track"
          fullWidth
          onPress={onTrackPress}
          accessibilityLabel={`Track order ${order.id}`}
          accessibilityHint="Navigates to order tracking"
          style={styles.trackButton}
        />
      ) : null}
    </Card>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: Spacing.sm,
      marginBottom: Spacing.xxs,
    },
    laundryName: {
      flex: 1,
      fontSize: Typography.subtitle.fontSize,
      lineHeight: Typography.subtitle.lineHeight,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.text,
    },
    orderId: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
      marginBottom: Spacing.sm,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    metaText: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
    },
    total: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.primary,
    },
    trackButton: {
      marginTop: Spacing.md,
    },
  });
