import { isSupabaseDataSource } from '@/src/config/dataSource';
import { getSupabaseClient } from '@/src/lib/supabase';
import type { Profile, ProfileUpdate } from '@/src/types/database';
import { normalizeServiceError, type ServiceErrorCode } from './errors';

export interface ProfileResult {
  data: Profile | null;
  error: ServiceErrorCode | null;
}

export interface ProfileMutationResult {
  error: ServiceErrorCode | null;
}

async function currentUserId(): Promise<string | null> {
  const { data } = await getSupabaseClient().auth.getUser();
  return data.user?.id ?? null;
}

// Only the fields a customer is allowed to self-edit are exposed here.
// `role` has no setter — ProfileUpdate's type doesn't include it — and email
// is intentionally left out: it's owned by Supabase Auth, not this table,
// see docs/SUPABASE_SETUP.md for the email-change flow.
export const profileService = {
  async fetchCurrentProfile(): Promise<ProfileResult> {
    if (!isSupabaseDataSource) return { data: null, error: 'not_configured' };

    const userId = await currentUserId();
    if (!userId) return { data: null, error: 'not_authenticated' };

    const { data, error } = await getSupabaseClient().from('profiles').select('*').eq('id', userId).single();

    if (error) return { data: null, error: normalizeServiceError(error) };
    return { data, error: null };
  },

  async updateProfile(update: ProfileUpdate): Promise<ProfileMutationResult> {
    if (!isSupabaseDataSource) return { error: 'not_configured' };

    const userId = await currentUserId();
    if (!userId) return { error: 'not_authenticated' };

    const { error } = await getSupabaseClient().from('profiles').update(update).eq('id', userId);

    if (error) return { error: normalizeServiceError(error) };
    return { error: null };
  },

  updateFullName(fullName: string) {
    return profileService.updateProfile({ full_name: fullName });
  },

  updatePhone(phone: string) {
    return profileService.updateProfile({ phone });
  },

  updatePreferredLanguage(preferredLanguage: Profile['preferred_language']) {
    return profileService.updateProfile({ preferred_language: preferredLanguage });
  },

  updateThemePreference(themePreference: Profile['theme_preference']) {
    return profileService.updateProfile({ theme_preference: themePreference });
  },

  updateAvatarUrl(avatarUrl: string) {
    return profileService.updateProfile({ avatar_url: avatarUrl });
  },
};
