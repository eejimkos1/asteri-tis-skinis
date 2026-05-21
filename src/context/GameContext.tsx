import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameProgress, GameSettings, Screen, WorldId, LevelResult } from '../types';
import { loadProgress, saveProgress, loadSettings, saveSettings, getUnlockedWorlds } from '../utils/storage';
import { REWARDS } from '../data/rewards';

interface GameState {
  screen: Screen;
  progress: GameProgress;
  settings: GameSettings;
  currentWorld: WorldId | null;
  currentLevel: number;
  isDanceChallenge: boolean;
}

type GameAction =
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'SELECT_WORLD'; worldId: WorldId }
  | { type: 'SELECT_LEVEL'; level: number; isDance: boolean }
  | { type: 'COMPLETE_LEVEL'; result: LevelResult }
  | { type: 'COMPLETE_DANCE'; correct: boolean }
  | { type: 'UPDATE_TIER'; tier: number }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'RESET_PROGRESS' }
  | { type: 'LOAD_USER' };

function checkNewRewards(totalStars: number, currentRewards: string[]): string[] {
  const newRewards = [...currentRewards];
  for (const reward of REWARDS) {
    if (totalStars >= reward.starsRequired && !newRewards.includes(reward.id)) {
      newRewards.push(reward.id);
    }
  }
  return newRewards;
}

function calculateTier(levelResults: Record<string, LevelResult>): number {
  const completedLevels = Object.values(levelResults).length;
  const totalCorrect = Object.values(levelResults).reduce((s, r) => s + r.correct, 0);
  const totalQuestions = Object.values(levelResults).reduce((s, r) => s + r.total, 0);
  const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

  if (completedLevels >= 20 && accuracy >= 0.7) return 5;
  if (completedLevels >= 14 && accuracy >= 0.65) return 4;
  if (completedLevels >= 8 && accuracy >= 0.6) return 3;
  if (completedLevels >= 4 && accuracy >= 0.5) return 2;
  return 1;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'LOAD_USER':
      return {
        ...state,
        progress: loadProgress(),
        settings: loadSettings(),
      };

    case 'SELECT_WORLD':
      return { ...state, currentWorld: action.worldId, screen: 'levelSelect' };

    case 'SELECT_LEVEL':
      return {
        ...state,
        currentLevel: action.level,
        isDanceChallenge: action.isDance,
        screen: action.isDance ? 'danceChallenge' : 'game',
      };

    case 'COMPLETE_LEVEL': {
      const { result } = action;
      const key = `${result.worldId}-${result.levelIndex}`;
      const existing = state.progress.levelResults[key];
      const prevStars = existing ? existing.stars : 0;
      const starGain = Math.max(0, result.stars - prevStars);

      const newTotalStars = state.progress.totalStars + starGain;
      const newResults = { ...state.progress.levelResults, [key]: result };
      const newRewards = checkNewRewards(newTotalStars, state.progress.unlockedRewards);
      const newUnlockedWorlds = getUnlockedWorlds(newTotalStars);
      const newTier = calculateTier(newResults);

      return {
        ...state,
        screen: 'results',
        progress: {
          ...state.progress,
          totalStars: newTotalStars,
          currentTier: newTier,
          levelResults: newResults,
          unlockedRewards: newRewards,
          unlockedWorlds: newUnlockedWorlds,
        },
      };
    }

    case 'COMPLETE_DANCE': {
      const starGain = action.correct ? 1 : 0;
      const newStreaks = action.correct ? state.progress.danceStreaks + 1 : 0;
      const newTotalStars = state.progress.totalStars + starGain;
      return {
        ...state,
        screen: 'results',
        progress: {
          ...state.progress,
          totalStars: newTotalStars,
          danceStreaks: newStreaks,
          unlockedRewards: checkNewRewards(newTotalStars, state.progress.unlockedRewards),
          unlockedWorlds: getUnlockedWorlds(newTotalStars),
        },
      };
    }

    case 'UPDATE_TIER':
      return {
        ...state,
        progress: { ...state.progress, currentTier: action.tier },
      };

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings };
      return { ...state, settings: newSettings };
    }

    case 'RESET_PROGRESS':
      return {
        ...state,
        progress: {
          totalStars: 0,
          currentTier: 1,
          tierAccuracy: [],
          unlockedWorlds: ['beauty', 'dance', 'singing', 'chocolate'],
          levelResults: {},
          unlockedRewards: [],
          danceStreaks: 0,
        },
      };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    screen: 'splash',
    progress: loadProgress(),
    settings: loadSettings(),
    currentWorld: null,
    currentLevel: 0,
    isDanceChallenge: false,
  });

  useEffect(() => {
    saveProgress(state.progress);
  }, [state.progress]);

  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
