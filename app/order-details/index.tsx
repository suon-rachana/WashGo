import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ComponentProps, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionHeader } from '@/src/components/common';
import { OrderTimeline } from '@/src/components/order';
import { Badge, Button, Card } from '@/src/components/ui';
import {
  addresses,
  dateOptions,
  getOrderById,
  getOrderStatusLabelKey,
  laundries,
  orderSteps,
  promotions,
  services,
  sizeOptions,
  timeOptions,
} from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';
import { estimateOrderTotal } from '@/src/utils/estimateOrderTotal';

interface InfoRowProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  subValue?: string;
  colors: ColorScheme;
  styles: ReturnType<typeof createStyles>;
}

function InfoRow({ icon, label, value, subValue, colors, styles }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
        {subValue ? <Text style={styles.infoSubValue}>{subValue}</Text> : null}
      </View>
    </View>
  );
}

interface PriceRowProps {
  label: string;
  value: string;
  emphasis?: boolean;
  positive?: boolean;
  styles: ReturnType<typeof createStyles>;
}

function PriceRow({ label, value, emphasis = false, positive = false, styles }: PriceRowProps) {
  return (
    <View style={styles.priceRow}>
      <Text style={[styles.priceLabel, emphasis && styles.priceLabelEmphasis]}>{label}</Text>
      <Text
        style={[
          styles.priceValue,
          emphasis && styles.priceValueEmphasis,
          positive && styles.priceValuePositive,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function OrderDetailsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const order = getOrderById(orderId);

  const handleBackToHome = () => {
    router.replace('/(tabs)/home');
  };

  const handleTrackOrder = () => {
    // `/tracking` is an index route; see the Href-cast note in app/(tabs)/home.tsx —
    // the local typed-routes generator doesn't collapse index files to their parent path.
    router.push({
      pathname: '/tracking',
      params: { orderId: order?.id },
    } as unknown as Href);
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>{t('orderDetails')}</Text>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t('orderNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const laundry = laundries.find((item) => item.id === order.laundryId);
  const address = addresses.find((item) => item.id === order.addressId);
  const size = sizeOptions.find((item) => item.id === order.sizeId);
  const date = dateOptions.find((item) => item.id === order.dateId);
  const time = timeOptions.find((item) => item.id === order.timeId);

  const selectedServiceIds = order.serviceIds.split(',').filter(Boolean);
  const selectedServices = services.filter((service) => selectedServiceIds.includes(service.id));

  const timelineSteps = orderSteps.map((step) => ({ id: step.id, label: t(step.labelKey) }));
  const statusLabel = t(getOrderStatusLabelKey(order.status, order.currentStepId));
  const { laundryFee, pickupFee, returnDeliveryFee, discountAmount, total } = estimateOrderTotal(
    selectedServices,
    promotions[0]
  );
  const promotion = promotions[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{t('orderDetails')}</Text>
        <Text style={styles.subtitle}>All the details for your confirmed order.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="elevated" style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.orderId}>{order.id}</Text>
            <Badge label={statusLabel} variant="primary" />
          </View>
        </Card>

        <View style={styles.section}>
          <SectionHeader title="Laundry Information" />
          <Card variant="outlined">
            <InfoRow
              icon="storefront-outline"
              label="Laundry"
              value={laundry?.name ?? 'Not selected'}
              colors={colors}
              styles={styles}
            />
            {laundry ? (
              <>
                <InfoRow
                  icon="star"
                  label="Rating"
                  value={`${laundry.rating.toFixed(1)} • ${laundry.distanceKm.toFixed(1)} km away`}
                  colors={colors}
                  styles={styles}
                />
                <InfoRow
                  icon="time-outline"
                  label="Availability"
                  value={laundry.isOpen ? 'Open now' : 'Closed'}
                  subValue={`${laundry.etaMinutes} min estimated turnaround`}
                  colors={colors}
                  styles={styles}
                />
              </>
            ) : null}
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Selected Services" />
          <Card variant="outlined" padding="none">
            {selectedServices.length === 0 ? (
              <Text style={styles.emptyText}>No services were selected.</Text>
            ) : (
              selectedServices.map((service, index) => (
                <View
                  key={service.id}
                  style={[
                    styles.serviceRow,
                    index < selectedServices.length - 1 && styles.serviceRowDivider,
                  ]}
                >
                  <Text style={styles.serviceLabel}>{service.title}</Text>
                  <Text style={styles.serviceValue}>${service.price.toFixed(2)}</Text>
                </View>
              ))
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Pickup Information" />
          <Card variant="outlined">
            <InfoRow
              icon="location-outline"
              label="Pickup Address"
              value={address?.label ?? 'Not selected'}
              subValue={address?.detail}
              colors={colors}
              styles={styles}
            />
            <InfoRow
              icon="cube-outline"
              label="Size Estimate"
              value={size?.label ?? 'Not selected'}
              subValue={size?.detail}
              colors={colors}
              styles={styles}
            />
            <InfoRow
              icon="calendar-outline"
              label="Pickup Time"
              value={date && time ? `${date.label}, ${time.label}` : 'Not selected'}
              subValue={time?.detail}
              colors={colors}
              styles={styles}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Timeline Preview" />
          <Card variant="outlined">
            <OrderTimeline steps={timelineSteps} currentStepId={order.currentStepId} />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Price Breakdown" />
          <Card variant="outlined">
            <PriceRow label="Estimated Laundry Fee" value={`$${laundryFee.toFixed(2)}`} styles={styles} />
            <PriceRow label="Pickup Fee" value={`$${pickupFee.toFixed(2)}`} styles={styles} />
            <PriceRow label="Return Delivery Fee" value={`$${returnDeliveryFee.toFixed(2)}`} styles={styles} />
            {discountAmount > 0 ? (
              <PriceRow
                label={`Discount (${promotion.discountPercent}%)`}
                value={`-$${discountAmount.toFixed(2)}`}
                positive
                styles={styles}
              />
            ) : null}
            <View style={styles.totalDivider} />
            <PriceRow label="Estimated Total" value={`$${total.toFixed(2)}`} emphasis styles={styles} />
          </Card>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <SectionHeader title="Order Notes" />
          <Card variant="outlined">
            <Text style={styles.notesText}>{order.notes}</Text>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {order.status === 'active' ? (
          <Button
            title={t('trackOrder')}
            fullWidth
            onPress={handleTrackOrder}
            accessibilityHint="Navigates to order tracking"
          />
        ) : null}
        <View style={styles.footerRow}>
          <Button
            title="Contact Laundry"
            variant="outline"
            onPress={() => console.log('Contact laundry pressed')}
            accessibilityHint="Opens a way to contact the laundry about this order"
            style={styles.footerButton}
          />
          <Button
            title="Need Help?"
            variant="outline"
            onPress={() => console.log('Need help pressed')}
            accessibilityHint="Opens support for this order"
            style={styles.footerButton}
          />
        </View>
        <Button
          title={t('backToHome')}
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
    },
    orderId: {
      fontSize: Typography.subtitle.fontSize,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.text,
    },
    section: {
      marginBottom: Spacing.xxl,
    },
    lastSection: {
      marginBottom: Spacing.xl,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
    },
    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: Radius.circle,
      backgroundColor: `${colors.primary}1A`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    infoTextWrap: {
      flex: 1,
    },
    infoLabel: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
      marginBottom: Spacing.xxs,
    },
    infoValue: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
    },
    infoSubValue: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
      marginTop: Spacing.xxs,
    },
    emptyText: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
    },
    serviceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    serviceRowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    serviceLabel: {
      fontSize: Typography.body.fontSize,
      color: colors.text,
    },
    serviceValue: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    priceLabel: {
      fontSize: Typography.body.fontSize,
      color: colors.textMuted,
    },
    priceLabelEmphasis: {
      fontSize: Typography.subtitle.fontSize,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.text,
    },
    priceValue: {
      fontSize: Typography.body.fontSize,
      color: colors.text,
    },
    priceValueEmphasis: {
      fontSize: Typography.subtitle.fontSize,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.primary,
    },
    priceValuePositive: {
      color: colors.success,
    },
    totalDivider: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginBottom: Spacing.sm,
    },
    notesText: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: colors.textMuted,
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
    footerRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    footerButton: {
      flex: 1,
    },
  });
