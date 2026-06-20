export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !publishableKey) return null;

  return { url, publishableKey };
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

export function isConfiguredAdmin(email?: string | null) {
  const configuredAdmin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configuredAdmin) return true;
  return email?.trim().toLowerCase() === configuredAdmin;
}
