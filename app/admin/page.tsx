import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { isConfiguredAdmin, isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <div className="max-w-xl rounded-2xl border-2 border-primary/20 bg-card p-8 shadow-xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">Konfigurasi diperlukan</p>
          <h1 className="text-3xl font-bold text-foreground">Supabase belum terhubung</h1>
          <p className="mt-4 leading-relaxed text-card-foreground">Isi environment variable Supabase, jalankan SQL schema pada folder <code className="rounded bg-secondary px-1 py-0.5">supabase/schema.sql</code>, lalu deploy ulang. Panduan detail tersedia di <code className="rounded bg-secondary px-1 py-0.5">SUPABASE_SETUP.md</code>.</p>
        </div>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/admin');
  const userEmail = user.email;
  if (!isConfiguredAdmin(userEmail)) redirect('/login?error=unauthorized');

  return <AdminDashboard />;
}
