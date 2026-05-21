# Game Expansion Design — User System, Leaderboard, Eurovision World & Scalability

## Overview

Expand "Αστέρι της Σκηνής" with multi-user authentication, local leaderboard, parallel world unlocking, a new Eurovision math world, and scalable architecture for future subjects. All changes remain static (GitHub Pages compatible, no backend).

## 1. User Authentication System

### Registration & Login
- On first launch (or no active session), show Login/Register screen
- **Register**: Name (max 20 chars) + password (4-8 chars)
- **Login**: Name + password to access personal progress
- Password stored as SHA-256 hash via Web Crypto API (browser-native, no dependencies)
- Replaces the current `NameEntryScreen`

### Data Storage
- All users stored in localStorage key `asteri-users`:
  ```json
  {
    "Μαρία": { "passwordHash": "a1b2c3...", "progress": {...}, "settings": {...} },
    "Νίκος": { "passwordHash": "d4e5f6...", "progress": {...}, "settings": {...} }
  }
  ```
- Active session: `asteri-active-user` key stores current username
- Max ~10 users per device (practical localStorage limit)

### UI (Greek)
- "Σύνδεση" (Login) / "Εγγραφή" (Register)
- "Όνομα χρήστη" (Username) / "Κωδικός" (Password)
- "Λάθος κωδικός!" (Wrong password!)
- "Αποσύνδεση" (Logout) button on home screen

### Logout Flow
- Clears active session → returns to Login screen
- Progress saved before logout

## 2. World Unlocking — Parallel + Star Gates

### New System (replaces sequential unlock)
| World | Name | Requirement |
|-------|------|-------------|
| 1 | Σαλόνι Ομορφιάς | Free (open) |
| 2 | Σχολή Χορού | Free (open) |
| 3 | Στούντιο Τραγουδιού | Free (open) |
| 4 | Σοκολατένια Όνειρα | Free (open) |
| 5 | Παπαγάλοι & Φίλοι | 20 stars |
| 6 | ΑΕΚ Ακαδημία | 40 stars |
| 7 | Καφετέρια Σταρ | 60 stars |
| 8 | Πάρτι Eurovision | 80 stars |

### Behavior
- Player can freely play any open world in any order
- Stars earned across all worlds count toward gates
- When threshold reached, unlock animation plays automatically
- World Map shows lock + required stars badge: "🔒 20⭐"

## 3. Eurovision World (World 8) — "Πάρτι Eurovision"

### Theme & Visuals
- Setting: Glamorous Eurovision stage/arena
- Colors: `#1a0a5c` (deep stage blue), `#e91e63` (hot pink spotlight), `#ffd700` (gold trophy)
- Floating elements: 🎤🏆🇬🇷🎶✨🎵🌟🎪
- Background: Stage with colored spotlights, country flags, disco lights
- Decorative frame: Stage arch with LED strip border
- Animations: Confetti cannon on correct, spotlight sweep, flag wave

### Music
- Synthesized via Web Audio API (no external audio files needed)
- Style: Mix of Eurovision synth-pop anthem + Greek pop (bouzouki-meets-electronica)
- Upbeat tempo, dramatic builds, crowd cheering accents

### Question Types (All Math)

**Type 1 — Point Calculations (multiplication/division):**
- "Η Ελλάδα πήρε 12 βαθμούς από 5 χώρες. Πόσοι βαθμοί συνολικά;" (12×5=60)
- "Κάθε χώρα δίνει 10 βαθμούς. 8 χώρες ψήφισαν. Πόσοι βαθμοί;" (10×8=80)
- "Η Nemo πήρε 72 βαθμούς από 6 κριτές. Πόσοι ανά κριτή;" (72÷6=12)
- "Το televote έδωσε 4 φορές 12 βαθμούς. Πόσοι βαθμοί;" (4×12=48)
- "Η Marina Satti πήρε 54 βαθμούς από 9 χώρες. Πόσοι ανά χώρα;" (54÷9=6)

**Type 2 — Ranking & Comparisons (subtraction/addition — extends math operations beyond ×÷):**
- "Η Ελβετία πήρε 365 βαθμούς και η Κροατία 287. Πόσους περισσότερους η Ελβετία;" (365-287=78)
- "Η κριτική επιτροπή έδωσε 150 και το televote 215. Πόσοι συνολικά;" (150+215=365)
- "Η Ελλάδα ήταν 11η με 126 βαθμούς. Η 10η είχε 152. Πόση η διαφορά;" (152-126=26)

**Type 3 — Song/Time Calculations (multiplication):**
- "Κάθε τραγούδι διαρκεί 3 λεπτά. Ακούς 8 τραγούδια. Πόσα λεπτά;" (3×8=24)
- "Η πρόβα έχει 6 τραγούδια × 4 λεπτά. Πόσα λεπτά;" (6×4=24)
- "Ο τελικός έχει 26 τραγούδια × 3 λεπτά. Πόσα λεπτά;" (26×3=78)

**Type 4 — Voting Rounds & Schedules (multiplication/division):**
- "Η ψηφοφορία διαρκεί 4 γύρους × 12 λεπτά. Πόσα λεπτά;" (4×12=48)
- "Ψήφισαν 36 χώρες σε 6 γκρουπ. Πόσες χώρες ανά γκρουπ;" (36÷6=6)
- "Κάθε ημιτελικός έχει 9 λεπτά διαφήμιση × 4 διαλείμματα. Πόσα λεπτά;" (9×4=36)

### Real Eurovision 2024/2025 References
- Switzerland (Nemo — "The Code"), Croatia (Baby Lasagna), Ukraine, France, Italy
- Greece (Marina Satti — "Zari" 2024)
- 12-point scoring system, jury + televote split
- Greek pop: Marina Satti, Despina Vandi, Tamta references in flavor text

### Structure
- 5 math levels + 2 dance challenges (same as all worlds)
- Dance challenge themed: "Eurovision dance-off" counting stage moves

## 4. Leaderboard System

### Data Source
- Reads all users from `asteri-users` localStorage
- Ranks by: total stars (primary), accuracy % (secondary)
- Accuracy calculated from `levelResults` (correct/total across all attempts)

### UI
- Accessible from home screen: "🏆 Κατάταξη" button
- Shows: Rank, player name, total stars, accuracy %
- Top 3: 🥇🥈🥉 medals
- Current player highlighted with glow effect
- Animated entrance (players slide in one by one)

### Greek Text
- Title: "Κατάταξη"
- Columns: "Θέση" / "Παίκτης" / "Αστέρια" / "Ακρίβεια"

## 5. Scalable Architecture

### Math Operations Extension
- Current game supports: multiplication, division
- Eurovision world adds: addition, subtraction (for point comparison questions)
- Update `MathOperation` type to: `'multiplication' | 'division' | 'addition' | 'subtraction'`
- Addition/subtraction questions appear at Tier 3+ difficulty in Eurovision world

### Type Changes
- Add `SubjectCategory = 'math' | 'language' | 'history' | 'science'` to types
- Add `subject: SubjectCategory` field to `WorldConfig` (all current worlds: `'math'`)

### Folder Structure
```
src/data/subjects/
├── math/
│   ├── questions.ts (moved from src/data/questions.ts)
│   ├── eurovisionQuestions.ts (new)
│   └── index.ts (barrel export)
└── (future: language/, history/)
```

### Future-Proofing
- When a second subject is added: top-level subject picker appears on home screen
- Each subject has its own world set, shares user system + leaderboard + rewards
- No abstract plugin system — just clean folder organization + type field

## 6. Updated Game Flow

```
Splash → Login/Register → Home → World Map → Level Select → Game → Results
                            ↕           ↑
                       Leaderboard    (parallel world choice)
                       Trophies
                       Settings
                       Logout → Login
```

## 7. Deployment

- Static GitHub Pages (no backend, no Firebase, no API)
- All data in localStorage
- Web Crypto API for password hashing (native browser, zero dependencies)
- Vite build → `gh-pages` branch deployment
- PWA manifest intact
- No new npm dependencies required

## 8. Greek Language Commitment

- All new UI strings in Greek
- Eurovision questions use real 2024/2025 contest data with correct Greek grammar
- Full review of all Greek text (existing + new) for typos and grammar during implementation
