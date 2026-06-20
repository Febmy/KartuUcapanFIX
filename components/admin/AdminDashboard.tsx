'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, ImageIcon, LogOut, Music, RefreshCw, Save, UploadCloud } from 'lucide-react';
import { DEFAULT_GREETING, type GreetingRecord } from '@/lib/greeting';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type UploadType = 'image' | 'audio';

type ApiResponse = {
  greeting?: GreetingRecord;
  message?: string;
};

function textAreaClassName() {
  return 'w-full rounded-xl border-2 border-accent bg-background px-4 py-3 text-card-foreground outline-none transition focus:border-primary';
}

export function AdminDashboard() {
  const [formData, setFormData] = useState<GreetingRecord>(DEFAULT_GREETING);
  const [initialData, setInitialData] = useState<GreetingRecord>(DEFAULT_GREETING);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState<UploadType | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialData),
    [formData, initialData],
  );

  const loadGreeting = async () => {
    setIsLoading(true);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/greeting', { cache: 'no-store' });
      const payload = (await response.json()) as ApiResponse;
      if (!response.ok || !payload.greeting) throw new Error(payload.message || 'Gagal memuat data ucapan.');
      setFormData(payload.greeting);
      setInitialData(payload.greeting);
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Gagal memuat data ucapan.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadGreeting();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const updateField = <K extends keyof GreetingRecord>(key: K, value: GreetingRecord[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const saveGreeting = async () => {
    setIsSaving(true);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/greeting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const payload = (await response.json()) as ApiResponse;
      if (!response.ok || !payload.greeting) throw new Error(payload.message || 'Gagal menyimpan perubahan.');

      setFormData(payload.greeting);
      setInitialData(payload.greeting);
      setNotice({ type: 'success', text: 'Tersimpan di Supabase. Halaman penerima akan memakai data terbaru saat dibuka atau di-refresh.' });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Gagal menyimpan perubahan.' });
    } finally {
      setIsSaving(false);
    }
  };

  const uploadMedia = async (file: File, type: UploadType) => {
    setUploading(type);
    setNotice(null);
    try {
      const body = new FormData();
      body.append('type', type);
      body.append('file', file);

      const response = await fetch('/api/admin/upload', { method: 'POST', body });
      const payload = (await response.json()) as { url?: string; message?: string };
      if (!response.ok || !payload.url) throw new Error(payload.message || 'Gagal mengunggah media.');

      if (type === 'image') updateField('imageUrl', payload.url);
      if (type === 'audio') {
        updateField('musicUrl', payload.url);
        if (!formData.musicTitle) updateField('musicTitle', file.name.replace(/\.[^/.]+$/, ''));
        updateField('musicEnabled', true);
      }
      setNotice({ type: 'success', text: 'Media berhasil diunggah. Tekan “Simpan perubahan” agar tampil di halaman penerima.' });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Gagal mengunggah media.' });
    } finally {
      setUploading(null);
    }
  };

  const logout = async () => {
    try {
      await createSupabaseBrowserClient().auth.signOut();
    } finally {
      window.location.assign('/login');
    }
  };

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <div>
          <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="font-semibold text-foreground">Memuat data ucapan dari Supabase...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent-light to-background p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Graduation Greeting</p>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-card-foreground">Perubahan yang disimpan di sini langsung menjadi sumber data halaman penerima.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-card px-4 py-2 font-semibold text-primary transition hover:bg-accent-light">
              <ExternalLink className="h-4 w-4" /> Lihat halaman penerima
            </a>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-2 font-semibold text-foreground transition hover:bg-secondary">
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </header>

        {notice && (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${notice.type === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-red-300 bg-red-50 text-red-800'}`}>
            {notice.text}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.65fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg sm:p-8">
              <h2 className="mb-6 text-2xl font-bold text-primary">Informasi Dasar</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama penerima"><input className={textAreaClassName()} value={formData.recipientName} onChange={(event) => updateField('recipientName', event.target.value)} /></Field>
                <Field label="Nama pengirim"><input className={textAreaClassName()} value={formData.senderName} onChange={(event) => updateField('senderName', event.target.value)} /></Field>
                <Field label="Universitas"><input className={textAreaClassName()} value={formData.university} onChange={(event) => updateField('university', event.target.value)} /></Field>
                <Field label="Jurusan / program studi"><input className={textAreaClassName()} value={formData.major} onChange={(event) => updateField('major', event.target.value)} /></Field>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg sm:p-8">
              <h2 className="mb-6 text-2xl font-bold text-primary">Konten Ucapan</h2>
              <div className="space-y-5">
                <Field label="Pesan pembuka"><textarea rows={3} className={textAreaClassName()} value={formData.readyMessage} onChange={(event) => updateField('readyMessage', event.target.value)} /></Field>
                <Field label="Pesan perayaan"><textarea rows={4} className={textAreaClassName()} value={formData.celebrationMessage} onChange={(event) => updateField('celebrationMessage', event.target.value)} /></Field>
                <Field label="Surat utama"><textarea rows={12} className={textAreaClassName()} value={formData.letterMessage} onChange={(event) => updateField('letterMessage', event.target.value)} /></Field>
                <Field label="Pesan semangat revisi"><textarea rows={8} className={textAreaClassName()} value={formData.motivationMessage} onChange={(event) => updateField('motivationMessage', event.target.value)} /></Field>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg sm:p-8">
              <h2 className="mb-6 text-2xl font-bold text-primary">Foto & Musik</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold text-card-foreground"><ImageIcon className="mr-2 inline h-4 w-4" />Foto utama</p>
                  <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadMedia(file, 'image'); event.currentTarget.value = ''; }} />
                  <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploading !== null} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary px-4 py-3 font-semibold text-primary transition hover:bg-accent-light disabled:opacity-60">
                    <UploadCloud className="h-5 w-5" /> {uploading === 'image' ? 'Mengunggah foto...' : 'Upload foto (maks. 5 MB)'}
                  </button>
                  <Field label="atau URL foto" className="mt-3"><input className={textAreaClassName()} value={formData.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} placeholder="https://..." /></Field>
                  {formData.imageUrl && <img src={formData.imageUrl} alt="Preview foto ucapan" className="mt-3 h-52 w-full rounded-xl border border-border object-cover" />}
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-card-foreground"><Music className="mr-2 inline h-4 w-4" />Musik latar</p>
                  <input ref={audioInputRef} type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadMedia(file, 'audio'); event.currentTarget.value = ''; }} />
                  <button type="button" onClick={() => audioInputRef.current?.click()} disabled={uploading !== null} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary px-4 py-3 font-semibold text-primary transition hover:bg-accent-light disabled:opacity-60">
                    <UploadCloud className="h-5 w-5" /> {uploading === 'audio' ? 'Mengunggah audio...' : 'Upload audio (maks. 15 MB)'}
                  </button>
                  <Field label="atau URL audio langsung" className="mt-3"><input className={textAreaClassName()} value={formData.musicUrl} onChange={(event) => updateField('musicUrl', event.target.value)} placeholder="https://.../musik.mp3" /></Field>
                  <Field label="Judul musik" className="mt-3"><input className={textAreaClassName()} value={formData.musicTitle} onChange={(event) => updateField('musicTitle', event.target.value)} placeholder="Contoh: Graduation Piano" /></Field>
                  <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-foreground">
                    Aktifkan pemutar musik di halaman penerima
                    <input type="checkbox" className="h-5 w-5 accent-primary" checked={formData.musicEnabled} onChange={(event) => updateField('musicEnabled', event.target.checked)} />
                  </label>
                  {formData.musicUrl && <audio className="mt-3 w-full" controls src={formData.musicUrl}>Browser tidak mendukung pemutar audio.</audio>}
                  <p className="mt-3 text-xs leading-relaxed text-foreground">Gunakan audio yang Anda miliki hak pakainya. File dari Spotify atau YouTube tidak dapat diputar langsung sebagai audio latar.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Status publikasi</h2>
                  <p className="mt-1 text-sm text-card-foreground">Saat dipublikasikan, halaman utama dapat dibuka oleh penerima lewat link.</p>
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-secondary px-4 py-3 font-semibold text-foreground">
                  <input type="checkbox" className="h-5 w-5 accent-primary" checked={formData.isPublished} onChange={(event) => updateField('isPublished', event.target.checked)} />
                  {formData.isPublished ? 'Dipublikasikan' : 'Disembunyikan'}
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={saveGreeting} disabled={isSaving || !isDirty} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50">
                <Save className="h-5 w-5" /> {isSaving ? 'Menyimpan...' : isDirty ? 'Simpan perubahan ke Supabase' : 'Tidak ada perubahan'}
              </button>
              <button type="button" onClick={() => setFormData(initialData)} disabled={!isDirty || isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-5 py-4 font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50">
                <RefreshCw className="h-5 w-5" /> Batalkan perubahan
              </button>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg lg:sticky lg:top-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Live preview</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">{formData.recipientName || 'Nama penerima'}</h2>
            <p className="mt-1 text-sm text-foreground">{formData.university || 'Universitas'} · {formData.major || 'Jurusan'}</p>
            {formData.imageUrl && <img src={formData.imageUrl} alt="Preview halaman penerima" className="mt-5 h-44 w-full rounded-xl object-cover" />}
            <div className="mt-5 space-y-4 rounded-xl bg-background p-4">
              <PreviewBlock label="PEMBUKA" value={formData.readyMessage} />
              <PreviewBlock label="PERAYAAN" value={formData.celebrationMessage} />
              <PreviewBlock label="DARI" value={formData.senderName} />
              <PreviewBlock label="STATUS" value={formData.isPublished ? 'Halaman publik aktif' : 'Halaman publik memakai fallback sampai dipublikasikan'} />
            </div>
            <p className="mt-5 text-xs leading-relaxed text-foreground">Setelah disimpan, buka atau refresh halaman penerima untuk memeriksa hasil akhir.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-2 block text-sm font-semibold text-card-foreground">{label}</span>{children}</label>;
}

function PreviewBlock({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] font-bold tracking-[0.16em] text-primary">{label}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">{value || '—'}</p></div>;
}
