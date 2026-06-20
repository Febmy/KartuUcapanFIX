import type { User } from '@supabase/supabase-js';
import { isConfiguredAdmin } from './supabase/config';
import { createSupabaseServerClient } from './supabase/server';

export type AdminAuthResult =
  | { ok: true; user: User; supabase: Awaited<ReturnType<typeof createSupabaseServerClient>> }
  | { ok: false; status: 401 | 403; message: string };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, status: 401, message: 'Silakan login sebagai admin terlebih dahulu.' };
  }

  if (!isConfiguredAdmin(user.email)) {
    return {
      ok: false,
      status: 403,
      message: 'Akun ini tidak memiliki akses sebagai admin.',
    };
  }

  return { ok: true, user, supabase };
}
