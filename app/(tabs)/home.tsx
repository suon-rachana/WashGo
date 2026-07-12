import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPill, PromoBanner, SectionHeader } from '@/src/components/common';
import { LaundryCard } from '@/src/components/laundry';
import { Chip, EmptyState, Input } from '@/src/components/ui';
import { categories, laundries, mockUser, notifications, promotions, services, type Laundry } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useTranslation } from '@/src/i18n';
import { ColorScheme, Radius, Spacing, Typography } from '@/src/theme';
import { matchesSearch } from '@/src/utils/search';

// `/shops` and `/notifications` are index routes; the local typed-routes
// generator doesn't collapse index files to their parent path, so the
// literal string fails the type check even though it's the correct runtime
// href. Cast once here for each.
const SHOPS_HREF = '/shops' as Href;
const NOTIFICATIONS_HREF = '/notifications' as Href;

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();
  const promotion = promotions[0];
  const [searchQuery, setSearchQuery] = useState('');
  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);

  const isSearching = searchQuery.trim().length > 0;

  const filteredLaundries = useMemo(
    () => laundries.filter((laundry) => matchesSearch(searchQuery, [laundry.name])),
    [searchQuery]
  );
  const filteredServices = useMemo(
    () => services.filter((service) => matchesSearch(searchQuery, [service.title, service.description])),
    [searchQuery]
  );

  const visibleLaundries = isSearching ? filteredLaundries : laundries.slice(0, 4);
  const visibleServices = isSearching ? filteredServices : services;
  const hasNoResults = isSearching && filteredLaundries.length === 0 && filteredServices.length === 0;

  const handleLaundryPress = (laundry: Laundry) => {
    router.push({ pathname: '/laundry/[id]', params: { id: laundry.id } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.locationText}>{mockUser.location}</Text>
          </View>
          <Pressable
            onPress={() => router.push(NOTIFICATIONS_HREF)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hasUnreadNotifications ? 'Open notifications, unread' : 'Open notifications'}
            accessibilityHint="Opens the notifications screen"
            style={styles.bellButton}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            {hasUnreadNotifications ? <View style={styles.unreadDot} /> : null}
          </Pressable>
        </View>

        <Text style={styles.greeting}>{t('goodMorning')}, {mockUser.firstName}</Text>
        <Text style={styles.subtitle}>{t('letUsHandleYourLaundry')}</Text>

        <Input
          placeholder={t('searchLaundriesOrServices')}
          icon={<Ionicons name="search" size={18} color={colors.textMuted} />}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityRole="search"
          accessibilityLabel="Search laundries or services"
          containerStyle={styles.search}
        />

        {!isSearching && promotion ? (
          <PromoBanner
            title={promotion.title}
            ctaLabel={promotion.ctaLabel}
            onPress={() => router.push(SHOPS_HREF)}
          />
        ) : null}

        {!isSearching ? (
          <View style={styles.section}>
            <SectionHeader title={t('categories')} />
            <View style={styles.categoriesRow}>
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  label={category.label}
                  icon={category.icon}
                  color={category.color}
                  onPress={() => router.push(SHOPS_HREF)}
                  accessibilityHint="Opens laundries offering this service"
                />
              ))}
            </View>
          </View>
        ) : null}

        {hasNoResults ? (
          <View style={styles.section}>
            <EmptyState
              title={t('noLaundriesFound')}
              description={t('noLaundriesFoundDescription')}
            />
          </View>
        ) : (
          <>
            {visibleLaundries.length > 0 ? (
              <View style={styles.section}>
                <SectionHeader
                  title={t('nearbyLaundries')}
                  actionLabel={t('seeAll')}
                  onActionPress={() => console.log('See all laundries pressed')}
                  actionAccessibilityHint="Opens the full list of nearby laundries"
                />
                <View style={styles.laundryList}>
                  {visibleLaundries.map((laundry) => (
                    <LaundryCard key={laundry.id} laundry={laundry} onPress={handleLaundryPress} />
                  ))}
                </View>
              </View>
            ) : null}

            {visibleServices.length > 0 ? (
              <View style={[styles.section, styles.lastSection]}>
                <SectionHeader title={t('popularServices')} />
                <View style={styles.servicesRow}>
                  {visibleServices.map((service) => (
                    <Chip key={service.id} label={service.title} />
                  ))}
                </View>
              </View>
            ) : null}
          </>
        )}
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
    content: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.huge,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xxs,
    },
    bellButton: {
      width: 36,
      height: 36,
      borderRadius: Radius.circle,
      backgroundColor: `${colors.primary}1A`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadDot: {
      position: 'absolute',
      top: 6,
      right: 7,
      width: 9,
      height: 9,
      borderRadius: Radius.circle,
      backgroundColor: colors.danger,
      borderWidth: 1.5,
      borderColor: colors.background,
    },
    locationText: {
      fontSize: Typography.caption.fontSize,
      color: colors.textMuted,
    },
    greeting: {
      fontSize: Typography.headline.fontSize,
      lineHeight: Typography.headline.lineHeight,
      fontWeight: Typography.headline.fontWeight,
      color: colors.text,
      marginBottom: Spacing.xxs,
    },
    subtitle: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      fontWeight: Typography.body.fontWeight,
      color: colors.textMuted,
      marginBottom: Spacing.xl,
    },
    search: {
      marginBottom: Spacing.xl,
    },
    section: {
      marginTop: Spacing.xxl,
    },
    lastSection: {
      marginBottom: Spacing.xl,
    },
    categoriesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    laundryList: {
      gap: Spacing.md,
    },
    servicesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
  });
