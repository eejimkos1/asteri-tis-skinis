import { createContext, useContext, useRef, useCallback, useEffect, ReactNode } from 'react';
import { Howl } from 'howler';
import { useGame } from './GameContext';
import { WorldId } from '../types';

type SfxName = 'correct' | 'wrong' | 'levelComplete' | 'star' | 'button';

interface AudioContextType {
  playBgMusic: (worldId: WorldId) => void;
  stopBgMusic: () => void;
  playSfx: (name: SfxName) => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

const BG_MUSIC_SRCS: Record<WorldId, string> = {
  beauty: '/maths/audio/bg-beauty.mp3',
  dance: '/maths/audio/bg-dance.mp3',
  singing: '/maths/audio/bg-singing.mp3',
  chocolate: '/maths/audio/bg-chocolate.mp3',
  parrots: '/maths/audio/bg-parrots.mp3',
  aek: '/maths/audio/bg-aek.mp3',
  coffee: '/maths/audio/bg-coffee.mp3',
};

const SFX_SRCS: Record<SfxName, string> = {
  correct: '/maths/audio/correct.mp3',
  wrong: '/maths/audio/wrong.mp3',
  levelComplete: '/maths/audio/level-complete.mp3',
  star: '/maths/audio/star.mp3',
  button: '/maths/audio/button.mp3',
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const { state } = useGame();
  const bgMusicRef = useRef<Howl | null>(null);
  const sfxCache = useRef<Map<SfxName, Howl>>(new Map());

  const { musicEnabled, sfxEnabled, volume } = state.settings;

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume(musicEnabled ? volume : 0);
    }
  }, [musicEnabled, volume]);

  const playBgMusic = useCallback((worldId: WorldId) => {
    if (bgMusicRef.current) {
      bgMusicRef.current.stop();
      bgMusicRef.current.unload();
    }

    const src = BG_MUSIC_SRCS[worldId];
    bgMusicRef.current = new Howl({
      src: [src],
      loop: true,
      volume: musicEnabled ? volume : 0,
      html5: true,
    });
    bgMusicRef.current.play();
  }, [musicEnabled, volume]);

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.fade(bgMusicRef.current.volume(), 0, 500);
      setTimeout(() => {
        bgMusicRef.current?.stop();
        bgMusicRef.current?.unload();
        bgMusicRef.current = null;
      }, 500);
    }
  }, []);

  const playSfx = useCallback((name: SfxName) => {
    if (!sfxEnabled) return;

    let sound = sfxCache.current.get(name);
    if (!sound) {
      sound = new Howl({
        src: [SFX_SRCS[name]],
        volume: volume,
      });
      sfxCache.current.set(name, sound);
    }
    sound.volume(volume);
    sound.play();
  }, [sfxEnabled, volume]);

  useEffect(() => {
    return () => {
      bgMusicRef.current?.stop();
      bgMusicRef.current?.unload();
      sfxCache.current.forEach(s => s.unload());
    };
  }, []);

  return (
    <AudioCtx.Provider value={{ playBgMusic, stopBgMusic, playSfx }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}
