import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth';
import {
  DEFAULT_GREETING,
  getGreetingSlug,
  greetingFromDb,
  greetingToDb,
  sanitizeGreetingPayload,
  type GreetingDbRow,
} from '@/lib/greeting';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

function unavailableResponse() {
  return NextResponse.json(
    { message: 'Supabase belum dikonfigurasi. Isi environment variable terlebih dahulu.' },
    { status: 503 },
  );
}

async function getOwnedGreeting(userId: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('greetings')
    .select('*')
    .eq('slug', getGreetingSlug())
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as GreetingDbRow | null;
}

async function createGreeting(userId: string, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('greetings')
    .insert({ owner_id: userId, slug: getGreetingSlug(), ...greetingToDb(DEFAULT_GREETING) })
    .select('*')
    .single();

  if (error) throw error;
  return data as GreetingDbRow;
}

export async function GET() {
  if (!isSupabaseConfigured()) return unavailableResponse();

  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

    let greeting = await getOwnedGreeting(auth.user.id, auth.supabase);
    if (!greeting) greeting = await createGreeting(auth.user.id, auth.supabase);

    return NextResponse.json({ greeting: greetingFromDb(greeting) }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memuat data ucapan.';
    const status = message.toLowerCase().includes('duplicate') ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) return unavailableResponse();

  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

    const rawPayload = await request.json();
    const payload = sanitizeGreetingPayload(rawPayload);

    if (!payload.recipientName || !payload.letterMessage || !payload.senderName) {
      return NextResponse.json(
        { message: 'Nama penerima, isi surat, dan nama pengirim wajib diisi.' },
        { status: 422 },
      );
    }

    let existing = await getOwnedGreeting(auth.user.id, auth.supabase);
    if (!existing) {
      existing = await createGreeting(auth.user.id, auth.supabase);
    }

    const { data, error } = await auth.supabase
      .from('greetings')
      .update(greetingToDb(payload))
      .eq('id', existing.id)
      .eq('owner_id', auth.user.id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ greeting: greetingFromDb(data as GreetingDbRow) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan data ucapan.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
