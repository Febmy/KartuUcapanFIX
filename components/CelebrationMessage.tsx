import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationMessageProps {
  recipientName: string;
  celebrationMessage: string;
  onContinue: () => void;
}

export function CelebrationMessage({
  recipientName,
  celebrationMessage,
  onContinue,
}: CelebrationMessageProps) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c1666b', '#d89a9f', '#e8d4d4', '#d4a5a5'],
    });

    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#c1666b', '#d89a9f', '#e8d4d4'],
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-primary-light via-opacity-20 to-accent-light flex items-center justify-center px-4 py-8"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary opacity-30 text-6xl sm:text-7xl"
            animate={{
              y: [-50, -400],
              x: [0, Math.sin(i) * 150],
              opacity: [0.3, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.1,
            }}
            style={{
              left: `${5 + i * 9}%`,
              top: '100%',
            }}
          >
            🌹
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full relative z-10"
      >
        <div className="text-center space-y-6 sm:space-y-8">
          <motion.div
            variants={itemVariants}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-7xl sm:text-8xl"
          >
            🎉
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Cieeee!
            </h1>
            <p className="text-2xl sm:text-3xl text-primary font-semibold">
              {recipientName}
            </p>
            <p className="text-2xl sm:text-3xl text-foreground font-bold">
              sudah sidang skripsi!
            </p>
          </motion.div>

          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-foreground leading-relaxed">
            {celebrationMessage}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-3 sm:gap-4 text-4xl sm:text-5xl"
          >
            <motion.span
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⭐
            </motion.span>
            <motion.span
              animate={{ rotate: [360, 0], scale: [1.2, 1, 1.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              ⭐
            </motion.span>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="inline-block bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 px-8 sm:px-12 rounded-xl hover:shadow-xl transition-all text-lg sm:text-xl mt-4"
          >
            Lanjut ke Ucapan Istimewa →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
