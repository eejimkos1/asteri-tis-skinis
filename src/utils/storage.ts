import { GameProgress, GameSettings, WorldId } from '../types';

const PROGRESS_KEY = 'asteri-progress';
const SETTINGS_KEY = 'asteri-settings';

const DEFAULT_PROGRESS: GameProgress = {
  totalStars: 0,
  currentTier: 1,
  tierAccuracy: [],
  unlockedWorlds: ['beauty'],
  levelResults: {},
  unlockedRewards: [],
  danceStreaks: 0,
};

const DEFAULT_SETTINGS: GameSettings = {
  musicEnabled: true,
  sfxEnabled: true,
  volume: 0.7,
};

export function loadProgress(): GameProgress {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (data) return { ...DEFAULT_PROGRESS, ...JSON.parse(data) };
  } catch { /* corrupted data */ }
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(progress: GameProgress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function loadSettings(): GameSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch { /* corrupted data */ }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function resetProgress(): void {
  localStorage.removeItem(PROGRESS_KEY);
}

export function getNextWorld(currentWorlds: WorldId[]): WorldId | null {
  const order: WorldId[] = ['beauty', 'dance', 'singing', 'chocolate', 'parrots', 'aek', 'coffee'];
  for (const world of order) {
    if (!currentWorlds.includes(world)) return world;
  }
  return null;
}
