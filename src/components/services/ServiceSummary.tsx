import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/src/components/ui';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import type { Service } from '@/src/types/service';
import { formatServicePrice } from '@/src/utils/formatServicePrice';

export interface ServiceSummaryProps {
  selectedServices: Service[];
}

export function ServiceSummary({ selectedServices }: ServiceSummaryProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (selectedServices.length === 0) {
    return (
      <Card variant="outlined" padding="lg">
        <Text style={styles.emptyText}>Select at least one service to continue.</Text>
      </Card>
    );
  }

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);

  return (
    <Card variant="outlined" padding="lg">
      <Text style={styles.summaryTitle}>Selected Services</Text>

      <View style={styles.list}>
        {selectedServices.map((service) => (
          <View key={service.id} style={styles.row}>
            <Text style={styles.rowLabel} numberOfLines={1}>
              {service.title}
            </Text>
            <Text style={styles.rowValue}>{formatServicePrice(service)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Estimated Total</Text>
        <Text style={styles.totalValue}>From ${total.toFixed(2)}</Text>
      </View>
    </Card>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    emptyText: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
      textAlign: 'center',
    },
    summaryTitle: {
      fontSize: Typography.subtitle.fontSize,
      lineHeight: Typography.subtitle.lineHeight,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    list: {
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    rowLabel: {
      flex: 1,
      fontSize: Typography.body.fontSize,
      color: colors.text,
    },
    rowValue: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalLabel: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
    },
    totalValue: {
      fontSize: Typography.subtitle.fontSize,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.primary,
    },
  });
