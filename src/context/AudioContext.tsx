import { createContext, useContext, useCallback, useEffect, ReactNode } from 'react';
import { useGame } from './GameContext';
import { WorldId } from '../types';
import {
  playCorrectSound,
  playWrongSound,
  playStarSound,
  playLevelCompleteSound,
  playButtonSound,
  startBackgroundMusic,
  stopBackgroundMusic,
} from '../utils/synthAudio';

type SfxName = 'correct' | 'wrong' | 'levelComplete' | 'star' | 'button';

interface AudioContextType {
  playBgMusic: (worldId: WorldId) => void;
  stopBgMusic: () => void;
  playSfx: (name: SfxName) => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

const SFX_MAP: Record<SfxName, () => void> = {
  correct: playCorrectSound,
  wrong: playWrongSound,
  levelComplete: playLevelCompleteSound,
  star: playStarSound,
  button: playButtonSound,
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const { state } = useGame();
  const { musicEnabled, sfxEnabled, volume } = state.settings;

  const playBgMusic = useCallback((worldId: WorldId) => {
    if (musicEnabled) {
      startBackgroundMusic(worldId, volume * 0.15);
    }
  }, [musicEnabled, volume]);

  const stopBgMusic = useCallback(() => {
    stopBackgroundMusic();
  }, []);

  const playSfx = useCallback((name: SfxName) => {
    if (sfxEnabled) {
      SFX_MAP[name]();
    }
  }, [sfxEnabled]);

  useEffect(() => {
    if (!musicEnabled) {
      stopBackgroundMusic();
    }
  }, [musicEnabled]);

  useEffect(() => {
    return () => {
      stopBackgroundMusic();
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
