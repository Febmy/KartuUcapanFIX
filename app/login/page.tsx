import { LoginForm } from '@/components/LoginForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const nextPath = next?.startsWith('/') ? next : '/admin';

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-background via-accent-light to-background p-5">
      <section className="w-full max-w-md rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-2xl sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Graduation Greeting</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Login Admin</h1>
        <p className="mt-3 text-sm leading-relaxed text-card-foreground">Masuk menggunakan akun admin yang sudah dibuat di Supabase Authentication.</p>
        <div className="mt-7">
          {isSupabaseConfigured() ? <LoginForm nextPath={nextPath} error={error} /> : <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Supabase belum dikonfigurasi. Lengkapi <code>.env.local</code> terlebih dahulu.</p>}
        </div>
      </section>
    </main>
  );
}
