import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { ComponentProps, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionHeader } from '@/src/components/common';
import { Button, Card } from '@/src/components/ui';
import {
  addresses,
  dateOptions,
  laundries,
  mockOrders,
  promotions,
  services,
  sizeOptions,
  timeOptions,
} from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';
import { estimateOrderTotal } from '@/src/utils/estimateOrderTotal';

interface SummaryRowProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  subValue?: string;
  colors: ColorScheme;
  styles: ReturnType<typeof createStyles>;
}

function SummaryRow({ icon, label, value, subValue, colors, styles }: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.summaryTextWrap}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
        {subValue ? <Text style={styles.summarySubValue}>{subValue}</Text> : null}
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

export default function OrderSummaryScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { laundryId, serviceIds, addressId, sizeId, dateId, timeId } = useLocalSearchParams<{
    laundryId?: string;
    serviceIds?: string;
    addressId?: string;
    sizeId?: string;
    dateId?: string;
    timeId?: string;
  }>();

  const laundry = laundries.find((item) => item.id === laundryId);
  const address = addresses.find((item) => item.id === addressId);
  const size = sizeOptions.find((item) => item.id === sizeId);
  const date = dateOptions.find((item) => item.id === dateId);
  const time = timeOptions.find((item) => item.id === timeId);

  const selectedServiceIds = serviceIds ? serviceIds.split(',').filter(Boolean) : [];
  const selectedServices = services.filter((service) => selectedServiceIds.includes(service.id));

  const promotion = promotions[0];
  const { laundryFee, pickupFee, returnDeliveryFee, discountAmount, total: estimatedTotal } = estimateOrderTotal(
    selectedServices,
    promotion
  );

  const activeOrder = mockOrders.find((order) => order.status === 'active');

  const handleConfirmPickup = () => {
    if (!activeOrder) return;

    // `/payment` is an index route; see the Href-cast note in app/(tabs)/home.tsx —
    // the local typed-routes generator doesn't collapse index files to their parent path.
    router.push({
      pathname: '/payment',
      params: { orderId: activeOrder.id },
    } as unknown as Href);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Order Summary</Text>
        <Text style={styles.subtitle}>Review your pickup before confirming.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SectionHeader title="Booking Details" />
          <Card variant="outlined">
            <SummaryRow
              icon="storefront-outline"
              label="Laundry"
              value={laundry?.name ?? 'Not selected'}
              colors={colors}
              styles={styles}
            />
            <SummaryRow
              icon="location-outline"
              label="Pickup Address"
              value={address?.label ?? 'Not selected'}
              subValue={address?.detail}
              colors={colors}
              styles={styles}
            />
            <SummaryRow
              icon="cube-outline"
              label="Size Estimate"
              value={size?.label ?? 'Not selected'}
              subValue={size?.detail}
              colors={colors}
              styles={styles}
            />
            <SummaryRow
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
          <SectionHeader title="Selected Services" />
          <Card variant="outlined" padding="none">
            {selectedServices.length === 0 ? (
              <Text style={styles.emptyServicesText}>No services selected.</Text>
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

        <View style={[styles.section, styles.lastSection]}>
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
            <PriceRow label="Estimated Total" value={`$${estimatedTotal.toFixed(2)}`} emphasis styles={styles} />
          </Card>

          <View style={styles.noteRow}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
            <Text style={styles.noteText}>
              Final price may change after your laundry partner weighs your clothes.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Request Pickup"
          variant="accent"
          fullWidth
          onPress={handleConfirmPickup}
          accessibilityHint="Confirms your pickup request and proceeds to payment"
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
    section: {
      marginBottom: Spacing.xxl,
    },
    lastSection: {
      marginBottom: Spacing.xl,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: Spacing.md,
    },
    summaryIcon: {
      width: 36,
      height: 36,
      borderRadius: Radius.circle,
      backgroundColor: `${colors.primary}1A`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    summaryTextWrap: {
      flex: 1,
    },
    summaryLabel: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
      marginBottom: Spacing.xxs,
    },
    summaryValue: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.text,
    },
    summarySubValue: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
      marginTop: Spacing.xxs,
    },
    emptyServicesText: {
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
    noteRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.xs,
      marginTop: Spacing.md,
      paddingHorizontal: Spacing.xxs,
    },
    noteText: {
      flex: 1,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      color: colors.textMuted,
    },
    footer: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
  });
