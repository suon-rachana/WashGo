import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CharacterCounter, SelectableOption } from '@/src/components/common';
import { Button, Input } from '@/src/components/ui';
import { addresses, dateOptions, sizeOptions, timeOptions } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';

const NOTES_MAX_LENGTH = 150;

export default function PickupBookingScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { laundryId, serviceIds } = useLocalSearchParams<{ laundryId?: string; serviceIds?: string }>();

  const [addressId, setAddressId] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [dateId, setDateId] = useState<string | null>(null);
  const [timeId, setTimeId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const isComplete = !!addressId && !!sizeId && !!dateId && !!timeId;

  const handleContinue = () => {
    // `/summary` is an index route; see the Href-cast note in app/(tabs)/home.tsx —
    // the local typed-routes generator doesn't collapse index files to their parent path.
    router.push({
      pathname: '/summary',
      params: {
        ...(laundryId ? { laundryId } : {}),
        ...(serviceIds ? { serviceIds } : {}),
        addressId: addressId ?? '',
        sizeId: sizeId ?? '',
        dateId: dateId ?? '',
        timeId: timeId ?? '',
      },
    } as unknown as Href);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Pickup Details</Text>
        <Text style={styles.subtitle}>Tell us when and where to collect your laundry.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Address</Text>
          <View style={styles.optionList}>
            {addresses.map((address) => (
              <SelectableOption
                key={address.id}
                title={address.label}
                detail={address.detail}
                icon={address.icon}
                selected={addressId === address.id}
                onPress={() => setAddressId(address.id)}
                accessibilityLabel={`Select pickup address ${address.label}`}
              />
            ))}
            <Pressable
              onPress={() => console.log('Add new address pressed')}
              accessibilityRole="button"
              accessibilityLabel="Add new address"
              accessibilityHint="Opens a form to save a new pickup address"
              style={({ pressed }) => [styles.addAddress, pressed && styles.addAddressPressed]}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Laundry Size Estimate</Text>
          <View style={styles.optionList}>
            {sizeOptions.map((size) => (
              <SelectableOption
                key={size.id}
                title={size.label}
                detail={size.detail}
                selected={sizeId === size.id}
                onPress={() => setSizeId(size.id)}
                accessibilityLabel={`Select laundry size ${size.label}`}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Date</Text>
          <View style={styles.optionRowGroup}>
            {dateOptions.map((date) => (
              <SelectableOption
                key={date.id}
                title={date.label}
                selected={dateId === date.id}
                onPress={() => setDateId(date.id)}
                fullWidth={false}
                accessibilityLabel={`Select pickup date ${date.label}`}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Time</Text>
          <View style={styles.optionList}>
            {timeOptions.map((time) => (
              <SelectableOption
                key={time.id}
                title={time.label}
                detail={time.detail}
                selected={timeId === time.id}
                onPress={() => setTimeId(time.id)}
                accessibilityLabel={`Select pickup time ${time.label}`}
              />
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Pickup Notes</Text>
          <Input
            placeholder="Any notes for the rider?"
            multiline
            numberOfLines={4}
            maxLength={NOTES_MAX_LENGTH}
            value={notes}
            onChangeText={setNotes}
            accessibilityLabel="Pickup notes"
          />
          <CharacterCounter current={notes.length} max={NOTES_MAX_LENGTH} style={styles.counter} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Schedule Pickup"
          fullWidth
          disabled={!isComplete}
          onPress={handleContinue}
          accessibilityHint="Continues to review your order summary"
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
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: Typography.subtitle.fontSize,
      lineHeight: Typography.subtitle.lineHeight,
      fontWeight: Typography.subtitle.fontWeight,
      color: colors.text,
      marginBottom: Spacing.md,
    },
    optionList: {
      gap: Spacing.sm,
    },
    optionRowGroup: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    addAddress: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: Radius.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      justifyContent: 'center',
    },
    addAddressPressed: {
      opacity: 0.7,
    },
    addAddressText: {
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: Typography.bodyMedium.fontWeight,
      color: colors.primary,
    },
    counter: {
      alignSelf: 'flex-end',
      marginTop: Spacing.xxs,
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
