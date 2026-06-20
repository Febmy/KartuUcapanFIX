import { NextResponse } from 'next/server';
import { DEFAULT_GREETING, getGreetingSlug, greetingFromDb, type GreetingDbRow } from '@/lib/greeting';
import { createSupabasePublicClient } from '@/lib/supabase/public';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return NextResponse.json(
      { greeting: DEFAULT_GREETING, mode: 'demo' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const { data, error } = await supabase
    .from('greetings')
    .select('*')
    .eq('slug', getGreetingSlug())
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { greeting: DEFAULT_GREETING, mode: 'fallback', warning: 'Data publik belum dapat dimuat.' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  if (!data) {
    return NextResponse.json(
      { greeting: null, mode: 'empty' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  return NextResponse.json(
    { greeting: greetingFromDb(data as GreetingDbRow), mode: 'live' },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
