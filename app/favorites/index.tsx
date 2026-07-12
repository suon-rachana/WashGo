import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LaundryCard } from '@/src/components/laundry';
import { EmptyState, Input } from '@/src/components/ui';
import { laundries, type Laundry } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useFavoritesStore } from '@/src/store/favorites';
import { ColorScheme, Spacing, Typography } from '@/src/theme';
import { matchesSearch } from '@/src/utils/search';

export default function FavoriteLaundriesScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [searchQuery, setSearchQuery] = useState('');

  const favoriteLaundries = useMemo(
    () => laundries.filter((laundry) => favoriteIds.has(laundry.id)),
    [favoriteIds]
  );

  const visibleLaundries = useMemo(
    () => favoriteLaundries.filter((laundry) => matchesSearch(searchQuery, [laundry.name])),
    [favoriteLaundries, searchQuery]
  );

  const handlePress = (laundry: Laundry) => {
    router.push({ pathname: '/laundry/[id]', params: { id: laundry.id } });
  };

  const emptyState =
    favoriteLaundries.length === 0
      ? {
          title: 'No favorites yet',
          description: 'Tap the heart icon on a laundry to save it here.',
          icon: 'heart-outline' as const,
        }
      : {
          title: 'No laundries found',
          description: 'Try adjusting your search.',
          icon: 'search-outline' as const,
        };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Go back" style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Favorite Laundries</Text>
        <Text style={styles.subtitle}>Your saved laundry partners.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {favoriteLaundries.length > 0 ? (
          <Input
            placeholder="Search favorites..."
            icon={<Ionicons name="search" size={18} color={colors.textMuted} />}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityRole="search"
            accessibilityLabel="Search favorites"
            containerStyle={styles.search}
          />
        ) : null}

        <View style={styles.list}>
          {visibleLaundries.length === 0 ? (
            <EmptyState title={emptyState.title} description={emptyState.description} icon={emptyState.icon} />
          ) : (
            visibleLaundries.map((laundry) => (
              <LaundryCard key={laundry.id} laundry={laundry} onPress={handlePress} />
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
      marginBottom: Spacing.xl,
    },
    list: {
      gap: Spacing.md,
    },
  });
