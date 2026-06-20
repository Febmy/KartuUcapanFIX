import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MotivationMessageProps {
  recipientName: string;
  motivationMessage: string;
}

export function MotivationMessage({
  recipientName,
  motivationMessage,
}: MotivationMessageProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-primary-dark via-foreground to-primary-dark flex items-center justify-center px-4 py-8"
    >
      {/* Decorative petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-accent opacity-30 text-5xl sm:text-6xl"
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
        <div className="bg-card rounded-2xl shadow-2xl p-8 sm:p-12 border-2 border-primary space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">
              Tunggu, {recipientName}!
            </h2>
            <p className="text-lg text-card-foreground font-medium">Aku punya satu hal lagi untuk kamu...</p>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7 }}
            className="h-1 bg-gradient-to-r from-primary via-primary-light to-primary rounded-full origin-left"
          />

          {/* Main message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-4"
          >
            <p className="text-lg sm:text-xl text-card-foreground leading-relaxed whitespace-pre-wrap font-medium">
              {motivationMessage}
            </p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
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

          {/* Footer message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-r from-primary-light to-accent-light bg-opacity-20 rounded-xl p-4 sm:p-6"
          >
            <p className="text-center text-foreground font-semibold flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              aku percaya pada sama kamu!
              <Heart className="w-5 h-5 text-primary" />
            </p>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
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
