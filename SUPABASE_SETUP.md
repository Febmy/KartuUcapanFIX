# Supabase + Deploy Setup

Project ini sekarang memakai **Supabase sebagai single source of truth**. Admin menyimpan data ke tabel `greetings`; halaman penerima mengambil data publik dari API setiap kali dibuka atau di-refresh. Artinya perubahan dari `/admin` tidak lagi hanya tersimpan di browser admin.

## 1. Buat project Supabase

1. Buka Supabase dan buat project baru.
2. Buka **SQL Editor**.
3. Copy seluruh isi `supabase/schema.sql`, lalu klik **Run**.
4. Buka **Authentication > Users** dan tambahkan satu user dengan email dan password admin.
5. Bila Anda belum mengonfigurasi layanan email, buat user dengan status email terkonfirmasi agar bisa login menggunakan password.

## 2. Tambahkan environment variable

Duplikasi `.env.example` menjadi `.env.local`, lalu isi nilainya:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
ADMIN_EMAIL=alamat-email-admin-yang-sama-dengan-supabase-auth
GREETING_SLUG=aysiah-sidang
```

Gunakan **Publishable key** dari Supabase Project Settings > Data API. Jika project lama Anda hanya menampilkan anon key, gunakan nama `NEXT_PUBLIC_SUPABASE_ANON_KEY` sebagai pengganti publishable key; project ini mendukung keduanya.

## 3. Jalankan lokal

```bash
npm install
npm run dev
```

- Halaman penerima: `http://localhost:3000/`
- Login admin: `http://localhost:3000/login`
- Dashboard admin: `http://localhost:3000/admin`

Saat admin pertama kali membuka dashboard, aplikasi akan membuat satu data greeting dengan slug dari `GREETING_SLUG`. Jangan mengganti `GREETING_SLUG` setelah konten sudah dibuat, kecuali Anda memang ingin membuat ucapan publik baru.

## 4. Deploy ke Vercel

1. Upload project ini ke GitHub.
2. Import repository di Vercel.
3. Masuk ke **Settings > Environment Variables**.
4. Masukkan empat nilai environment di atas untuk Production, Preview, dan Development.
5. Deploy ulang.
6. Buka `/login`, masuk dengan user Supabase, lalu edit konten di `/admin`.

## Alur yang sudah diperbaiki

```text
/admin (admin terautentikasi)
      ↓ simpan / upload media
Supabase PostgreSQL + Storage
      ↓ API publik tanpa cache
/ (halaman penerima)
```

## Keamanan

- Halaman publik hanya bisa membaca ucapan yang `is_published = true`.
- Akses admin membutuhkan login Supabase.
- `ADMIN_EMAIL` membatasi dashboard ke satu akun tertentu.
- Database dan Storage memakai Row Level Security (RLS).
- Tidak diperlukan `SUPABASE_SERVICE_ROLE_KEY`, sehingga tidak ada kunci sensitif yang perlu ditaruh di browser atau Vercel.

## Catatan musik

Unggah hanya file musik yang Anda mempunyai izin pakai. Audio dari Spotify, YouTube, dan platform streaming lain tidak bisa dipakai langsung sebagai `src` musik latar.
