'use client';

import { FormEvent, useState } from 'react';
import { LogIn } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function LoginForm({ nextPath, error }: { nextPath: string; error?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(error === 'unauthorized' ? 'Akun ini tidak memiliki akses sebagai admin.' : '');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      window.location.assign(nextPath.startsWith('/') ? nextPath : '/admin');
    } catch (loginError) {
      setMessage(loginError instanceof Error ? loginError.message : 'Login gagal. Periksa email dan password Anda.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{message}</p>}
      <label className="block"><span className="mb-2 block text-sm font-semibold text-card-foreground">Email admin</span><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border-2 border-accent bg-background px-4 py-3 outline-none transition focus:border-primary" placeholder="nama@email.com" /></label>
      <label className="block"><span className="mb-2 block text-sm font-semibold text-card-foreground">Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border-2 border-accent bg-background px-4 py-3 outline-none transition focus:border-primary" placeholder="••••••••" /></label>
      <button disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"><LogIn className="h-5 w-5" />{isSubmitting ? 'Masuk...' : 'Masuk ke dashboard'}</button>
    </form>
  );
}
