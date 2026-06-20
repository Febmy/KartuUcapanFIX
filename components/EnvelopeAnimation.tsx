'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface EnvelopeAnimationProps {
  recipientName: string;
  onOpen: () => void;
}

export function EnvelopeAnimation({ recipientName, onOpen }: EnvelopeAnimationProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
    setTimeout(onOpen, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-red-50 p-4">
      {/* Floating rose petals background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            animate={{
              y: [0, 300, 600],
              x: [0, 100, 0],
              opacity: [1, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: '-20px',
            }}
          >
            🌹
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-bold text-foreground mb-2"
        >
          Hai, <span className="text-primary">{recipientName}!</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-foreground"
        >
          Ada kejutan untukmu... 💝
        </motion.p>
      </div>

      {/* Envelope */}
      <motion.div
        className="cursor-pointer"
        animate={isOpened ? { scale: 0.8, opacity: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-72 h-48 bg-white rounded-lg shadow-2xl border-2 border-primary relative"
          whileHover={{ scale: 1.05 }}
          onClick={handleOpen}
        >
          {/* Envelope flap */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-primary to-primary-dark rounded-lg"
            animate={isOpened ? { rotateX: 120 } : { rotateX: 0 }}
            transition={{ duration: 0.8 }}
            style={{ transformOrigin: 'top', perspective: '1000px' }}
          >
            <div className="absolute inset-2 flex items-center justify-center">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
          </motion.div>

          {/* Envelope body */}
          <div className="absolute inset-0 rounded-lg border border-primary border-t-0 overflow-hidden">
            <div className="w-full h-1/2 bg-gradient-to-b from-primary to-primary-dark" />
          </div>
        </motion.div>
      </motion.div>

      {/* Click instruction */}
      <motion.div
        animate={isOpened ? { scale: 0 } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-12 text-center"
      >
        <motion.p
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-primary font-semibold"
        >
          Klik amplop untuk membuka! 👆
        </motion.p>
      </motion.div>
    </div>
  );
}
