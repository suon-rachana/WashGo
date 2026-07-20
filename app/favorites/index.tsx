import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LaundryCard } from '@/src/components/laundry';
import { AppScreen } from '@/src/components/layout';
import { EmptyState, Input } from '@/src/components/ui';
import { laundries, type Laundry } from '@/src/data/mock';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { useFavoritesStore } from '@/src/store/favorites';
import { ColorScheme, Spacing } from '@/src/theme';
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
    <AppScreen title="Favorite Laundries">
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
    </AppScreen>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    search: {
      marginBottom: Spacing.xl,
    },
    list: {
      gap: Spacing.md,
    },
  });
