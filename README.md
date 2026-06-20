# Graduation Greeting Website

Web ucapan sidang skripsi interaktif dengan halaman publik dan dashboard admin terproteksi. Data admin disimpan di Supabase sehingga dapat muncul di perangkat penerima melalui link yang sama.

## Fitur

- Alur ucapan interaktif: nama → kejutan → perayaan → amplop/surat → semangat revisi.
- Admin login menggunakan Supabase Auth.
- Konten ucapan, foto, musik, dan status publikasi disimpan ke Supabase PostgreSQL.
- Upload foto dan audio ke Supabase Storage.
- Halaman penerima mengambil data terbaru melalui API tanpa cache browser.
- Proteksi akses admin menggunakan email admin + Row Level Security.

## Mulai cepat

```bash
npm install
cp .env.example .env.local
# Isi variabel Supabase pada .env.local
npm run dev
```

Baca [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) sebelum deploy.

## URL penting

| URL | Fungsi |
| --- | --- |
| `/` | Halaman ucapan untuk penerima |
| `/login` | Login admin |
| `/admin` | Dashboard pengelolaan konten |

## Validasi sebelum deploy

```bash
npm run lint
npm run build
```
