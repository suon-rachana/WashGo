import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionHeader } from '@/src/components/common';
import { OrderTimeline, RiderCard } from '@/src/components/order';
import { Badge, Button, Card, Chip } from '@/src/components/ui';
import {
  activeOrders,
  addresses,
  getOrderById,
  getOrderStatusLabelKey,
  laundries,
  mockRider,
  orderSteps,
  promotions,
  services,
} from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import { estimateOrderTotal } from '@/src/utils/estimateOrderTotal';
import { resetToHome } from '@/src/utils/resetToTab';

export default function OrderTrackingScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  // Falls back to the first active mock order when no orderId is passed, so the
  // booking flow (which doesn't always thread an id through yet) still has something to show.
  const order = getOrderById(orderId) ?? activeOrders[0];

  const handleBackToHome = () => {
    // Ends the booking flow — clears the entire pushed stack (Laundry
    // Details → ... → Tracking) rather than just swapping this one screen.
    // See src/utils/resetToTab.ts for why a plain replace() isn't enough.
    resetToHome();
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>{t('orderTracking')}</Text>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t('orderNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const laundry = laundries.find((item) => item.id === order.laundryId);
  const address = addresses.find((item) => item.id === order.addressId);

  const selectedServiceIds = order.serviceIds.split(',').filter(Boolean);
  const selectedServices = services.filter((service) => selectedServiceIds.includes(service.id));

  const timelineSteps = orderSteps.map((step) => ({ id: step.id, label: t(step.labelKey) }));
  const statusLabel = t(getOrderStatusLabelKey(order.status, order.currentStepId));
  const { total: estimatedTotal } = estimateOrderTotal(selectedServices, promotions[0]);

  const handleViewFullDetails = () => {
    // `/order-details` is an index route; see the Href-cast note in app/(tabs)/home.tsx —
    // the local typed-routes generator doesn't collapse index files to their parent path.
    router.push({
      pathname: '/order-details',
      params: { orderId: order.id },
    } as unknown as Href);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{t('orderTracking')}</Text>
        <Text style={styles.subtitle}>Follow your laundry status in real time.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.orderId}>{order.id}</Text>
            <Badge label={statusLabel} variant="primary" />
          </View>
          <Text style={styles.shopName}>{laundry?.name ?? 'Unknown laundry'}</Text>
        </Card>

        <View style={styles.section}>
          <SectionHeader title="Order Timeline" />
          <Card variant="outlined">
            <OrderTimeline steps={timelineSteps} currentStepId={order.currentStepId} />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Your Rider" />
          <RiderCard
            name={mockRider.name}
            rating={mockRider.rating}
            vehicle={mockRider.vehicle}
            plate={mockRider.plate}
            onCall={() => console.log('Call rider pressed')}
            onMessage={() => console.log('Message rider pressed')}
          />
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <SectionHeader title="Order Summary" />
          <Card variant="outlined">
            <Text style={styles.previewLabel}>Selected Services</Text>
            <View style={styles.servicesRow}>
              {selectedServices.length === 0 ? (
                <Text style={styles.previewValue}>No services selected</Text>
              ) : (
                selectedServices.map((service) => <Chip key={service.id} label={service.title} />)
              )}
            </View>

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Pickup Address</Text>
              <Text style={styles.previewValue}>{address?.label ?? 'Not selected'}</Text>
            </View>

            <View style={[styles.previewRow, styles.previewRowLast]}>
              <Text style={styles.previewLabelEmphasis}>Estimated Total</Text>
              <Text style={styles.previewValueEmphasis}>${estimatedTotal.toFixed(2)}</Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('viewDetails')}
          fullWidth
          onPress={handleViewFullDetails}
          accessibilityHint="Navigates to order details"
        />
        <Button
          title={t('backToHome')}
          variant="outline"
          fullWidth
          onPress={handleBackToHome}
          accessibilityHint="Returns to the home screen"
        />
      </View>
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
      paddingBottom: Spacing.md,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: Spacing.sm,
      marginLeft: -Spacing.xxs,
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
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
    },
    notFoundText: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
      textAlign: 'center',
    },
    statusCard: {
      marginBottom: Spacing.xxl,
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.xs,
    },
    orderId: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.textMuted,
    },
    shopName: {
      fontSize: Typography.title.fontSize,
      lineHeight: Typography.title.lineHeight,
      fontWeight: Typography.title.fontWeight,
      color: colors.text,
    },
    section: {
      marginBottom: Spacing.xxl,
    },
    lastSection: {
      marginBottom: Spacing.xl,
    },
    previewLabel: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
      marginBottom: Spacing.sm,
    },
    previewLabelEmphasis: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
    },
    servicesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    previewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    previewRowLast: {
      marginTop: Spacing.sm,
    },
    previewValue: {
      fontSize: Typography.body.fontSize,
      color: colors.text,
    },
    previewValueEmphasis: {
      fontSize: Typography.subtitle.fontSize,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.primary,
    },
    footer: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      gap: Spacing.sm,
    },
  });
