'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Heart } from 'lucide-react';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  likes: number;
}

interface GuestbookProps {
  greetingId: string;
}

export function Guestbook({ greetingId }: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([
    {
      id: '1',
      name: 'Teman Baik',
      message: 'Selamat ya! Akhirnya skripsi selesai! 🎉',
      timestamp: 'Hari ini',
      likes: 5,
    },
    {
      id: '2',
      name: 'Keluarga Tersayang',
      message: 'Bangga banget sama kamu! 💕',
      timestamp: 'Kemarin',
      likes: 12,
    },
    {
      id: '3',
      name: 'Mentor',
      message: 'Hasil kerja keras mu! Pertahankan semangat ini! 🚀',
      timestamp: '2 hari lalu',
      likes: 8,
    },
  ]);

  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newMessage.trim()) {
      const newEntry: GuestbookEntry = {
        id: Date.now().toString(),
        name: newName,
        message: newMessage,
        timestamp: 'Baru saja',
        likes: 0,
      };
      setEntries([newEntry, ...entries]);
      setNewName('');
      setNewMessage('');
    }
  };

  const handleLike = (id: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, likes: entry.likes + 1 } : entry
      )
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          📖 Buku Tamu Digital
        </h2>
        <p className="text-secondary-foreground">
          Tinggalkan ucapan dan dukunganmu untuk {'{recipient}'}
        </p>
      </motion.div>

      {/* Form to add entry */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        onSubmit={handleAddEntry}
        className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border-2 border-accent mb-8"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nama kamu"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground placeholder-muted-foreground"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Tulis ucapan atau dukunganmu... 💌"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground placeholder-muted-foreground resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Kirim Ucapan
        </button>
      </motion.form>

      {/* Entries list */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 sm:p-6 shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-foreground text-lg">{entry.name}</h3>
                <p className="text-sm text-secondary-foreground">{entry.timestamp}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLike(entry.id)}
                className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm font-semibold">{entry.likes}</span>
              </motion.button>
            </div>
            <p className="text-foreground leading-relaxed">{entry.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
