'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Heart, Star } from 'lucide-react';

interface InteractiveLetterProps {
  recipientName: string;
  message: string;
  senderName: string;
  university: string;
  major: string;
  imageUrl?: string;
  onThankYou?: () => void;
}

type Stage = 'intro' | 'selection' | 'revealed';

export function InteractiveLetter({
  recipientName,
  message,
  senderName,
  university,
  major,
  imageUrl,
  onThankYou,
}: InteractiveLetterProps) {
  const [stage, setStage] = useState<Stage>('intro');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasReadLetter, setHasReadLetter] = useState(false);

  const funOptions = [
    {
      id: 'flower',
      icon: '🌹',
      label: 'Bunga Mawar',
      hint: 'Tanda cinta dan kebanggaan',
    },
    {
      id: 'star',
      icon: '⭐',
      label: 'Bintang',
      hint: 'Kamu bersinar terang!',
    },
    {
      id: 'party',
      icon: '🎉',
      label: 'Perayaan',
      hint: 'Mari rayakan kesuksesan!',
    },
    {
      id: 'gift',
      icon: '🎁',
      label: 'Hadiah Spesial',
      hint: 'Kejutan untukmu!',
    },
  ];

  const handleSelectOption = (id: string) => {
    setSelectedOption(id);
    setTimeout(() => {
      setStage('revealed');
      setHasReadLetter(true);
    }, 600);
  };

  const handleBackToSelection = () => {
    setStage('selection');
    setSelectedOption(null);
  };

  return (
    <AnimatePresence mode="wait">
      {stage === 'intro' && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        >
          {/* Floating petals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                animate={{
                  y: [0, 400, 800],
                  x: [0, 150, -50],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
                style={{
                  left: `${15 + i * 12}%`,
                  top: '-30px',
                }}
              >
                🌹
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 max-w-2xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-bold text-foreground mb-3"
            >
              Hai <span className="text-foreground">{recipientName}!</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                🎓 Selamat sudah menyelesaikan sidang skripsi!
              </p>
              <p className="text-base sm:text-lg text-foreground">
                Ada pesan spesial dari orang-orang terkasih...
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12 p-6 sm:p-8 bg-white rounded-2xl shadow-lg border-2 border-accent"
            >
              <p className="text-foreground leading-relaxed mb-4">
                Perjalananmu penuh dengan perjuangan yang mungkin tidak semua orang tahu. Dari revisi, rasa lelah, sampai hari-hari yang tidak mudah, kamu tetap bertahan dan terus melangkah.

Hari ini kamu berhasil sampai di titik yang kamu perjuangkan. Aku benar-benar bangga melihat kamu.
              </p>
              <p className="text-foreground font-semibold italic">
                Pilih satu kejutan kecil di bawah, ada pesan khusus untukmu 💌
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8"
            >
              <p className="text-sm text-secondary-foreground mb-4 font-semibold">
                Pilih simbol yang mewakili perasaanmu:
              </p>
              <button
                onClick={() => setStage('selection')}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full transition-all hover:shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Lanjut →
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {stage === 'selection' && (
        <motion.div
          key="selection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex flex-col items-center justify-center p-4 relative overflow-hidden"
        >
          {/* Floating petals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                animate={{
                  y: [0, 400, 800],
                  x: [0, 150, -50],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
                style={{
                  left: `${15 + i * 12}%`,
                  top: '-30px',
                }}
              >
                🌹
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 max-w-3xl w-full">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-2"
            >
              Pilih Simbolmu 🎨
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center text-foreground mb-12"
            >
              Setiap pilihan membawa makna istimewa untukmu
            </motion.p>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {funOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectOption(option.id)}
                  className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                    selectedOption === option.id
                      ? 'bg-primary scale-105 shadow-2xl'
                      : 'bg-white border-2 border-accent hover:border-primary hover:scale-105'
                  }`}
                >
                  <motion.div
                    animate={
                      selectedOption === option.id
                        ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                        : {}
                    }
                    transition={{ duration: 0.6 }}
                    className="text-5xl mb-3 text-center"
                  >
                    {option.icon}
                  </motion.div>
                  <p
                    className={`font-semibold mb-1 ${
                      selectedOption === option.id ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {option.label}
                  </p>
                  <p
                    className={`text-xs ${
                      selectedOption === option.id
                        ? 'text-white font-medium'
                        : 'text-secondary-foreground'
                    }`}
                  >
                    {option.hint}
                  </p>

                  {selectedOption !== option.id && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 to-primary/0 opacity-0 group-hover:opacity-10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {selectedOption && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-foreground mb-4">
                  Pilihan bagus! Membuka suratmu...
                </p>
              </motion.div>
            )}

            {hasReadLetter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-4 mt-8"
              >
                <button
                  onClick={handleBackToSelection}
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-accent text-foreground font-semibold py-3 px-6 rounded-full transition-all hover:shadow-lg"
                >
                  ← Simbol Lain
                </button>
                <button
                  onClick={onThankYou}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full transition-all hover:shadow-lg"
                >
                  <Heart className="w-5 h-5" />
                  Terima Kasih ❤️
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {stage === 'revealed' && (
        <motion.div
          key="revealed"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-4 sm:p-6"
        >
          <div className="max-w-3xl mx-auto">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleBackToSelection}
              className="mb-4 flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              ← Pilih simbol lain
            </motion.button>
            {/* Letter Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-accent"
            >
              {/* Letter header */}
              <div className="bg-gradient-to-r from-primary to-primary-dark p-6 sm:p-10 text-white">
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl mb-4"
                >
                  💌
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  {recipientName}
                </h2>
                <p className="text-white text-base sm:text-lg font-semibold">
                  Seorang lulusan yang membanggakan bunda, ayah, dan semua yang mencintaimu.
                </p>
              </div>

              {/* Letter body */}
              <div className="p-6 sm:p-10">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-2">
                    Selamat Sudah Menyelesaikan Sidang Skripsi! 🎓
                  </h3>
                  <p className="text-center text-foreground italic">
                    Dari {senderName}
                  </p>
                </motion.div>

                {/* Message content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="bg-rose-50 rounded-2xl p-6 border-l-4 border-primary">
                    <p className="text-foreground leading-relaxed text-lg">
                      {message}
                    </p>
                  </div>
                </motion.div>

                {/* University info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-4 mb-8"
                >
                  <div className="bg-accent-light rounded-xl p-4 text-center">
                    <p className="text-xs text-primary mb-1 font-bold uppercase tracking-wide">
                      UNIVERSITAS
                    </p>
                    <p className="font-bold text-primary text-sm">
                      {university}
                    </p>
                  </div>
                  <div className="bg-accent-light rounded-xl p-4 text-center">
                    <p className="text-xs text-primary mb-1 font-bold uppercase tracking-wide">
                      JURUSAN
                    </p>
                    <p className="font-bold text-primary text-sm">
                      {major}
                    </p>
                  </div>
                </motion.div>

                {/* Photo if available */}
                {imageUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8 rounded-xl overflow-hidden border-2 border-accent shadow-lg"
                  >
                    <img
                      src={imageUrl}
                      alt="Special moment"
                      className="w-full h-auto object-cover max-h-96"
                    />
                  </motion.div>
                )}

                {/* Signature */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mb-8 py-4 border-t border-accent"
                >
                  <p className="text-primary font-bold text-lg mb-2">
                    Dengan penuh kebanggaan,
                  </p>
                  <p className="text-foreground font-semibold">
                    {senderName} 💝
                  </p>
                </motion.div>


              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
