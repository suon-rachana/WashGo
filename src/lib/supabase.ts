import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env, getSupabaseConfigError, isSupabaseConfigured } from '@/src/config/env';
import type { Database } from '@/src/types/database';

function createSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    if (__DEV__) {
      console.warn(`[WashGo] ${getSupabaseConfigError()}`);
    }
    return null;
  }

  return createClient<Database>(env.supabaseUrl as string, env.supabaseAnonKey as string, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // There's no browser redirect URL to parse tokens out of in React Native.
      detectSessionInUrl: false,
    },
  });
}

// Single shared client instance for the whole app — screens and services
// must import this rather than calling createClient() themselves. Null when
// EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY are missing, so
// importing this module never crashes the app at startup.
export const supabase: SupabaseClient<Database> | null = createSupabaseClient();

// Use inside a codepath that has already confirmed Supabase mode is active
// (isSupabaseDataSource) — turns a missing client into one clear error
// instead of a null-reference crash deep inside a query.
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(getSupabaseConfigError() ?? 'Supabase client is not configured.');
  }
  return supabase;
}
