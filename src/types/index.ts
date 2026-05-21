export type SubjectCategory = 'math' | 'language' | 'history' | 'science';

export type WorldId = 'beauty' | 'dance' | 'singing' | 'chocolate' | 'parrots' | 'aek' | 'coffee' | 'eurovision';

export type Screen =
  | 'splash'
  | 'auth'
  | 'home'
  | 'worldMap'
  | 'levelSelect'
  | 'game'
  | 'danceChallenge'
  | 'results'
  | 'trophy'
  | 'settings'
  | 'leaderboard';

export type DanceMove = 'spin' | 'jump' | 'clap' | 'kick' | 'wave';

export type MathOperation = 'multiplication' | 'division' | 'addition' | 'subtraction' | 'trivia';

export interface Question {
  text: string;
  correctAnswer: number;
  options: number[];
  operation: MathOperation;
  tier: number;
  textOptions?: string[];
  correctTextAnswer?: string;
}

export interface DanceSequence {
  moves: DanceMove[];
  targetMove: DanceMove;
  speed: number;
  correctCount: number;
  multiplier?: number;
}

export interface LevelResult {
  worldId: WorldId;
  levelIndex: number;
  stars: number;
  correct: number;
  total: number;
  time: number;
}

export interface WorldConfig {
  id: WorldId;
  name: string;
  icon: string;
  description: string;
  subject: SubjectCategory;
  starsRequired: number;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  floatingElements: string[];
  levelCount: number;
  danceChallengeLevels: number[];
}

export interface Reward {
  id: string;
  name: string;
  starsRequired: number;
  icon: string;
  category: 'αξεσουάρ' | 'ρούχα' | 'τραγούδια' | 'χοροί';
}

export interface GameProgress {
  totalStars: number;
  currentTier: number;
  tierAccuracy: number[];
  unlockedWorlds: WorldId[];
  levelResults: Record<string, LevelResult>;
  unlockedRewards: string[];
  danceStreaks: number;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  volume: number;
}

export interface UserProfile {
  passwordHash: string;
  progress: GameProgress;
  settings: GameSettings;
}
