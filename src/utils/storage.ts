import { GameProgress, GameSettings, WorldId } from '../types';
import { getActiveUserProfile, saveUserProgress, saveUserSettings } from './auth';
import { WORLDS } from '../data/worlds';

const DEFAULT_PROGRESS: GameProgress = {
  totalStars: 0,
  currentTier: 1,
  tierAccuracy: [],
  unlockedWorlds: ['beauty', 'dance', 'singing', 'chocolate'],
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
  const profile = getActiveUserProfile();
  if (profile) {
    return { ...DEFAULT_PROGRESS, ...profile.progress };
  }
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(progress: GameProgress): void {
  saveUserProgress(progress);
}

export function loadSettings(): GameSettings {
  const profile = getActiveUserProfile();
  if (profile) {
    return { ...DEFAULT_SETTINGS, ...profile.settings };
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: GameSettings): void {
  saveUserSettings(settings);
}

export function resetProgress(): void {
  saveUserProgress({ ...DEFAULT_PROGRESS });
}

export function getNextWorld(currentWorlds: WorldId[]): WorldId | null {
  for (const world of WORLDS) {
    if (!currentWorlds.includes(world.id)) return world.id;
  }
  return null;
}

export function getUnlockedWorlds(totalStars: number): WorldId[] {
  return WORLDS
    .filter(w => totalStars >= w.starsRequired)
    .map(w => w.id);
}
