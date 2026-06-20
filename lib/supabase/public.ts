import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';

let publicClient: ReturnType<typeof createClient> | undefined;

export function createSupabasePublicClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  publicClient ??= createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return publicClient;
}
