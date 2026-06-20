import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { requireAdmin } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LIMITS = {
  image: 5 * 1024 * 1024,
  audio: 15 * 1024 * 1024,
} as const;

function extensionFor(file: File) {
  const fromName = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  if (fromName) return fromName.slice(0, 12);
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  if (file.type.startsWith('image/')) return 'jpg';
  if (file.type === 'audio/mpeg') return 'mp3';
  if (file.type === 'audio/wav') return 'wav';
  return 'bin';
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'Supabase belum dikonfigurasi.' }, { status: 503 });
  }

  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

    const formData = await request.formData();
    const type = formData.get('type');
    const file = formData.get('file');

    if ((type !== 'image' && type !== 'audio') || !(file instanceof File)) {
      return NextResponse.json({ message: 'Jenis media atau file tidak valid.' }, { status: 422 });
    }

    if (!file.type.startsWith(`${type}/`)) {
      return NextResponse.json({ message: `File harus berupa ${type}.` }, { status: 422 });
    }

    if (file.size === 0 || file.size > LIMITS[type]) {
      const limitInMb = LIMITS[type] / 1024 / 1024;
      return NextResponse.json({ message: `Ukuran file ${type} maksimal ${limitInMb} MB.` }, { status: 422 });
    }

    const objectPath = `${auth.user.id}/${type}/${randomUUID()}.${extensionFor(file)}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error } = await auth.supabase.storage.from('greeting-media').upload(objectPath, bytes, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

    if (error) throw error;

    const { data } = auth.supabase.storage.from('greeting-media').getPublicUrl(objectPath);
    return NextResponse.json({ url: data.publicUrl, path: objectPath });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengunggah media.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
