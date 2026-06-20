export interface GreetingData {
  recipientName: string;
  university: string;
  major: string;
  readyMessage: string;
  celebrationMessage: string;
  letterMessage: string;
  senderName: string;
  motivationMessage: string;
  imageUrl: string;
  musicUrl: string;
  musicTitle: string;
  musicEnabled: boolean;
}

export interface GreetingRecord extends GreetingData {
  id?: string;
  slug?: string;
  isPublished: boolean;
  updatedAt?: string;
}

export interface GreetingDbRow {
  id: string;
  slug: string;
  owner_id: string;
  recipient_name: string;
  university: string;
  major: string;
  ready_message: string;
  celebration_message: string;
  letter_message: string;
  sender_name: string;
  motivation_message: string;
  image_url: string | null;
  music_url: string | null;
  music_title: string | null;
  music_enabled: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_GREETING: GreetingRecord = {
  recipientName: 'Ayisha Salsabila',
  university: 'Nama kampus kamu apa sih? ',
  major: 'Wah jurusannya apa?',
  readyMessage: 'Sudah siap menerima kejutan kecil untuk sidang skripsimu?',
  celebrationMessage: 'Selamat sidang skripsi! Kamu berhasil sampai di hari yang sudah lama diperjuangkan Cantik!!!. 🎓',
  letterMessage:
    'Ayisha, hari ini bukan cuma tentang kamu berhasil melewati sidang skripsi. Hari ini adalah bukti bahwa kamu mampu bertahan di hari-hari yang melelahkan, penuh revisi, ragu, kurang tidur, dan tekanan yang tidak semua orang tahu.\n\nAku tahu perjalananmu sampai di titik ini tidak mudah. Karena itu, aku benar-benar bangga melihat kamu berhasil menyelesaikannya. Bukan hanya karena akhirnya kamu sidang, tetapi karena kamu tidak menyerah ketika semuanya terasa berat.\n\nMungkin sekarang kita sudah berjalan di jalan masing-masing. Tetapi ada satu hal yang tidak berubah: aku tetap percaya kamu adalah seseorang yang kuat, hebat, dan mampu melakukan banyak hal besar dalam hidupmu.\n\nSelamat sidang skripsi, Aysiah. Terima kasih karena sudah bertahan sejauh ini. Aku tulus mendoakan yang terbaik untukmu.',
  senderName: 'Siapa yaaaa',
  motivationMessage:
    'Dan setelah hari ini, mungkin masih ada revisi yang menunggu untuk diselesaikan. Tapi jangan melihatnya sebagai beban yang menghapus pencapaianmu hari ini. Revisi hanyalah satu langkah terakhir dari perjalanan panjang yang sudah berhasil kamu lewati dengan luar biasa.\n\nPelan-pelan saja, satu per satu. Aku percaya kamu pasti bisa menyelesaikannya dengan baik. Semangat revisinya, Aysiah. Sedikit lagi, dan semua perjuanganmu akan benar-benar sampai pada garis akhirnya. 💪✨',
  imageUrl: 'https://images.unsplash.com/photo-1608889467537-0f02349e612e?w=1200&h=900&fit=crop',
  musicUrl: '',
  musicTitle: '',
  musicEnabled: false,
  isPublished: true,
};

export const EDITABLE_GREETING_FIELDS = [
  'recipientName',
  'university',
  'major',
  'readyMessage',
  'celebrationMessage',
  'letterMessage',
  'senderName',
  'motivationMessage',
  'imageUrl',
  'musicUrl',
  'musicTitle',
  'musicEnabled',
  'isPublished',
] as const;

export type EditableGreetingField = (typeof EDITABLE_GREETING_FIELDS)[number];

export function greetingFromDb(row: GreetingDbRow): GreetingRecord {
  return {
    id: row.id,
    slug: row.slug,
    recipientName: row.recipient_name,
    university: row.university,
    major: row.major,
    readyMessage: row.ready_message,
    celebrationMessage: row.celebration_message,
    letterMessage: row.letter_message,
    senderName: row.sender_name,
    motivationMessage: row.motivation_message,
    imageUrl: row.image_url ?? '',
    musicUrl: row.music_url ?? '',
    musicTitle: row.music_title ?? '',
    musicEnabled: row.music_enabled,
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

export function greetingToDb(data: GreetingData & Partial<Pick<GreetingRecord, 'isPublished'>>) {
  return {
    recipient_name: data.recipientName,
    university: data.university,
    major: data.major,
    ready_message: data.readyMessage,
    celebration_message: data.celebrationMessage,
    letter_message: data.letterMessage,
    sender_name: data.senderName,
    motivation_message: data.motivationMessage,
    image_url: data.imageUrl || null,
    music_url: data.musicUrl || null,
    music_title: data.musicTitle || null,
    music_enabled: data.musicEnabled,
    is_published: data.isPublished ?? true,
  };
}

export function getGreetingSlug() {
  return process.env.GREETING_SLUG?.trim() || 'aysiah-sidang';
}

function asString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function sanitizeGreetingPayload(payload: unknown): GreetingData & Pick<GreetingRecord, 'isPublished'> {
  const value = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;

  return {
    recipientName: asString(value.recipientName, 120),
    university: asString(value.university, 180),
    major: asString(value.major, 180),
    readyMessage: asString(value.readyMessage, 500),
    celebrationMessage: asString(value.celebrationMessage, 1_000),
    letterMessage: asString(value.letterMessage, 10_000),
    senderName: asString(value.senderName, 160),
    motivationMessage: asString(value.motivationMessage, 5_000),
    imageUrl: asString(value.imageUrl, 2_000),
    musicUrl: asString(value.musicUrl, 2_000),
    musicTitle: asString(value.musicTitle, 250),
    musicEnabled: value.musicEnabled === true,
    isPublished: value.isPublished !== false,
  };
}
