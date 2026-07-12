import { useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OrderSummaryCard } from '@/src/components/order';
import { Chip, EmptyState } from '@/src/components/ui';
import { mockOrders, type OrderStatus } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';

const STATUS_TABS: { id: OrderStatus; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<OrderStatus>('active');

  const visibleOrders = useMemo(
    () => mockOrders.filter((order) => order.status === activeTab),
    [activeTab]
  );

  const activeTabLabel = STATUS_TABS.find((tab) => tab.id === activeTab)?.label ?? '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>Track and manage your laundry orders.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabRow}>
          {STATUS_TABS.map((tab) => (
            <Chip
              key={tab.id}
              label={tab.label}
              selected={activeTab === tab.id}
              onPress={() => setActiveTab(tab.id)}
              accessibilityHint={`Shows ${tab.label.toLowerCase()} orders`}
            />
          ))}
        </View>

        <View style={styles.list}>
          {visibleOrders.length === 0 ? (
            <EmptyState
              title={`No ${activeTabLabel.toLowerCase()} orders`}
              description="Orders will show up here once you have some."
            />
          ) : (
            visibleOrders.map((order) => (
              <OrderSummaryCard
                key={order.id}
                order={order}
                onTrackPress={
                  order.status === 'active'
                    ? () =>
                        router.push({
                          pathname: '/tracking',
                          params: { orderId: order.id },
                        } as unknown as Href)
                    : undefined
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
    },
    title: {
      fontSize: Typography.headline.fontSize,
      lineHeight: Typography.headline.lineHeight,
      fontWeight: Typography.headline.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xxs,
    },
    subtitle: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
    },
    content: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
    tabRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    list: {
      gap: Spacing.lg,
    },
  });
