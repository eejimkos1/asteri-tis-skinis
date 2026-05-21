# Game Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-user authentication, local leaderboard, parallel world unlocking with star gates, Eurovision math world, and scalable architecture for future subjects.

**Architecture:** Minimal refactor approach — add a `UserContext` layer managing user accounts in localStorage with SHA-256 password hashing via Web Crypto API. Extend existing world system with an 8th Eurovision world and change sequential unlock to star-gated parallel access. Restructure question data into `src/data/subjects/math/` for future scalability.

**Tech Stack:** Vite + React 18 + TypeScript + Framer Motion + Web Audio API + Web Crypto API. No new npm dependencies. Static deployment to GitHub Pages.

---

## File Structure Overview

**New files:**
- `src/utils/auth.ts` — password hashing, user CRUD, session management
- `src/context/UserContext.tsx` — React context for user auth state
- `src/components/screens/AuthScreen.tsx` — login/register UI (replaces NameEntryScreen)
- `src/data/subjects/math/eurovisionQuestions.ts` — Eurovision word problems
- `src/data/subjects/math/index.ts` — barrel export for math subject

**Modified files:**
- `src/types/index.ts` — add SubjectCategory, MathOperation expansion, WorldId expansion, UserProfile type
- `src/data/worlds.ts` — add Eurovision world config, add `subject` and `starsRequired` fields
- `src/data/questions.ts` — add Eurovision to WORD_PROBLEMS, support addition/subtraction
- `src/utils/storage.ts` — per-user progress load/save keyed by username
- `src/context/GameContext.tsx` — integrate with UserContext for per-user progress
- `src/components/screens/WorldMap.tsx` — star-gate unlock logic instead of sequential
- `src/components/screens/HomeScreen.tsx` — add logout button, show current user
- `src/components/screens/LeaderboardScreen.tsx` — read from all user profiles
- `src/components/screens/GameScreen.tsx` — update leaderboard with user context
- `src/App.tsx` — wrap with UserProvider, replace NameEntry flow with AuthScreen
- `src/components/screens/SplashScreen.tsx` — navigate to auth instead of home

**Deleted files:**
- `src/components/screens/NameEntryScreen.tsx` — replaced by AuthScreen

---

### Task 1: Expand Types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Update the types file with new types and expanded enums**

Replace the entire contents of `src/types/index.ts` with:

```typescript
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

export type MathOperation = 'multiplication' | 'division' | 'addition' | 'subtraction';

export interface Question {
  text: string;
  correctAnswer: number;
  options: number[];
  operation: MathOperation;
  tier: number;
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
```

- [ ] **Step 2: Verify the project compiles (expect errors in other files — that's fine for now)**

Run: `cd /c/SAPDevelop/maths && npx tsc --noEmit 2>&1 | head -20`

Expected: Type errors in `worlds.ts`, `storage.ts`, etc. because they haven't been updated yet. The types file itself should be valid.

- [ ] **Step 3: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/types/index.ts && git commit -m "feat: expand types with SubjectCategory, Eurovision world, UserProfile, and addition/subtraction operations"
```

---

### Task 2: Auth Utilities

**Files:**
- Create: `src/utils/auth.ts`

- [ ] **Step 1: Create the auth utilities module**

Create `src/utils/auth.ts`:

```typescript
import { UserProfile, GameProgress, GameSettings } from '../types';

const USERS_KEY = 'asteri-users';
const ACTIVE_USER_KEY = 'asteri-active-user';

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

function getAllUsers(): Record<string, UserProfile> {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) return JSON.parse(data);
  } catch { /* corrupted */ }
  return {};
}

function saveAllUsers(users: Record<string, UserProfile>): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function registerUser(name: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = getAllUsers();
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length > 20) {
    return { success: false, error: 'Το όνομα πρέπει να είναι 1-20 χαρακτήρες.' };
  }

  if (password.length < 4 || password.length > 8) {
    return { success: false, error: 'Ο κωδικός πρέπει να είναι 4-8 χαρακτήρες.' };
  }

  if (users[trimmedName]) {
    return { success: false, error: 'Αυτό το όνομα υπάρχει ήδη!' };
  }

  const userCount = Object.keys(users).length;
  if (userCount >= 10) {
    return { success: false, error: 'Μέγιστος αριθμός παικτών (10)!' };
  }

  const passwordHash = await hashPassword(password);
  users[trimmedName] = {
    passwordHash,
    progress: { ...DEFAULT_PROGRESS },
    settings: { ...DEFAULT_SETTINGS },
  };

  saveAllUsers(users);
  localStorage.setItem(ACTIVE_USER_KEY, trimmedName);
  return { success: true };
}

export async function loginUser(name: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = getAllUsers();
  const trimmedName = name.trim();
  const user = users[trimmedName];

  if (!user) {
    return { success: false, error: 'Δεν βρέθηκε αυτό το όνομα!' };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    return { success: false, error: 'Λάθος κωδικός!' };
  }

  localStorage.setItem(ACTIVE_USER_KEY, trimmedName);
  return { success: true };
}

export function logoutUser(): void {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function getActiveUser(): string | null {
  return localStorage.getItem(ACTIVE_USER_KEY);
}

export function getActiveUserProfile(): UserProfile | null {
  const name = getActiveUser();
  if (!name) return null;
  const users = getAllUsers();
  return users[name] || null;
}

export function saveUserProgress(progress: GameProgress): void {
  const name = getActiveUser();
  if (!name) return;
  const users = getAllUsers();
  if (users[name]) {
    users[name].progress = progress;
    saveAllUsers(users);
  }
}

export function saveUserSettings(settings: GameSettings): void {
  const name = getActiveUser();
  if (!name) return;
  const users = getAllUsers();
  if (users[name]) {
    users[name].settings = settings;
    saveAllUsers(users);
  }
}

export interface LeaderboardEntry {
  name: string;
  stars: number;
  accuracy: number;
}

export function getLeaderboardData(): LeaderboardEntry[] {
  const users = getAllUsers();
  return Object.entries(users)
    .map(([name, profile]) => {
      const results = Object.values(profile.progress.levelResults);
      const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
      const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      return { name, stars: profile.progress.totalStars, accuracy };
    })
    .sort((a, b) => b.stars - a.stars || b.accuracy - a.accuracy);
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/utils/auth.ts && git commit -m "feat: add auth utilities with SHA-256 hashing, user CRUD, and leaderboard data"
```

---

### Task 3: User Context

**Files:**
- Create: `src/context/UserContext.tsx`

- [ ] **Step 1: Create UserContext**

Create `src/context/UserContext.tsx`:

```typescript
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  getActiveUser,
  getActiveUserProfile,
  registerUser,
  loginUser,
  logoutUser,
} from '../utils/auth';
import { GameProgress, GameSettings } from '../types';

interface UserContextType {
  currentUser: string | null;
  isAuthenticated: boolean;
  login: (name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getUserProgress: () => GameProgress;
  getUserSettings: () => GameSettings;
}

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

const UserCtx = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(getActiveUser());

  const login = useCallback(async (name: string, password: string) => {
    const result = await loginUser(name, password);
    if (result.success) {
      setCurrentUser(name.trim());
    }
    return result;
  }, []);

  const register = useCallback(async (name: string, password: string) => {
    const result = await registerUser(name, password);
    if (result.success) {
      setCurrentUser(name.trim());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
  }, []);

  const getUserProgress = useCallback((): GameProgress => {
    const profile = getActiveUserProfile();
    return profile?.progress || { ...DEFAULT_PROGRESS };
  }, []);

  const getUserSettings = useCallback((): GameSettings => {
    const profile = getActiveUserProfile();
    return profile?.settings || { ...DEFAULT_SETTINGS };
  }, []);

  return (
    <UserCtx.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      login,
      register,
      logout,
      getUserProgress,
      getUserSettings,
    }}>
      {children}
    </UserCtx.Provider>
  );
}

export function useUser() {
  const context = useContext(UserCtx);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/context/UserContext.tsx && git commit -m "feat: add UserContext for auth state management"
```

---

### Task 4: Auth Screen

**Files:**
- Create: `src/components/screens/AuthScreen.tsx`
- Delete: `src/components/screens/NameEntryScreen.tsx`

- [ ] **Step 1: Create AuthScreen**

Create `src/components/screens/AuthScreen.tsx`:

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';

export function AuthScreen() {
  const { login, register } = useUser();
  const { dispatch } = useGame();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const result = mode === 'login'
      ? await login(name, password)
      : await register(name, password);

    setLoading(false);

    if (result.success) {
      dispatch({ type: 'LOAD_USER' });
      dispatch({ type: 'SET_SCREEN', screen: 'home' });
    } else {
      setError(result.error || 'Κάτι πήγε στραβά!');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim() && password) {
      handleSubmit();
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a0033, #2d0066, #4a0080)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      gap: '20px',
    }}>
      <FloatingElements elements={['✨', '💫', '⭐', '🌟', '💖']} count={10} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{ fontSize: '60px' }}
      >
        ⭐
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '26px',
          background: 'linear-gradient(135deg, #FFD700, #FF6B9D)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {mode === 'login' ? 'Σύνδεση' : 'Εγγραφή'}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          zIndex: 1,
          width: '100%',
          maxWidth: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Όνομα χρήστη"
          maxLength={20}
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid rgba(255, 107, 157, 0.4)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontSize: '16px',
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
            outline: 'none',
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Κωδικός (4-8 χαρακτήρες)"
          maxLength={8}
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid rgba(255, 107, 157, 0.4)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontSize: '16px',
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
            outline: 'none',
          }}
        />
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: '#FF5252', fontSize: '14px', textAlign: 'center', zIndex: 1 }}
        >
          {error}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}
      >
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="large"
          disabled={loading || !name.trim() || !password}
        >
          {loading ? '...' : mode === 'login' ? 'Είσοδος 🎉' : 'Δημιουργία 🎉'}
        </Button>

        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontFamily: 'var(--font-body)',
          }}
        >
          {mode === 'login' ? 'Δεν έχεις λογαριασμό; Εγγραφή' : 'Έχεις ήδη λογαριασμό; Σύνδεση'}
        </button>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Delete NameEntryScreen**

```bash
cd /c/SAPDevelop/maths && rm src/components/screens/NameEntryScreen.tsx
```

- [ ] **Step 3: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/components/screens/AuthScreen.tsx && git add -u && git commit -m "feat: add AuthScreen replacing NameEntryScreen for name+password login"
```

---

### Task 5: Update Worlds Data (add Eurovision + star gates)

**Files:**
- Modify: `src/data/worlds.ts`

- [ ] **Step 1: Replace worlds.ts with expanded version including Eurovision and starsRequired**

Replace the full contents of `src/data/worlds.ts`:

```typescript
import { WorldConfig } from '../types';

export const WORLDS: WorldConfig[] = [
  {
    id: 'beauty',
    name: 'Σαλόνι Ομορφιάς',
    icon: '💄',
    description: 'Ετοιμάσου για τη μεγάλη παράσταση!',
    subject: 'math',
    starsRequired: 0,
    colors: {
      primary: '#FF69B4',
      secondary: '#FFB6C1',
      background: '#FFC0CB',
    },
    floatingElements: ['💄', '💅', '🪞', '💍', '✨', '🌸', '💎'],
    levelCount: 5,
    danceChallengeLevels: [2, 4],
  },
  {
    id: 'dance',
    name: 'Σχολή Χορού',
    icon: '💃',
    description: 'Μάθε χορογραφίες για τον διαγωνισμό!',
    subject: 'math',
    starsRequired: 0,
    colors: {
      primary: '#9B59B6',
      secondary: '#8E44AD',
      background: '#E8DAEF',
    },
    floatingElements: ['💃', '🩰', '🎵', '⭐', '🔮', '🎶', '💜'],
    levelCount: 5,
    danceChallengeLevels: [2, 4],
  },
  {
    id: 'singing',
    name: 'Στούντιο Τραγουδιού',
    icon: '🎤',
    description: 'Ηχογράφησε το άλμπουμ σου!',
    subject: 'math',
    starsRequired: 0,
    colors: {
      primary: '#F39C12',
      secondary: '#FFD700',
      background: '#FFF3CD',
    },
    floatingElements: ['🎤', '🎧', '🎵', '🎶', '📀', '⭐', '🌟'],
    levelCount: 5,
    danceChallengeLevels: [2, 4],
  },
  {
    id: 'chocolate',
    name: 'Σοκολατένια Όνειρα',
    icon: '🍫',
    description: 'Φτιάξε τα πιο γλυκά δημιουργήματα!',
    subject: 'math',
    starsRequired: 0,
    colors: {
      primary: '#D4A574',
      secondary: '#6B3A2A',
      background: '#F5E6D3',
    },
    floatingElements: ['🍫', '🍬', '🧁', '🍩', '🎀', '💝', '🍪'],
    levelCount: 5,
    danceChallengeLevels: [2, 4],
  },
  {
    id: 'parrots',
    name: 'Παπαγάλοι & Φίλοι',
    icon: '🦜',
    description: 'Φρόντισε τους τροπικούς φίλους σου!',
    subject: 'math',
    starsRequired: 20,
    colors: {
      primary: '#00BFA5',
      secondary: '#FF6F00',
      background: '#E8F5E9',
    },
    floatingElements: ['🦜', '🌺', '🌴', '🍃', '🌻', '🦋', '🌈'],
    levelCount: 5,
    danceChallengeLevels: [2, 4],
  },
  {
    id: 'aek',
    name: 'ΑΕΚ Ακαδημία',
    icon: '⚽',
    description: 'Γίνε σταρ στην ακαδημία της ΑΕΚ!',
    subject: 'math',
    starsRequired: 40,
    colors: {
      primary: '#FFD700',
      secondary: '#000000',
      background: '#FFF8E1',
    },
    floatingElements: ['⚽', '🏆', '🥇', '🦅', '💛', '🖤', '⭐'],
    levelCount: 5,
    danceChallengeLevels: [2, 4],
  },
  {
    id: 'coffee',
    name: 'Καφετέρια Σταρ',
    icon: '☕',
    description: 'Διαχειρίσου την πιο trendy καφετέρια!',
    subject: 'math',
    starsRequired: 60,
    colors: {
      primary: '#795548',
      secondary: '#D7CCC8',
      background: '#FFF8E1',
    },
    floatingElements: ['☕', '🥐', '🧋', '🍰', '🫖', '🍪', '🎈'],
    levelCount: 5,
    danceChallengeLevels: [2, 4],
  },
  {
    id: 'eurovision',
    name: 'Πάρτι Eurovision',
    icon: '🎤',
    description: 'Γίνε σταρ της Eurovision!',
    subject: 'math',
    starsRequired: 80,
    colors: {
      primary: '#e91e63',
      secondary: '#1a0a5c',
      background: '#ffd700',
    },
    floatingElements: ['🎤', '🏆', '🇬🇷', '🎶', '✨', '🎵', '🌟', '🎪'],
    levelCount: 5,
    danceChallengeLevels: [2, 4],
  },
];
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/data/worlds.ts && git commit -m "feat: add Eurovision world and star-gate unlock requirements to all worlds"
```

---

### Task 6: Eurovision Questions

**Files:**
- Modify: `src/data/questions.ts`

- [ ] **Step 1: Add Eurovision word problems and support addition/subtraction in the questions file**

Add the Eurovision entry to the `WORD_PROBLEMS` record in `src/data/questions.ts`. First, update the import and the `WordProblemTemplate` interface to support the new operations:

At the top of the file, change the interface:

```typescript
interface WordProblemTemplate {
  text: string;
  answer: number;
  operation: 'multiplication' | 'division' | 'addition' | 'subtraction';
  tier: number;
}
```

Then add the `eurovision` key to `WORD_PROBLEMS` after the `coffee` entry (before the closing `};`):

```typescript
  eurovision: [
    // Point calculations
    { text: 'Η Ελλάδα πήρε 12 βαθμούς από 5 χώρες. Πόσοι βαθμοί συνολικά;', answer: 60, operation: 'multiplication', tier: 2 },
    { text: 'Κάθε χώρα δίνει 10 βαθμούς. 8 χώρες ψήφισαν. Πόσοι βαθμοί;', answer: 80, operation: 'multiplication', tier: 2 },
    { text: 'Η Nemo πήρε 72 βαθμούς από 6 κριτές. Πόσοι ανά κριτή;', answer: 12, operation: 'division', tier: 3 },
    { text: 'Το televote έδωσε 4 φορές 12 βαθμούς. Πόσοι βαθμοί;', answer: 48, operation: 'multiplication', tier: 3 },
    { text: 'Η Marina Satti πήρε 54 βαθμούς από 9 χώρες. Πόσοι ανά χώρα;', answer: 6, operation: 'division', tier: 3 },
    { text: 'Η κριτική επιτροπή έδωσε 7 βαθμούς από 8 χώρες. Πόσοι συνολικά;', answer: 56, operation: 'multiplication', tier: 3 },
    // Ranking & comparisons (addition/subtraction)
    { text: 'Η Ελβετία πήρε 365 βαθμούς και η Κροατία 287. Πόση η διαφορά;', answer: 78, operation: 'subtraction', tier: 4 },
    { text: 'Η κριτική επιτροπή έδωσε 150 βαθμούς και το televote 215. Πόσοι συνολικά;', answer: 365, operation: 'addition', tier: 4 },
    { text: 'Η Ελλάδα πήρε 126 βαθμούς. Η 10η χώρα πήρε 152. Πόση η διαφορά;', answer: 26, operation: 'subtraction', tier: 3 },
    // Song/time calculations
    { text: 'Κάθε τραγούδι διαρκεί 3 λεπτά. Ακούς 8 τραγούδια. Πόσα λεπτά;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: 'Η πρόβα έχει 6 τραγούδια × 4 λεπτά. Πόσα λεπτά συνολικά;', answer: 24, operation: 'multiplication', tier: 2 },
    { text: 'Ο τελικός έχει 26 τραγούδια × 3 λεπτά. Πόσα λεπτά;', answer: 78, operation: 'multiplication', tier: 4 },
    { text: 'Η Ελλάδα τραγούδησε 3 λεπτά. Η πρόβα ήταν 5 φορές. Πόσα λεπτά πρόβας;', answer: 15, operation: 'multiplication', tier: 2 },
    // Voting rounds
    { text: 'Η ψηφοφορία διαρκεί 4 γύρους × 12 λεπτά. Πόσα λεπτά;', answer: 48, operation: 'multiplication', tier: 3 },
    { text: 'Ψήφισαν 36 χώρες σε 6 γκρουπ. Πόσες χώρες ανά γκρουπ;', answer: 6, operation: 'division', tier: 3 },
    { text: 'Κάθε ημιτελικός έχει 9 λεπτά διαφήμιση × 4 διαλείμματα. Πόσα λεπτά;', answer: 36, operation: 'multiplication', tier: 4 },
    { text: 'Στον τελικό ψήφισαν 120 εκατομμύρια. Μοιράστηκαν σε 6 ζώνες. Πόσα ανά ζώνη;', answer: 20, operation: 'division', tier: 4 },
  ],
```

- [ ] **Step 2: Update the `generatePlainQuestion` function to support addition/subtraction for higher tiers**

Add this after the existing `generatePlainQuestion` function (or replace the function body) to handle the new operation types. Actually, since Eurovision uses word problems predominantly and the plain question generator already handles multiplication/division which is the game's focus, we just need to make sure the type system accepts it. The `generatePlainQuestion` function stays as-is (only generates ×÷) — the addition/subtraction questions come exclusively from word problems.

No code change needed here beyond the type update from Step 1.

- [ ] **Step 3: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/data/questions.ts && git commit -m "feat: add Eurovision word problems with point calculations, rankings, song math, and voting rounds"
```

---

### Task 7: Update Storage Utils for Per-User Data

**Files:**
- Modify: `src/utils/storage.ts`

- [ ] **Step 1: Replace storage.ts to load/save per-user progress via auth module**

Replace the full contents of `src/utils/storage.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/utils/storage.ts && git commit -m "refactor: storage utils now load/save per-user via auth module"
```

---

### Task 8: Update GameContext for User Integration

**Files:**
- Modify: `src/context/GameContext.tsx`

- [ ] **Step 1: Replace GameContext.tsx with updated version supporting LOAD_USER action and star-gate unlocks**

Replace the full contents of `src/context/GameContext.tsx`:

```typescript
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

      return {
        ...state,
        screen: 'results',
        progress: {
          ...state.progress,
          totalStars: newTotalStars,
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
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/context/GameContext.tsx && git commit -m "refactor: GameContext uses star-gate unlocking and LOAD_USER action for multi-user support"
```

---

### Task 9: Update WorldMap for Star-Gate UI

**Files:**
- Modify: `src/components/screens/WorldMap.tsx`

- [ ] **Step 1: Replace WorldMap.tsx to show star requirements on locked worlds**

Replace the full contents of `src/components/screens/WorldMap.tsx`:

```typescript
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { WORLDS } from '../../data/worlds';
import { FloatingElements } from '../common/FloatingElements';
import { Button } from '../common/Button';

export function WorldMap() {
  const { state, dispatch } = useGame();
  const { totalStars, levelResults } = state.progress;

  function getWorldProgress(worldId: string): number {
    const completed = Object.keys(levelResults).filter(k => k.startsWith(worldId)).length;
    return Math.round((completed / 5) * 100);
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #0a001a, #1a0033, #0a001a)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <FloatingElements elements={['✨', '🌟', '💫']} count={8} />

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          color: '#FFD700',
          padding: '20px',
          zIndex: 1,
        }}
      >
        Χάρτης Κόσμων 🗺️
      </motion.h2>

      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '380px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '10px 20px 100px',
        zIndex: 1,
      }}>
        {WORLDS.map((world, i) => {
          const isUnlocked = totalStars >= world.starsRequired;
          const progress = getWorldProgress(world.id);

          return (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
            >
              {i > 0 && (
                <div style={{
                  width: '4px',
                  height: '30px',
                  background: isUnlocked
                    ? 'linear-gradient(180deg, #FFD700, #FF6B9D)'
                    : 'rgba(255, 255, 255, 0.1)',
                  margin: '0 auto 10px',
                  borderRadius: '2px',
                }} />
              )}
              <motion.button
                onClick={() => isUnlocked && dispatch({ type: 'SELECT_WORLD', worldId: world.id })}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                animate={isUnlocked ? { boxShadow: [`0 0 20px ${world.colors.primary}40`, `0 0 30px ${world.colors.primary}60`, `0 0 20px ${world.colors.primary}40`] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '100%',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  background: isUnlocked
                    ? `linear-gradient(135deg, ${world.colors.primary}30, ${world.colors.secondary}30)`
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${isUnlocked ? world.colors.primary + '60' : 'rgba(255, 255, 255, 0.1)'}`,
                  backdropFilter: 'blur(10px)',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  color: 'white',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <span style={{ fontSize: '40px', filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                  {isUnlocked ? world.icon : '🔒'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    {world.name}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {isUnlocked
                      ? world.description
                      : `Χρειάζεσαι ${world.starsRequired} ⭐ (έχεις ${totalStars})`}
                  </div>
                  {isUnlocked && progress > 0 && (
                    <div style={{
                      marginTop: '8px',
                      height: '4px',
                      borderRadius: '2px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${world.colors.primary}, ${world.colors.secondary})`,
                        borderRadius: '2px',
                      }} />
                    </div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        zIndex: 2,
      }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="small">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/components/screens/WorldMap.tsx && git commit -m "feat: WorldMap uses star-gate system showing required stars for locked worlds"
```

---

### Task 10: Update HomeScreen with Logout

**Files:**
- Modify: `src/components/screens/HomeScreen.tsx`

- [ ] **Step 1: Replace HomeScreen.tsx to add logout button and use UserContext**

Replace the full contents of `src/components/screens/HomeScreen.tsx`:

```typescript
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { FloatingElements } from '../common/FloatingElements';

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const { currentUser, logout } = useUser();
  const { totalStars } = state.progress;

  const handleLogout = () => {
    logout();
    dispatch({ type: 'SET_SCREEN', screen: 'auth' });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a0033, #2d0066, #1a0033)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      gap: '20px',
    }}>
      <FloatingElements elements={['✨', '💫', '⭐', '🌟', '💖', '🩷', '🎵']} count={15} />

      <motion.div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 215, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span style={{ fontSize: '18px' }}>⭐</span>
        <span style={{ fontFamily: 'var(--font-numbers)', fontSize: '18px', color: '#FFD700' }}>
          {totalStars}
        </span>
      </motion.div>

      <motion.h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '32px',
          background: 'linear-gradient(135deg, #FFD700, #FF6B9D)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          zIndex: 1,
        }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Αστέρι της Σκηνής
      </motion.h1>

      <Avatar size={100} mood="idle" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: '16px',
          opacity: 0.8,
          zIndex: 1,
        }}
      >
        Γεια σου, {currentUser || 'Σταρ'}! ✨
      </motion.p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1, width: '100%', maxWidth: '280px' }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'worldMap' })} variant="primary" size="large">
          ΠΑΙΞΕ! 🎮
        </Button>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'trophy' })} variant="secondary" size="medium">
          Τα Βραβεία μου 🏆
        </Button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'leaderboard' })} variant="secondary" size="small">
            🏅
          </Button>
          <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'settings' })} variant="secondary" size="small">
            ⚙️
          </Button>
          <Button onClick={handleLogout} variant="secondary" size="small">
            🚪
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/components/screens/HomeScreen.tsx && git commit -m "feat: HomeScreen shows current user from UserContext and adds logout button"
```

---

### Task 11: Update LeaderboardScreen to Use Auth Data

**Files:**
- Modify: `src/components/screens/LeaderboardScreen.tsx`

- [ ] **Step 1: Replace LeaderboardScreen.tsx to read from all user profiles**

Replace the full contents of `src/components/screens/LeaderboardScreen.tsx`:

```typescript
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';
import { getLeaderboardData } from '../../utils/auth';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';

export function LeaderboardScreen() {
  const { dispatch } = useGame();
  const { currentUser } = useUser();
  const entries = getLeaderboardData();

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #1a0033, #2d0066)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>
      <FloatingElements elements={['🏆', '🥇', '⭐', '🌟']} count={8} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: '20px',
          zIndex: 1,
        }}
      >
        Κατάταξη 🏆
      </motion.h1>

      <div style={{
        width: '100%',
        maxWidth: '350px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1,
        paddingBottom: '20px',
      }}>
        {entries.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', opacity: 0.7, marginTop: '40px' }}
          >
            Κανένα σκορ ακόμα! Παίξε για να μπεις στη λίστα! 🎮
          </motion.p>
        ) : (
          entries.map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: entry.name === currentUser
                  ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(196, 79, 226, 0.3))'
                  : 'rgba(255, 255, 255, 0.08)',
                border: entry.name === currentUser
                  ? '1px solid rgba(255, 107, 157, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ fontSize: '24px', width: '36px', textAlign: 'center' }}>
                {i < 3 ? medals[i] : `${i + 1}.`}
              </span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: '15px' }}>
                {entry.name}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <span style={{
                  fontFamily: 'var(--font-numbers)',
                  fontSize: '16px',
                  color: '#FFD700',
                }}>
                  {entry.stars} ⭐
                </span>
                <span style={{ fontSize: '11px', opacity: 0.6 }}>
                  {entry.accuracy}% ακρίβεια
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div style={{ zIndex: 1, paddingTop: '10px' }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="medium">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/components/screens/LeaderboardScreen.tsx && git commit -m "feat: LeaderboardScreen reads from all user profiles with accuracy percentage"
```

---

### Task 12: Update GameScreen (remove old leaderboard import)

**Files:**
- Modify: `src/components/screens/GameScreen.tsx`

- [ ] **Step 1: Remove the old `updateLeaderboard` import and call from GameScreen**

In `src/components/screens/GameScreen.tsx`:

1. Remove line 12: `import { updateLeaderboard } from './LeaderboardScreen';`
2. In the `finishLevel` function, remove these 2 lines:
   ```typescript
   const playerName = localStorage.getItem('asteri-player-name') || 'Σταρ';
   updateLeaderboard(playerName, state.progress.totalStars + stars);
   ```

The leaderboard is now computed directly from user profiles, no explicit update needed.

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/components/screens/GameScreen.tsx && git commit -m "refactor: remove old updateLeaderboard call from GameScreen (leaderboard now reads user profiles directly)"
```

---

### Task 13: Update App.tsx with UserProvider and Auth Flow

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace App.tsx with updated routing that uses UserProvider and AuthScreen**

Replace the full contents of `src/App.tsx`:

```typescript
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';
import { UserProvider, useUser } from './context/UserContext';
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { WorldMap } from './components/screens/WorldMap';
import { LevelSelect } from './components/screens/LevelSelect';
import { GameScreen } from './components/screens/GameScreen';
import { DanceChallenge } from './components/screens/DanceChallenge';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { TrophyScreen } from './components/screens/TrophyScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';

function GameRouter() {
  const { state } = useGame();

  const screens: Record<string, JSX.Element> = {
    splash: <SplashScreen />,
    auth: <AuthScreen />,
    home: <HomeScreen />,
    worldMap: <WorldMap />,
    levelSelect: <LevelSelect />,
    game: <GameScreen />,
    danceChallenge: <DanceChallenge />,
    results: <ResultsScreen />,
    trophy: <TrophyScreen />,
    settings: <SettingsScreen />,
    leaderboard: <LeaderboardScreen />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.screen}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        style={{ width: '100%', height: '100%' }}
      >
        {screens[state.screen] || <HomeScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

function AppWithContext() {
  const { state } = useGame();
  const { isAuthenticated } = useUser();

  if (state.screen === 'splash') {
    return <SplashScreen />;
  }

  if (!isAuthenticated && state.screen !== 'auth') {
    return <AuthScreen />;
  }

  return <GameRouter />;
}

export default function App() {
  return (
    <UserProvider>
      <GameProvider>
        <AudioProvider>
          <AppWithContext />
        </AudioProvider>
      </GameProvider>
    </UserProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/App.tsx && git commit -m "feat: App uses UserProvider with auth flow — unauthenticated users see AuthScreen"
```

---

### Task 14: Update SplashScreen Navigation

**Files:**
- Modify: `src/components/screens/SplashScreen.tsx`

- [ ] **Step 1: Update SplashScreen to navigate to 'auth' instead of 'home'**

In `src/components/screens/SplashScreen.tsx`, change line 13:

From:
```typescript
setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'home' }), 500);
```

To:
```typescript
setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'auth' }), 500);
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/components/screens/SplashScreen.tsx && git commit -m "fix: SplashScreen navigates to auth screen instead of directly to home"
```

---

### Task 15: Add Eurovision Music to Audio System

**Files:**
- Modify: `src/utils/synthAudio.ts` (if it exists — need to add Eurovision background music pattern)

- [ ] **Step 1: Check if synthAudio.ts exists and add Eurovision music**

Look for `src/utils/synthAudio.ts` and add a Eurovision music pattern to the `startBackgroundMusic` function. The Eurovision world ID needs to be handled in the switch/map that routes world IDs to music patterns.

Add a case for `'eurovision'` that plays a synth-pop anthem style — energetic tempo (~128 BPM), major key, with dramatic builds. The exact implementation depends on the existing synthAudio.ts structure, but the pattern should match:
- Key: C major / E minor
- Tempo: 128 BPM
- Style: Punchy synth chords, driving beat, ascending melody lines
- Mix: Eurovision power ballad meets Greek pop bouzouki-like tremolo

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/utils/synthAudio.ts && git commit -m "feat: add Eurovision world synthesized background music"
```

---

### Task 16: Add Button disabled prop support

**Files:**
- Modify: `src/components/common/Button.tsx`

- [ ] **Step 1: Check Button component and add disabled prop if not already supported**

The AuthScreen uses `disabled` prop on Button. Check `src/components/common/Button.tsx` — if it doesn't accept a `disabled` prop, add it:

Add `disabled?: boolean;` to the props interface, pass it to the underlying `<motion.button>` element, and reduce opacity when disabled:

```typescript
style={{
  ...existingStyles,
  opacity: disabled ? 0.5 : 1,
  cursor: disabled ? 'not-allowed' : 'pointer',
}}
disabled={disabled}
```

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && git add src/components/common/Button.tsx && git commit -m "feat: Button component supports disabled prop"
```

---

### Task 17: Scalable Architecture — Subject Folder Structure

**Files:**
- Create: `src/data/subjects/math/index.ts`

- [ ] **Step 1: Create the subjects barrel export for future scalability**

Create `src/data/subjects/math/index.ts`:

```typescript
export { generateQuestions } from '../../questions';
export { WORLDS } from '../../worlds';
```

This is a thin wrapper that establishes the folder structure. When a new subject (language, history) is added later, it will get its own folder: `src/data/subjects/language/index.ts` with its own question generator and world configs.

- [ ] **Step 2: Commit**

```bash
cd /c/SAPDevelop/maths && mkdir -p src/data/subjects/math && git add src/data/subjects/math/index.ts && git commit -m "feat: add subjects folder structure for future scalability"
```

---

### Task 18: Build and Verify

**Files:** None (verification only)

- [ ] **Step 1: Run TypeScript type checking**

```bash
cd /c/SAPDevelop/maths && npx tsc --noEmit
```

Expected: No errors (or only non-blocking warnings)

- [ ] **Step 2: Run the dev server and verify it loads**

```bash
cd /c/SAPDevelop/maths && npx vite --port 5173 &
```

Then check in a browser that:
1. Splash screen appears and transitions to Auth screen
2. Can register a new user with name + password
3. Can log in with that user
4. Home screen shows the username and logout button
5. World Map shows first 4 worlds open, remaining locked with star requirements
6. Eurovision world visible at position 8 (locked, needs 80 stars)
7. Leaderboard shows registered users
8. Logout returns to Auth screen

- [ ] **Step 3: Run a production build**

```bash
cd /c/SAPDevelop/maths && npm run build
```

Expected: Build succeeds with output in `dist/`

- [ ] **Step 4: Commit any remaining fixes**

```bash
cd /c/SAPDevelop/maths && git add -A && git commit -m "fix: resolve build issues from expansion integration"
```

---

### Task 19: Greek Text Review

**Files:** All modified screens

- [ ] **Step 1: Review all Greek text across modified files for grammar and spelling**

Check these strings are correct Greek:
- AuthScreen: "Σύνδεση", "Εγγραφή", "Όνομα χρήστη", "Κωδικός (4-8 χαρακτήρες)", "Είσοδος", "Δημιουργία", "Δεν έχεις λογαριασμό; Εγγραφή", "Έχεις ήδη λογαριασμό; Σύνδεση"
- Auth errors: "Το όνομα πρέπει να είναι 1-20 χαρακτήρες.", "Ο κωδικός πρέπει να είναι 4-8 χαρακτήρες.", "Αυτό το όνομα υπάρχει ήδη!", "Μέγιστος αριθμός παικτών (10)!", "Δεν βρέθηκε αυτό το όνομα!", "Λάθος κωδικός!"
- WorldMap locked text: "Χρειάζεσαι 20 ⭐ (έχεις 5)"
- Leaderboard: "Κατάταξη", "ακρίβεια"
- Eurovision world: "Πάρτι Eurovision", "Γίνε σταρ της Eurovision!"
- All Eurovision questions for correct grammar

- [ ] **Step 2: Fix any Greek text issues found**

- [ ] **Step 3: Commit**

```bash
cd /c/SAPDevelop/maths && git add -A && git commit -m "fix: review and correct Greek text across all screens"
```

---

### Task 20: Deploy to GitHub Pages

**Files:** None (deployment only)

- [ ] **Step 1: Build for production**

```bash
cd /c/SAPDevelop/maths && npm run build
```

- [ ] **Step 2: Deploy**

```bash
cd /c/SAPDevelop/maths && npm run deploy
```

- [ ] **Step 3: Verify live site**

Visit `https://eejimkos1.github.io/asteri-tis-skinis/` and verify:
1. Auth flow works (register + login)
2. Game loads with correct user progress
3. World map shows star gates correctly
4. Eurovision world appears (locked at 80 stars)
5. Leaderboard shows all registered users
6. All Greek text displays correctly
7. Music plays for Eurovision world when unlocked

- [ ] **Step 4: Final commit to master**

```bash
cd /c/SAPDevelop/maths && git add -A && git push origin master
```
