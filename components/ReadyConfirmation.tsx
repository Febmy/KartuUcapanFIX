import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ReadyConfirmationProps {
  recipientName: string;
  readyMessage: string;
  onContinue: () => void;
}

export function ReadyConfirmation({
  recipientName,
  readyMessage,
  onContinue,
}: ReadyConfirmationProps) {
  const [notReadyClicks, setNotReadyClicks] = useState(0);
  const [notReadyPosition, setNotReadyPosition] = useState({ x: 0, y: 0 });

  const moveNotReadyButton = () => {
    setNotReadyPosition({
      x: Math.random() * 160 - 80,
      y: Math.random() * 120 - 60,
    });
  };

  const handleNotReadyClick = () => {
    const nextClicks = notReadyClicks + 1;
    setNotReadyClicks(nextClicks);
    if (nextClicks >= 5) {
      onContinue();
      return;
    }
    moveNotReadyButton();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-accent-light to-background flex items-center justify-center px-4 py-8"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary opacity-20 text-5xl"
            animate={{
              y: [0, -150],
              x: [0, Math.cos(i) * 100],
              opacity: [0.2, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${10 + i * 10}%`,
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
        transition={{ delay: 0.2 }}
        className="max-w-lg w-full relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-12 border-2 border-primary border-opacity-20">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-center text-foreground mb-2"
          >
            Hai, {recipientName}!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-center text-foreground mb-8"
          >
            {readyMessage}
          </motion.p>

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center mb-8"
          >
            <span className="text-6xl">💌</span>
          </motion.div>

          <div className="flex flex-row gap-4 relative min-h-12">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onContinue}
              className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base"
            >
              <Heart className="w-5 h-5" />
              Sudah Siap!
            </motion.button>

            <motion.button
              animate={notReadyClicks > 0 ? notReadyPosition : { x: 0, y: 0 }}
              onMouseEnter={moveNotReadyButton}
              onClick={handleNotReadyClick}
              className="absolute top-0 right-0 w-24 bg-accent hover:bg-accent-light text-foreground font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center text-base border-2 border-foreground border-opacity-20"
            >
              Belum
            </motion.button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground text-center mt-8"
          >
            {notReadyClicks > 0 && notReadyClicks < 5
              ? `Hehe, tombol ini bisa lari loh! 😄 (${5 - notReadyClicks - 1} lagi dipaksa siap)`
              : 'Percaya deh, ucapan kami istimewa untuk kamu!'}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
