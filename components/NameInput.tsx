import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface NameInputProps {
  onContinue: (name: string) => void;
  defaultName: string;
}

export function NameInput({ onContinue, defaultName }: NameInputProps) {
  const [name, setName] = useState(defaultName);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setShowError(true);
      return;
    }
    onContinue(name);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-accent-light to-background flex items-center justify-center px-4 py-8"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary opacity-20 text-6xl"
            animate={{
              y: [0, -100],
              x: [0, Math.sin(i) * 50],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${20 + i * 15}%`,
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
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary border-opacity-20">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-center mb-6"
          >
            <span className="text-5xl">🌹</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-2">
            Halo!
          </h1>

          <p className="text-center text-foreground mb-8">
            Sebelum kami memberikan ucapan istimewa, siapa nama kamu?
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (showError) setShowError(false);
                }}
                placeholder="Masukkan nama kamu di sini..."
                className="w-full px-4 py-3 rounded-xl border-2 border-accent placeholder-muted-foreground/50 focus:border-primary focus:outline-none transition-colors text-foreground bg-background"
                autoFocus
              />
              {showError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-primary mt-2"
                >
                  Nama harus minimal 2 karakter
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Lanjutkan
            </motion.button>
          </form>

          <p className="text-xs text-secondary-foreground text-center mt-6">
            Kami siap memberikan kejutan spesial untuk kamu!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
