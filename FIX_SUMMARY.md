# Fix Summary — Admin to User Data Flow

## Root cause fixed

Versi sebelumnya menyimpan data admin di Zustand + browser `localStorage`. Karena `localStorage` hanya hidup di perangkat/browser yang sama, halaman penerima tidak pernah melihat perubahan dari admin lain.

## What changed

- Removed local-only data store from the active app flow.
- Added Supabase PostgreSQL as the persistent source of truth.
- Added Supabase Storage for uploaded images and audio.
- Added protected `/login` and `/admin` flow using Supabase Auth.
- Added `ADMIN_EMAIL` guard to allow only one configured admin account.
- Added public `/api/public/greeting` route with `Cache-Control: no-store`.
- Added secure admin APIs for reading, saving, and uploading media.
- Added database, RLS, storage bucket, and storage policies in `supabase/schema.sql`.
- Added an unpublished state: when admin turns off publication, recipients see a “Ucapan belum dipublikasikan” page instead of the actual content.
- Removed obsolete local-store implementation and outdated deployment documentation.

## Verification completed

```text
npm run lint      PASS
npx tsc --noEmit  PASS
npm run build     PASS
```

See `SUPABASE_SETUP.md` for setup and deployment steps.
