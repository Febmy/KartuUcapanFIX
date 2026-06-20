'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const mockPhotos: Photo[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=400&fit=crop',
      caption: 'Momen sidang skripsi',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1608889467537-0f02349e612e?w=400&h=400&fit=crop',
      caption: 'Graduation photo',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1536992475277-e0c4d90ab0db?w=400&h=400&fit=crop',
      caption: 'Bersama keluarga',
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      caption: 'Selfie sukses!',
    },
  ];

  const displayPhotos = photos.length > 0 ? photos : mockPhotos;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          📸 Galeri Momen Spesial
        </h2>
        <p className="text-foreground">
          Kenang-kenangan berharga dari perjalanan kuliah mu
        </p>
      </motion.div>

      {/* Gallery grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {displayPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer relative group"
            onClick={() => setSelectedIndex(index)}
          >
            {/* Image container */}
            <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden shadow-lg border-2 border-accent">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover"
              />

              {/* Hover overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
              >
                <span className="text-white font-semibold text-sm sm:text-base text-center px-2">
                  👁️ Lihat
                </span>
              </motion.div>

              {/* Rose corner decoration */}
              <div className="absolute top-1 right-1 text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                🌹
              </div>
            </div>

            {/* Caption */}
            <p className="mt-2 text-center text-xs sm:text-sm text-secondary-foreground truncate">
              {photo.caption}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-screen flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute -top-8 -right-8 sm:-top-12 sm:-right-12 z-10 bg-white rounded-full p-2 hover:bg-accent-light transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>

              {/* Main image */}
              <div className="flex-1 flex items-center justify-center bg-black rounded-lg overflow-hidden">
                <motion.img
                  src={displayPhotos[selectedIndex].url}
                  alt={displayPhotos[selectedIndex].caption}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-screen object-contain"
                />
              </div>

              {/* Caption and navigation */}
              <div className="bg-white rounded-lg mt-4 p-4 flex items-center justify-between">
                <p className="font-semibold text-foreground">
                  {displayPhotos[selectedIndex].caption}
                </p>
                <p className="text-muted-foreground text-sm">
                  {selectedIndex + 1} / {displayPhotos.length}
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-4 mt-4 justify-center">
                <button
                  onClick={() =>
                    setSelectedIndex(
                      selectedIndex === 0 ? displayPhotos.length - 1 : selectedIndex - 1
                    )
                  }
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors font-semibold"
                >
                  ← Sebelumnya
                </button>
                <button
                  onClick={() =>
                    setSelectedIndex(
                      selectedIndex === displayPhotos.length - 1 ? 0 : selectedIndex + 1
                    )
                  }
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors font-semibold"
                >
                  Berikutnya →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
