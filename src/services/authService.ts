import type { Session, User } from '@supabase/supabase-js';

import { isSupabaseDataSource } from '@/src/config/dataSource';
import { getSupabaseClient, supabase } from '@/src/lib/supabase';

// Normalized, i18n-key-shaped error codes. Screens map these to localized
// copy via useTranslation() — this layer never returns English text so it
// can't leak an un-translated string into the UI.
export type AuthErrorCode =
  | 'not_configured'
  | 'invalid_credentials'
  | 'account_exists'
  | 'email_verification_required'
  | 'network_error'
  | 'unknown';

export interface AuthResult {
  error: AuthErrorCode | null;
}

export interface SignUpInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

function normalizeAuthError(error: unknown): AuthErrorCode {
  if (!error) return 'unknown';
  const err = error as { code?: string; message?: string };
  const code = err.code?.toLowerCase() ?? '';
  const message = err.message?.toLowerCase() ?? '';

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'invalid_credentials';
  }
  if (code === 'user_already_exists' || code === 'email_exists' || message.includes('already registered')) {
    return 'account_exists';
  }
  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'email_verification_required';
  }
  if (message.includes('network') || message.includes('fetch failed') || message.includes('failed to fetch')) {
    return 'network_error';
  }
  return 'unknown';
}

// Auth calls are centralized here rather than scattered across screens, so
// error normalization and the "Supabase not configured" guard only exist
// once. Screens should only ever call these methods, never `supabase.auth.*`
// directly.
export const authService = {
  async signUp({ fullName, email, phone, password }: SignUpInput): Promise<AuthResult> {
    if (!isSupabaseDataSource) return { error: 'not_configured' };

    const { error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    return { error: error ? normalizeAuthError(error) : null };
  },

  async signIn({ email, password }: SignInInput): Promise<AuthResult> {
    if (!isSupabaseDataSource) return { error: 'not_configured' };

    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });

    return { error: error ? normalizeAuthError(error) : null };
  },

  async signOut(): Promise<AuthResult> {
    if (!isSupabaseDataSource) return { error: 'not_configured' };

    const { error } = await getSupabaseClient().auth.signOut();

    return { error: error ? normalizeAuthError(error) : null };
  },

  async requestPasswordReset(email: string): Promise<AuthResult> {
    if (!isSupabaseDataSource) return { error: 'not_configured' };

    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email);

    return { error: error ? normalizeAuthError(error) : null };
  },

  async getSession(): Promise<Session | null> {
    if (!isSupabaseDataSource || !supabase) return null;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  async getUser(): Promise<User | null> {
    if (!isSupabaseDataSource || !supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  // Returns an unsubscribe function directly (rather than the raw
  // subscription object) so callers can clean up with `return unsubscribe`
  // from a useEffect without an extra wrapper.
  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    if (!isSupabaseDataSource || !supabase) return () => {};

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => callback(session));

    return () => subscription.unsubscribe();
  },
};
