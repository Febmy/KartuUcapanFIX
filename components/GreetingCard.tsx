'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Share2, MessageSquare, Heart } from 'lucide-react';

interface GreetingCardProps {
  recipientName: string;
  senderName: string;
  message: string;
  university: string;
  major: string;
  imageUrl?: string;
}

export function GreetingCard({
  recipientName,
  senderName,
  message,
  university,
  major,
  imageUrl,
}: GreetingCardProps) {
  function triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c1666b', '#d89a9f', '#e8d4d4', '#d4a5a5'],
    });
  }

  useEffect(() => {
    const timer = window.setTimeout(triggerConfetti, 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Animated header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.h1
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground mb-2"
          >
            🎓 Selamat Sidang Skripsi! 🎓
          </motion.h1>
          <p className="text-lg text-foreground">Berhasil dengan gemilang, {recipientName}!</p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-accent mb-6"
        >
          {/* Card header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark p-6 sm:p-8 text-white">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl sm:text-6xl mb-4"
            >
              🌹
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {recipientName}
            </h2>
            <p className="text-foreground text-sm sm:text-base">
              {university} • {major}
            </p>
          </div>

          {/* Card body */}
          <div className="p-6 sm:p-8">
            {/* University info badge */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-accent-light rounded-lg p-4 text-center">
                <p className="text-xs text-primary mb-1">UNIVERSITAS</p>
                <p className="font-semibold text-foreground text-sm line-clamp-2">
                  {university}
                </p>
              </div>
              <div className="bg-accent-light rounded-lg p-4 text-center">
                <p className="text-xs text-primary mb-1">JURUSAN</p>
                <p className="font-semibold text-foreground text-sm line-clamp-2">
                  {major}
                </p>
              </div>
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-foreground leading-relaxed italic border-l-4 border-primary pl-4 py-2">
                &ldquo;{message}&rdquo;
              </p>
              <p className="text-right text-primary font-semibold mt-4">— {senderName}</p>
            </motion.div>

            {/* Photo section */}
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-6 rounded-xl overflow-hidden border-2 border-accent"
              >
                <img
                  src={imageUrl}
                  alt="Greeting photo"
                  className="w-full h-auto object-cover max-h-96"
                />
              </motion.div>
            )}

            {/* Achievement badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8, type: 'spring' }}
              className="bg-gradient-to-br from-primary to-primary-dark rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <span className="text-5xl">✓</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={triggerConfetti}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-full transition-all hover:shadow-lg"
          >
            <Heart className="w-5 h-5" />
            Rayakan! 🎉
          </button>
          <button className="flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary hover:bg-accent-light font-semibold py-3 px-6 rounded-full transition-all">
            <Share2 className="w-5 h-5" />
            Bagikan
          </button>
          <button className="flex items-center justify-center gap-2 bg-white border-2 border-accent text-primary hover:bg-accent-light font-semibold py-3 px-6 rounded-full transition-all">
            <MessageSquare className="w-5 h-5" />
            Guestbook
          </button>
        </motion.div>
      </div>
    </div>
  );
}
