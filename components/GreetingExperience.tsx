'use client';

import { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play } from 'lucide-react';
import { CelebrationMessage } from '@/components/CelebrationMessage';
import { InteractiveLetter } from '@/components/InteractiveLetter';
import { MotivationMessage } from '@/components/MotivationMessage';
import { NameInput } from '@/components/NameInput';
import { ReadyConfirmation } from '@/components/ReadyConfirmation';
import { DEFAULT_GREETING, type GreetingRecord } from '@/lib/greeting';

type Stage = 'name' | 'ready' | 'celebration' | 'letter' | 'motivation';

export function GreetingExperience() {
  const [stage, setStage] = useState<Stage>('name');
  const [userName, setUserName] = useState('');
  const [data, setData] = useState<GreetingRecord>(DEFAULT_GREETING);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showMusicHint, setShowMusicHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const hasMusic = data.musicEnabled && Boolean(data.musicUrl);

  const playMusic = async () => {
    if (!hasMusic || !audioRef.current) return;

    try {
      audioRef.current.volume = 0.65;
      await audioRef.current.play();
      setIsMusicPlaying(true);
      setShowMusicHint(false);
    } catch {
      setIsMusicPlaying(false);
      setShowMusicHint(true);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      void playMusic();
      return;
    }

    audioRef.current.pause();
    setIsMusicPlaying(false);
  };

  useEffect(() => {
    const loadGreeting = async () => {
      try {
        const response = await fetch('/api/public/greeting', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = (await response.json()) as { greeting?: GreetingRecord | null; mode?: string };
        if (payload.mode === 'empty') {
          setIsUnavailable(true);
          return;
        }
        if (payload.greeting) {
          setData(payload.greeting);
          setIsUnavailable(false);
        }
      } catch {
        // The fallback content is intentionally displayed if the API is unavailable.
      }
    };

    void loadGreeting();
  }, []);

  const handleNameSubmit = (name: string) => {
    setUserName(name.trim() || data.recipientName);
    setStage('ready');
    void playMusic();
  };

  const continueWithMusic = (nextStage: Stage) => {
    setStage(nextStage);
    void playMusic();
  };

  if (isUnavailable) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-background via-accent-light to-background p-6 text-center">
        <section className="max-w-lg rounded-2xl border-2 border-primary/20 bg-card p-8 shadow-xl">
          <p className="text-5xl">🎓</p>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Ucapan belum dipublikasikan</h1>
          <p className="mt-3 leading-relaxed text-card-foreground">Halaman ini sedang disiapkan. Silakan buka kembali setelah pengirim mempublikasikan ucapannya.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-background">
      {hasMusic && (
        <>
          <audio
            ref={audioRef}
            src={data.musicUrl}
            loop
            preload="auto"
            onPlay={() => setIsMusicPlaying(true)}
            onPause={() => setIsMusicPlaying(false)}
          />
          {stage !== 'name' && (
            <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center sm:left-auto sm:right-5">
              <div className="flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-primary/30 bg-card/95 px-4 py-3 text-card-foreground shadow-xl backdrop-blur sm:max-w-sm">
                <Music className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{data.musicTitle || 'Musik Latar'}</p>
                  {showMusicHint && (
                    <p className="text-[11px] font-medium text-muted-foreground">Tekan play untuk mulai musik</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={toggleMusic}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-white shadow transition hover:bg-primary-dark"
                  aria-label={isMusicPlaying ? 'Jeda musik' : 'Putar musik'}
                >
                  {isMusicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {stage === 'name' && <NameInput onContinue={handleNameSubmit} defaultName={data.recipientName} />}

      {stage === 'ready' && (
        <ReadyConfirmation
          recipientName={userName}
          readyMessage={data.readyMessage}
          onContinue={() => continueWithMusic('celebration')}
        />
      )}

      {stage === 'celebration' && (
        <CelebrationMessage
          recipientName={userName}
          celebrationMessage={data.celebrationMessage}
          onContinue={() => continueWithMusic('letter')}
        />
      )}

      {stage === 'letter' && (
        <InteractiveLetter
          recipientName={userName}
          message={data.letterMessage}
          senderName={data.senderName}
          university={data.university}
          major={data.major}
          imageUrl={data.imageUrl}
          onThankYou={() => continueWithMusic('motivation')}
        />
      )}

      {stage === 'motivation' && (
        <MotivationMessage
          recipientName={userName}
          motivationMessage={data.motivationMessage}
        />
      )}
    </main>
  );
}
