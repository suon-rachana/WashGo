import { create } from 'zustand';

interface FavoritesState {
  favoriteIds: Set<string>;
  isFavorite: (laundryId: string) => boolean;
  toggleFavorite: (laundryId: string) => void;
}

// Global (client-only) favorites state — shared between the Favorites list and
// the heart toggle on Laundry Details so toggling a favorite anywhere updates
// everywhere immediately. No backend; resets on app restart.
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(['laundry-1', 'laundry-3']),
  isFavorite: (laundryId) => get().favoriteIds.has(laundryId),
  toggleFavorite: (laundryId) =>
    set((state) => {
      const nextFavoriteIds = new Set(state.favoriteIds);
      if (nextFavoriteIds.has(laundryId)) {
        nextFavoriteIds.delete(laundryId);
      } else {
        nextFavoriteIds.add(laundryId);
      }
      return { favoriteIds: nextFavoriteIds };
    }),
}));
