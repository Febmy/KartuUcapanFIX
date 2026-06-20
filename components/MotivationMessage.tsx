import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MotivationMessageProps {
  recipientName: string;
  motivationMessage: string;
}

const compliments = [
  'Revisi itu cuma boss terakhir. Kamu sudah punya semua bekal buat menang.',
  'Hari ini bukti kalau kamu lebih kuat dari rasa capekmu.',
  'Pelan-pelan saja. Satu halaman, satu napas, satu langkah lagi.',
  'Kamu tidak harus sempurna untuk tetap membanggakan.',
  'Kalau hari ini terasa berat, ingat: kamu sudah melewati yang kemarin.',
];

export function MotivationMessage({
  recipientName,
  motivationMessage,
}: MotivationMessageProps) {
  const [complimentIndex, setComplimentIndex] = useState(0);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const isScratchRevealed = scratchProgress >= 100;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.3 },
        colors: ['#c1666b', '#d89a9f'],
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isScratchRevealed) return;

    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#c1666b', '#d89a9f', '#e8d4d4'],
    });
  }, [isScratchRevealed]);

  const addScratchProgress = () => {
    setScratchProgress((progress) => Math.min(100, progress + 14));
  };

  const handlePointerMove = () => {
    if (!isScratching || isScratchRevealed) return;
    addScratchProgress();
  };

  const showNextCompliment = () => {
    setComplimentIndex((index) => (index + 1) % compliments.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-primary-dark via-foreground to-primary-dark flex items-center justify-center px-4 py-8"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-accent opacity-30 text-6xl"
            animate={{
              y: [0, -200],
              x: [0, Math.sin(i) * 80],
              opacity: [0.15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
            style={{
              left: `${15 + i * 12}%`,
              top: '100%',
            }}
          >
            🌹
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-2xl w-full relative z-10"
      >
        <div className="bg-card rounded-2xl shadow-2xl p-12 border-2 border-primary space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-3"
          >
            <h2 className="text-4xl font-bold text-primary">
              Tunggu, {recipientName}!
            </h2>
            <p className="text-lg text-card-foreground font-medium">Aku punya satu hal lagi untuk kamu...</p>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7 }}
            className="h-1 bg-gradient-to-r from-primary via-primary-light to-primary rounded-full origin-left"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-4"
          >
            <p className="text-xl text-card-foreground leading-relaxed whitespace-pre-wrap font-medium">
              {motivationMessage}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="rounded-2xl border-2 border-primary/20 bg-rose-50 p-5"
          >
            <p className="mb-3 text-center text-sm font-bold text-primary">
              Kartu kecil buat kamu
            </p>
            <div
              role="button"
              tabIndex={0}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setIsScratching(true);
                addScratchProgress();
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={() => setIsScratching(false)}
              onPointerCancel={() => setIsScratching(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') addScratchProgress();
              }}
              className="relative min-h-36 select-none overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-white p-5 text-center outline-none touch-none"
              aria-label="Gosok kartu untuk membuka pesan"
            >
              <div className="flex min-h-24 items-center justify-center">
                <p className="text-lg font-semibold leading-relaxed text-foreground">
                  Kamu boleh bangga sama dirimu sendiri hari ini. Aku juga bangga, sungguh.
                </p>
              </div>

              {!isScratchRevealed && (
                <motion.div
                  animate={{ opacity: Math.max(0.15, 1 - scratchProgress / 100) }}
                  className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary via-primary-dark to-foreground px-5 text-white"
                >
                  <div>
                    <Sparkles className="mx-auto mb-2 h-7 w-7" />
                    <p className="text-base font-bold">Gosok / tekan untuk buka pesan</p>
                    <div className="mt-3 h-2 w-44 max-w-full overflow-hidden rounded-full bg-white/25">
                      <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{ width: `${scratchProgress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 }}
            className="rounded-2xl border border-accent bg-background p-4 text-center"
          >
            <p className="mb-3 text-sm font-semibold text-primary">Butuh semangat lagi?</p>
            <motion.p
              key={complimentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-14 text-base font-medium leading-relaxed text-foreground"
            >
              {compliments[complimentIndex]}
            </motion.p>
            <button
              type="button"
              onClick={showNextCompliment}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              <RefreshCw className="h-4 w-4" />
              Kasih semangat lagi
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25 }}
            className="flex justify-center gap-4 text-4xl"
          >
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💪
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ rotate: [0, -20, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              🎯
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35 }}
            className="bg-gradient-to-r from-primary-light to-accent-light bg-opacity-20 rounded-xl p-6"
          >
            <p className="text-center text-foreground font-semibold flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              aku percaya sama kamu!
              <Heart className="w-5 h-5 text-primary" />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.45 }}
            className="text-center"
          >
            <p className="text-sm text-foreground font-medium mb-4">
              Semangat mengerjakan revisinya! Kamu pasti bisa! 🚀
            </p>
            <p className="text-xs text-foreground font-medium">
              Ucapan ini dibuat dengan penuh cinta dan doa untuk kesuksesanmu.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
