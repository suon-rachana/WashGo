import { isSupabaseDataSource } from '@/src/config/dataSource';
import { getSupabaseClient } from '@/src/lib/supabase';
import type { AddressInsert, AddressRow, AddressUpdate } from '@/src/types/database';
import { normalizeServiceError, type ServiceErrorCode } from './errors';

export interface AddressListResult {
  data: AddressRow[];
  error: ServiceErrorCode | null;
}

export interface AddressMutationResult {
  data: AddressRow | null;
  error: ServiceErrorCode | null;
}

export interface AddressVoidResult {
  error: ServiceErrorCode | null;
}

export type NewAddressInput = Omit<AddressInsert, 'user_id' | 'id'>;

async function currentUserId(): Promise<string | null> {
  const { data } = await getSupabaseClient().auth.getUser();
  return data.user?.id ?? null;
}

export const addressService = {
  async list(): Promise<AddressListResult> {
    if (!isSupabaseDataSource) return { data: [], error: 'not_configured' };

    const userId = await currentUserId();
    if (!userId) return { data: [], error: 'not_authenticated' };

    const { data, error } = await getSupabaseClient()
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) return { data: [], error: normalizeServiceError(error) };
    return { data: data ?? [], error: null };
  },

  async get(id: string): Promise<AddressMutationResult> {
    if (!isSupabaseDataSource) return { data: null, error: 'not_configured' };

    const { data, error } = await getSupabaseClient().from('addresses').select('*').eq('id', id).single();

    if (error) return { data: null, error: normalizeServiceError(error) };
    return { data, error: null };
  },

  async add(input: NewAddressInput): Promise<AddressMutationResult> {
    if (!isSupabaseDataSource) return { data: null, error: 'not_configured' };

    const userId = await currentUserId();
    if (!userId) return { data: null, error: 'not_authenticated' };

    const { data, error } = await getSupabaseClient()
      .from('addresses')
      .insert({ ...input, user_id: userId })
      .select()
      .single();

    if (error) return { data: null, error: normalizeServiceError(error) };
    return { data, error: null };
  },

  async update(id: string, input: AddressUpdate): Promise<AddressMutationResult> {
    if (!isSupabaseDataSource) return { data: null, error: 'not_configured' };

    const { data, error } = await getSupabaseClient().from('addresses').update(input).eq('id', id).select().single();

    if (error) return { data: null, error: normalizeServiceError(error) };
    return { data, error: null };
  },

  async remove(id: string): Promise<AddressVoidResult> {
    if (!isSupabaseDataSource) return { error: 'not_configured' };

    const { error } = await getSupabaseClient().from('addresses').delete().eq('id', id);

    if (error) return { error: normalizeServiceError(error) };
    return { error: null };
  },

  // Delegates to the set_default_address() database function so "unset the
  // old default, set the new one" happens atomically — see
  // supabase/migrations/001_initial_schema.sql. A naive two-step update from
  // the client could race or transiently violate the one-default-per-user
  // constraint.
  async setDefault(id: string): Promise<AddressVoidResult> {
    if (!isSupabaseDataSource) return { error: 'not_configured' };

    const { error } = await getSupabaseClient().rpc('set_default_address', { p_address_id: id });

    if (error) return { error: normalizeServiceError(error) };
    return { error: null };
  },
};
