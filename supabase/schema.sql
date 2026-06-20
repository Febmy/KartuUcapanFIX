-- Graduation Greeting Website — Supabase schema
-- Run this once in Supabase Dashboard > SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.greetings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  recipient_name text not null check (char_length(recipient_name) <= 120),
  university text not null default '',
  major text not null default '',
  ready_message text not null default '',
  celebration_message text not null default '',
  letter_message text not null default '',
  sender_name text not null default '',
  motivation_message text not null default '',
  image_url text,
  music_url text,
  music_title text,
  music_enabled boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists greetings_public_lookup_idx
  on public.greetings (slug, is_published, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists greetings_set_updated_at on public.greetings;
create trigger greetings_set_updated_at
before update on public.greetings
for each row execute function public.set_updated_at();

alter table public.greetings enable row level security;

-- A recipient can only read greetings that are published.
drop policy if exists "Public reads published greetings" on public.greetings;
create policy "Public reads published greetings"
on public.greetings
for select
to anon, authenticated
using (is_published = true);

-- The signed-in owner can read and manage their own greeting, including drafts.
drop policy if exists "Owner reads own greeting" on public.greetings;
create policy "Owner reads own greeting"
on public.greetings
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "Owner inserts own greeting" on public.greetings;
create policy "Owner inserts own greeting"
on public.greetings
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "Owner updates own greeting" on public.greetings;
create policy "Owner updates own greeting"
on public.greetings
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Owner deletes own greeting" on public.greetings;
create policy "Owner deletes own greeting"
on public.greetings
for delete
to authenticated
using ((select auth.uid()) = owner_id);

-- Storage bucket for the photo and legal background music uploaded from /admin.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'greeting-media',
  'greeting-media',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can view files that are intentionally public in the greeting.
drop policy if exists "Public reads greeting media" on storage.objects;
create policy "Public reads greeting media"
on storage.objects
for select
to public
using (bucket_id = 'greeting-media');

-- Admin uploads under their own auth.uid() folder only.
drop policy if exists "Authenticated users upload own greeting media" on storage.objects;
create policy "Authenticated users upload own greeting media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'greeting-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Authenticated users update own greeting media" on storage.objects;
create policy "Authenticated users update own greeting media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'greeting-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'greeting-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Authenticated users delete own greeting media" on storage.objects;
create policy "Authenticated users delete own greeting media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'greeting-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
