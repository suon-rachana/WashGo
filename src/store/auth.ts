import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { isSupabaseDataSource } from '@/src/config/dataSource';
import { authService, type AuthErrorCode, type SignInInput, type SignUpInput } from '@/src/services/authService';
import { profileService } from '@/src/services/profileService';
import type { Profile } from '@/src/types/database';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  error: AuthErrorCode | null;
  initialize: () => Promise<void>;
  signIn: (input: SignInInput) => Promise<boolean>;
  signUp: (input: SignUpInput) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

// Module-level, not store state: the auth-state-change subscription must
// survive across every store update, and `initialize` must be a safe no-op
// on repeat calls (StrictMode double-invokes effects; multiple screens may
// also mount an effect that calls it).
let unsubscribeAuthListener: (() => void) | null = null;
let hasInitialized = false;

// Global auth/session state — Supabase mode only. In mock mode this store
// stays idle (isInitializing flips to false immediately, isAuthenticated
// stays false) so the existing prototype's own navigation calls keep
// working untouched.
export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isInitializing: true,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    if (hasInitialized) return;
    hasInitialized = true;

    if (!isSupabaseDataSource) {
      set({ isInitializing: false });
      return;
    }

    const session = await authService.getSession();
    set({ session, user: session?.user ?? null, isAuthenticated: !!session });

    if (session) {
      await get().refreshProfile();
    }
    set({ isInitializing: false });

    unsubscribeAuthListener?.();
    unsubscribeAuthListener = authService.onAuthStateChange((nextSession) => {
      set({ session: nextSession, user: nextSession?.user ?? null, isAuthenticated: !!nextSession });
      if (nextSession) {
        get().refreshProfile();
      } else {
        set({ profile: null });
      }
    });
  },

  signIn: async (input) => {
    set({ error: null });
    const { error } = await authService.signIn(input);
    if (error) {
      set({ error });
      return false;
    }
    return true;
  },

  signUp: async (input) => {
    set({ error: null });
    const { error } = await authService.signUp(input);
    if (error) {
      set({ error });
      return false;
    }
    return true;
  },

  signOut: async () => {
    await authService.signOut();
    set({ session: null, user: null, profile: null, isAuthenticated: false, error: null });
  },

  refreshProfile: async () => {
    // A missing profile row (e.g. the trigger hasn't caught up yet) isn't a
    // fatal auth error — leave `profile` null and let the UI show its own
    // "unable to load profile" state rather than surfacing a sign-in error.
    const { data } = await profileService.fetchCurrentProfile();
    set({ profile: data });
  },

  clearError: () => set({ error: null }),
}));
