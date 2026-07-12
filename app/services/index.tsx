import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CharacterCounter } from '@/src/components/common';
import { ServiceCard, ServiceSummary } from '@/src/components/services';
import { Button, EmptyState, Input } from '@/src/components/ui';
import { laundries, services } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import type { Service } from '@/src/types/service';
import { matchesSearch } from '@/src/utils/search';

const INSTRUCTIONS_MAX_LENGTH = 200;

export default function ChooseServicesScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { laundryId } = useLocalSearchParams<{ laundryId?: string }>();
  const laundry = laundries.find((item) => item.id === laundryId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');

  const filteredServices = useMemo(
    () =>
      services.filter((service) =>
        matchesSearch(searchQuery, [service.title, service.description, service.badge])
      ),
    [searchQuery]
  );

  const selectedServices = useMemo(
    () => services.filter((service) => selectedIds.includes(service.id)),
    [selectedIds]
  );

  const handleToggle = (service: Service) => {
    setSelectedIds((prev) =>
      prev.includes(service.id) ? prev.filter((id) => id !== service.id) : [...prev, service.id]
    );
  };

  const continueLabel =
    selectedIds.length === 0
      ? 'Select a service'
      : selectedIds.length === 1
        ? 'Continue'
        : `Continue (${selectedIds.length})`;

  const handleContinue = () => {
    // `/pickup` is an index route; see the Href-cast note in app/(tabs)/home.tsx —
    // the local typed-routes generator doesn't collapse index files to their parent path.
    router.push({
      pathname: '/pickup',
      params: {
        ...(laundryId ? { laundryId } : {}),
        serviceIds: selectedIds.join(','),
      },
    } as unknown as Href);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Choose Services</Text>
        <Text style={styles.subtitle}>
          {laundry ? `Choose one or more services for ${laundry.name}.` : 'Choose one or more services.'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          placeholder="Search services..."
          icon={<Ionicons name="search" size={18} color={colors.textMuted} />}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityRole="search"
          accessibilityLabel="Search services"
          containerStyle={styles.search}
        />

        <Text style={styles.countText}>
          {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} available
        </Text>

        <View style={styles.serviceList}>
          {filteredServices.length === 0 ? (
            <EmptyState title="No services found" description="Try a different search term." />
          ) : (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selectedIds.includes(service.id)}
                onToggle={handleToggle}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <Input
            placeholder="Any special requests?"
            multiline
            numberOfLines={4}
            maxLength={INSTRUCTIONS_MAX_LENGTH}
            value={instructions}
            onChangeText={setInstructions}
            accessibilityLabel="Special instructions"
          />
          <CharacterCounter
            current={instructions.length}
            max={INSTRUCTIONS_MAX_LENGTH}
            style={styles.counter}
          />
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <ServiceSummary selectedServices={selectedServices} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={continueLabel}
          fullWidth
          disabled={selectedIds.length === 0}
          onPress={handleContinue}
          accessibilityHint="Continues to pickup details"
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
    search: {
      marginBottom: Spacing.sm,
    },
    countText: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
      marginBottom: Spacing.md,
    },
    serviceList: {
      gap: Spacing.md,
      marginBottom: Spacing.xxl,
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
