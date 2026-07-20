// Typed access to the Expo public environment variables the app is allowed
// to read on-device. Only EXPO_PUBLIC_* values ever reach the client bundle —
// the Supabase service-role key must never be added here.

export interface EnvConfig {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
}

function readEnv(): EnvConfig {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || null;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || null;
  return { supabaseUrl, supabaseAnonKey };
}

export const env: EnvConfig = readEnv();

export function isSupabaseConfigured(): boolean {
  return !!env.supabaseUrl && !!env.supabaseAnonKey;
}

// Human-readable explanation of what's missing, safe to show in dev-only UI
// or logs — never includes any secret value, only variable names.
export function getSupabaseConfigError(): string | null {
  if (isSupabaseConfigured()) return null;

  const missing: string[] = [];
  if (!env.supabaseUrl) missing.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!env.supabaseAnonKey) missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');

  return `Missing Supabase configuration: ${missing.join(', ')}. Copy .env.example to .env, fill in your Supabase project URL and anon key, then restart Expo.`;
}
