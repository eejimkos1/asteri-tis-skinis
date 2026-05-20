# "Αστέρι της Σκηνής" (Star of the Stage) — Game Design Spec

## Overview

A mobile-friendly web math game for an 11-year-old Greek girl to practice multiplication and division through adventure/story levels themed around beauty, dancing, and singing. Hosted on GitHub Pages. All UI in Greek.

## Target User

- 11-year-old girl living in Greece
- Still learning multiplication tables and division
- Interests: beauty, dancing, singing
- Device: phone/tablet (mobile-first)
- Language: Greek (all text, UI, problems, feedback)

## Platform & Tech Stack

- **Vite + React 18** with TypeScript
- **Framer Motion** for animations
- **Howler.js** for audio/music management
- **CSS Modules** with CSS custom properties for theming
- **localStorage** for progress persistence
- **GitHub Pages** deployment via `gh-pages` package
- **PWA manifest** — installable on phone home screen
- **Responsive:** 375px+ width (iPhone SE and up)
- **No backend** — purely client-side

## Game Concept

She is an aspiring star progressing through 7 themed worlds to become the ultimate performer. Solving math problems earns stars, unlocks outfits/accessories, and advances the story. Between regular levels, interactive dance counting challenges appear. Worlds cover: beauty, dance, singing, chocolate, parrots, AEK football, and coffee shops — all things she loves!

## Worlds & Levels

### World 1: Σαλόνι Ομορφιάς (Beauty Salon)
- 5 math levels + 2 dance challenges between them
- Theme: Preparing for a big show
- Math context: Beauty tasks (counting hair clips, nail polish, gems, bracelets)
- Visual: Pink marble, gold veins, vanity mirror frames, floating lipstick/brushes/mirrors

### World 2: Σχολή Χορού (Dance Academy)
- 5 math levels + 2 dance challenges between them
- Theme: Learning dance routines for a competition
- Math context: Choreography counting (steps, formations, repeats)
- Visual: Purple gradients, disco ball reflections, stage curtains, spotlights, animated dance floor

### World 3: Στούντιο Τραγουδιού (Singing Studio)
- 5 math levels + 2 dance challenges between them
- Theme: Recording an album
- Math context: Music math (notes per line, verses, chorus repeats)
- Visual: Gold/amber gradients, sound wave visualization, "ON AIR" sign, equalizer bars

### World 4: Σοκολατένια Ονειρα (Chocolate Dreams)
- 5 math levels + 2 dance challenges between them
- Theme: Running a magical chocolate factory/patisserie
- Math context: Counting chocolates, dividing truffles, making boxes of sweets
- Visual: Rich brown & rose-gold gradients, melting chocolate drips, floating bonbons, sprinkles, golden wrappers, cocoa dust particles
- Background music: Sweet jazzy café tune with xylophone and soft bells

### World 5: Παπαγάλοι & Φίλοι (Parrots & Friends)
- 5 math levels + 2 dance challenges between them
- Theme: Taking care of a tropical parrot sanctuary
- Math context: Feeding parrots, counting feathers, organizing cages, parrot tricks
- Visual: Tropical greens, teals, sunset oranges. Animated parrots with colorful feathers, palm leaves, tropical flowers floating. Jungle vine borders.
- Background music: Tropical upbeat tune with bird chirps and steel drums

### World 6: ΑΕΚ — Ποδοσφαιρική Ακαδημία (AEK Football Academy)
- 5 math levels + 2 dance challenges between them
- Theme: Training at AEK's youth academy to become a football star
- Math context: Goals, passes, team formations, match stats, points
- Visual: Black & yellow (AEK colors!) gradients, football pitch background, animated footballs, stadium lights, crowd silhouettes, AEK eagle motif
- Background music: Stadium anthem energy — drums, claps, crowd cheering rhythm

### World 7: Καφετέρια Σταρ (Star Coffee Shop)
- 5 math levels + 2 dance challenges between them
- Theme: Managing the trendiest coffee shop in Athens
- Math context: Serving customers, counting pastries, making drinks, organizing tables
- Visual: Warm cream & caramel tones, coffee bean floating elements, latte art swirls, pastry display cases, cozy café lighting, steam effects
- Background music: Chill lo-fi café beats with acoustic guitar and coffee machine ambient sounds

## Music & Sound System

### Background Music Per World
- **Beauty Salon:** Soft sparkly lo-fi pop — gentle piano with chime accents
- **Dance Academy:** Upbeat K-pop style instrumental — rhythmic, energetic
- **Singing Studio:** Dreamy synth-pop with vocal "aaah" harmonies
- **Chocolate Dreams:** Sweet jazzy café tune — xylophone, soft bells, playful pizzicato strings
- **Parrots & Friends:** Tropical upbeat — steel drums, bird chirps, marimba, bossa nova rhythm
- **AEK Football Academy:** Stadium anthem energy — powerful drums, crowd claps, electric guitar riffs, whistle accents
- **Star Coffee Shop:** Chill lo-fi café beats — acoustic guitar, coffee machine ambient, soft vinyl crackle

Music implemented via Howler.js with Web Audio API synthesized tones + embedded compressed .mp3 clips (total <500KB).

### Sound Effects
| Event | Sound |
|-------|-------|
| Correct answer | Magical chime + sparkle burst |
| Wrong answer | Soft gentle "oops" (never harsh) |
| Level complete | Triumphant fanfare + applause |
| Star earned | Individual "pling!" per star |
| Button tap | Soft bubble pop |
| World unlock | Grand orchestral swell + confetti |
| Heart lost | Gentle "womp" |
| Timer low (last 5s) | Soft heartbeat rhythm |
| Dance move | Rhythmic "swoosh" on beat |

### Music Controls
- Mute/unmute toggle always visible (top bar)
- Volume slider in settings screen
- Music auto-plays after first user interaction (browser policy compliance)

## Dance Counting Mini-Game

### Gameplay
1. Full-width stage view with spotlight appears
2. Animated CSS dancer performs a sequence of moves on beat with music
3. Player counts specific moves (spins, jumps, claps, kicks)
4. After sequence ends, answer prompt: "Πόσες περιστροφές έκανε;" (How many spins?)
5. Harder versions combine counting with multiplication: "3 σειρές × 4 βήματα = ;"

### Dance Animations (CSS keyframe sequences)
- **Spin:** Figure rotates 360° with dress flare effect
- **Jump:** Bounce up with shadow shrinking below
- **Clap:** Hands together with sparkle burst
- **Kick:** Leg extends with whoosh trail
- **Wave:** Arms flow side to side with ribbon trail

### Difficulty Progression
- Early: Slow movements, single move type to count (e.g., count the jumps)
- Mid: Faster sequences, must distinguish between move types
- Late: Fast sequences + multiplication ("She did that set 3 times, how many total?")

### Beat Sync
- Moves happen on beat with background music
- Visual pulse on background syncs with rhythm
- Beat indicator dots light up at bottom of screen

## Visual Design System

### Aesthetic
"Barbie meets K-pop" — glossy, iridescent, dreamy pastels with gold accents. Holographic sticker feel, lip gloss shine, aurora borealis gradients.

### Color Palette
| Element | Value |
|---------|-------|
| Primary gradient | `#FF6B9D` → `#C44FE2` (hot pink → purple) |
| Secondary gradient | `#FFD700` → `#FF8C00` (gold → amber) |
| Beauty world | `#FFB6C1`, `#FF69B4`, `#FFC0CB` |
| Dance world | `#9B59B6`, `#8E44AD`, `#E8DAEF` |
| Singing world | `#F39C12`, `#FFD700`, `#FFF3CD` |
| Chocolate world | `#6B3A2A`, `#D4A574`, `#F5E6D3` (browns & rose-gold) |
| Parrots world | `#00BFA5`, `#FF6F00`, `#E8F5E9` (teal & sunset) |
| AEK world | `#000000`, `#FFD700`, `#FFF8E1` (black & yellow) |
| Coffee world | `#795548`, `#D7CCC8`, `#FFF8E1` (warm browns & cream) |
| Background base | `#1a0033` (deep purple-black) |
| Text | White with subtle text-shadow glow |
| Success | `#00E676` with sparkle |
| Error | `#FF5252` (soft, not aggressive) |

### Typography (Google Fonts, Greek support)
- **Headings:** "Pacifico" or "Dancing Script" — curvy, playful
- **Body/Questions:** "Comfortaa" — rounded, modern, readable in Greek
- **Numbers/Math:** "Fredoka One" — bold, bubbly

### Animations (Framer Motion + CSS)

**Correct Answer:**
- Button glows green
- 20+ confetti particles burst (hearts, stars, musical notes)
- Avatar does happy dance (bounce + spin)
- "+1 ⭐" floats up and fades
- Background pulses brighter briefly

**Wrong Answer:**
- Button gently shakes
- Avatar gives encouraging gesture
- Soft pink glow (not red/scary)
- Text: "Δεν πειράζει! Προσπάθησε ξανά! 💪"

**Level Complete:**
- Full-screen confetti explosion (50+ particles)
- Stars fly in one by one with "pling pling pling"
- Triumphant music flourish
- Unlock animation (golden chest opens)

**Idle/Ambient:**
- Floating sparkles drifting across background (always)
- Subtle parallax on background with device tilt (gyroscope API)
- Avatar blinks, sways, occasionally waves

**Page Transitions:**
- Slide + fade with sparkle trail between screens

### Background Details Per World

**Beauty Salon:**
- Floating semi-transparent elements: lipstick, mirrors, brushes, clips, perfume
- Pink marble texture with gold veins
- Ornate gold mirror frame around question card
- Vanity mirror bulb glow around edges

**Dance Academy:**
- Floating elements: musical notes, ballet shoes, stars, spotlights
- Dark purple with rotating disco ball rainbow dots
- Stage curtains on left/right
- Spotlight cone from top, floor reflection below
- Animated color-pulsing dance floor tiles

**Singing Studio:**
- Floating elements: microphones, headphones, sound waves, vinyl records
- Gold/amber gradient with sound wave visualization
- Recording booth window aesthetic
- "ON AIR" sign glow, animated equalizer bars at bottom

**Chocolate Dreams:**
- Floating elements: chocolate bonbons, cocoa beans, sprinkles, candy wrappers, hearts
- Rich brown-to-rose-gold gradient with melting chocolate drip effect at top
- Decorative frame: Chocolate box border with gold ribbon bow
- Light effects: Warm golden glow, cocoa powder dust particles floating
- Interactive: Chocolate pieces "melt" when answers are correct

**Parrots & Friends:**
- Floating elements: colorful feathers, tropical flowers, seeds, small birds
- Teal-to-sunset-orange gradient with jungle leaf overlay
- Decorative frame: Vine and tropical flower border
- Light effects: Dappled sunlight through leaves, firefly-like sparkles
- Animated parrots on branches that react to correct answers (dance, flap, squawk)

**AEK Football Academy:**
- Floating elements: footballs, whistles, yellow cards, trophies, boots
- Black-to-yellow gradient (AEK signature colors) with stadium field texture
- Decorative frame: Stadium arch with floodlights
- Light effects: Stadium spotlights, camera flashes on correct answers
- Animated: Crowd wave effect on level completion, goal net ripple on correct answer

**Star Coffee Shop:**
- Floating elements: coffee cups, croissants, coffee beans, sugar cubes, macarons
- Warm cream-to-caramel gradient with coffee stain ring art
- Decorative frame: Café chalkboard menu border with chalk-style ornaments
- Light effects: Cozy warm interior glow, steam rising from cups
- Animated: Latte art swirls appear on correct answers, espresso machine steams

## UI Screens — Detailed

### 1. Splash/Loading Screen
- Logo "Αστέρι της Σκηνής" in gold script with shimmer animation
- Star SVG draws itself (path animation)
- Progress bar styled as sparkly wand filling up
- Deep purple background with floating gold particles

### 2. Home Screen (Αρχική)
- Full-screen animated gradient (slowly shifting colors)
- Large central avatar with idle animations (blink, sway, wave)
- "ΠΑΙΞΕ!" button — large, rounded, glossy, pulse animation + glow
- "Ρυθμίσεις ⚙️" and "Τα Βραβεία μου 🏆" smaller buttons
- Stars counter top corner with subtle bounce
- Current level/world badge indicator
- Floating decorative elements around edges

### 3. World Map (Χάρτης Κόσμων)
- Vertical scrollable illustrated path (Candy Crush style)
- 7 large circular world icons connected by sparkling golden path
- Locked worlds: elegant padlock + shimmer overlay
- Unlocked worlds: gentle pulse to attract attention
- Themed borders per world (pink gems, purple gems, gold gems, chocolate swirls, tropical feathers, black & yellow stripes, coffee beans)
- Radial progress ring showing % per world
- Starry night sky background with occasional shooting stars

### 4. Level Select (Επιλογή Επιπέδου)
- 5 levels as themed objects:
  - Beauty: vanity mirrors
  - Dance: spotlights
  - Singing: microphones
- 0-3 stars shown per completed level
- Current level glows/bounces
- Locked levels greyed with small lock icon
- "Πρόκληση Χορού!" bonus levels as golden icons between regular levels

### 5. Game Screen (Παιχνίδι)
- **Top bar:** Hearts (❤️❤️❤️) | Star counter | Level name | Music toggle 🔊
- **Center card:** Large frosted-glass card, rounded corners, themed border, subtle shadow
- **Question text:** Large clear Greek text. Word problems have small themed illustration beside them
- **Answer options:** 4 large buttons (min 60px height), each different pastel color, press animations
- **Timer:** Optional circular countdown ring around question number
- **Progress:** Dots at bottom showing question X of 10
- **Avatar:** Small corner version reacting to each answer
- **Background:** World-themed with floating elements and ambient animations

### 6. Dance Challenge Screen (Πρόκληση Χορού)
- Full-width stage with spotlight
- Large animated dancer center stage performing moves
- Beat indicator at bottom (dots lighting up in rhythm)
- Move counter showing tallied moves
- After sequence: multiple choice answer for the count
- Combo indicator: "🔥 Σερί: 3!" for consecutive correct answers

### 7. Results Screen (Αποτέλεσμα)
- Stars fly in with individual fanfare (1-3)
- Stats: "Σωστές: 8/10" | "Χρόνος: 2:30" | "Σερί: 5 🔥"
- Encouragement (Greek):
  - 3 stars: "ΤΕΛΕΙΑ! Είσαι αστέρι! 🌟"
  - 2 stars: "Πολύ καλά! Συνέχισε έτσι! 💫"
  - 1 star: "Μπράβο! Προσπάθησε ξανά για περισσότερα αστέρια! ✨"
- Unlock notification with golden chest animation (if earned)
- Buttons: "Ξανά 🔄" | "Συνέχεια ➡️" | "Χάρτης 🗺️"

### 8. Trophy/Collection Screen (Τα Βραβεία μου)
- Grid of unlockable items as cards
- Locked: silhouette with "?"
- Unlocked: full color with sparkle
- Categories: Αξεσουάρ, Ρούχα, Τραγούδια, Χοροί
- Each item has a cute Greek name

### 9. Settings Screen (Ρυθμίσεις)
- Volume slider (styled as sparkly bar)
- Music on/off toggle
- Sound effects on/off toggle
- Reset progress (with confirmation dialog)
- Credits

## Math Problem System

### Adaptive Difficulty Tiers
| Tier | Multiplication | Division | Unlocks at |
|------|---------------|----------|-----------|
| 1 | ×1, ×2, ×5, ×10 | ÷2, ÷5 | Start |
| 2 | ×3, ×4 | ÷3, ÷4 | 70% accuracy on Tier 1 |
| 3 | ×6, ×7, ×8 | ÷6, ÷7, ÷8 | 70% accuracy on Tier 2 |
| 4 | ×9, ×11, ×12 | ÷9, ÷11, ÷12 | 70% accuracy on Tier 3 |
| 5 | Mixed + word problems | Mixed complex | 70% accuracy on Tier 4 |

### Question Format
- 10 questions per level
- Mix of plain equations ("6 × 7 = ;") and themed word problems
- Word problems use context from current world
- 4 multiple-choice answers (1 correct, 3 plausible distractors)
- Distractors generated by ±1, ±2, ×2, common mistakes (e.g., addition instead of multiplication)

### Word Problem Examples (Greek)

**Beauty Salon:**
- "Η Μαρία βάφει 4 νύχια σε κάθε χέρι. Έχει 2 χέρια. Πόσα νύχια έβαψε;" (4×2=8)
- "Έχεις 18 κοκαλάκια και θέλεις να τα μοιράσεις σε 3 φίλες. Πόσα παίρνει η κάθε μία;" (18÷3=6)
- "Χρειάζεσαι 7 πετράδια για κάθε βραχιόλι. Φτιάχνεις 6 βραχιόλια. Πόσα πετράδια;" (7×6=42)
- "Έχεις 5 χρώματα βερνίκι και βάφεις 8 νύχια με κάθε χρώμα. Πόσα νύχια συνολικά;" (5×8=40)
- "Μοιράζεις 24 λουλούδια σε 6 ανθοδέσμες. Πόσα λουλούδια η κάθε μία;" (24÷6=4)

**Dance Academy:**
- "Η χορογραφία έχει 8 βήματα. Τη χορεύεις 3 φορές. Πόσα βήματα;" (8×3=24)
- "24 χορευτές χωρίζονται σε 4 ομάδες. Πόσοι σε κάθε ομάδα;" (24÷4=6)
- "Κάθε τραγούδι έχει 5 αλλαγές χορού. Χόρεψες 9 τραγούδια. Πόσες αλλαγές;" (5×9=45)
- "Η σκηνή έχει 7 σειρές με 6 χορευτές. Πόσοι χορευτές;" (7×6=42)
- "Πρόβα 48 λεπτών σε 8 τραγούδια. Πόσα λεπτά ανά τραγούδι;" (48÷8=6)

**Singing Studio:**
- "Κάθε στροφή έχει 4 στίχους. 6 στροφές. Πόσοι στίχοι;" (4×6=24)
- "36 τραγούδια σε 6 μέρες. Πόσα την ημέρα;" (36÷6=6)
- "3 χορωδίες × 12 παιδιά = πόσα παιδιά τραγουδάνε;" (3×12=36)
- "Κάθε μάθημα φωνητικής κρατάει 9 λεπτά. 4 μαθήματα. Πόσα λεπτά;" (9×4=36)
- "56 νότες σε 7 γραμμές. Πόσες νότες ανά γραμμή;" (56÷7=8)

**Σοκολατένια Ονειρα (Chocolate Dreams):**
- "Η σοκολάτα έχει 4 σειρές με 6 κομμάτια. Πόσα κομμάτια συνολικά;" (4×6=24)
- "Μοιράζεις 36 σοκολατάκια σε 9 φίλες. Πόσα παίρνει η κάθε μία;" (36÷9=4)
- "Κάθε κουτί έχει 8 τρούφες. Αγόρασες 7 κουτιά. Πόσες τρούφες;" (8×7=56)
- "Φτιάχνεις 5 πιάτα με 12 μπισκότα σοκολάτας το καθένα. Πόσα μπισκότα;" (5×12=60)
- "Έχεις 48 σοκολατένιες καρδιές και τις βάζεις σε 6 σακουλάκια. Πόσες σε κάθε σακουλάκι;" (48÷6=8)
- "Η τούρτα θέλει 3 στρώσεις σοκολάτας. Κάθε στρώση θέλει 9 κομμάτια. Πόσα κομμάτια;" (3×9=27)
- "Μοιράζεις 42 πραλίνες σε 7 κουτάκια δώρου. Πόσες σε κάθε κουτάκι;" (42÷7=6)

**Παπαγάλοι & Φίλοι (Parrots & Friends):**
- "Κάθε παπαγάλος τρώει 6 σπόρους την ώρα. Έχεις 4 παπαγάλους. Πόσοι σπόροι;" (6×4=24)
- "Στο pet shop υπάρχουν 35 παπαγάλοι σε 5 κλουβιά. Πόσοι σε κάθε κλουβί;" (35÷5=7)
- "Ο παπαγάλος λέει 8 λέξεις. Τις επαναλαμβάνει 3 φορές τη μέρα. Πόσες λέξεις ακούς;" (8×3=24)
- "Αγόρασες 7 παιχνίδια για κάθε παπαγάλο. Έχεις 3 παπαγάλους. Πόσα παιχνίδια;" (7×3=21)
- "Υπάρχουν 54 φτερά στο πάτωμα. 6 παπαγάλοι τα έριξαν εξίσου. Πόσα ο καθένας;" (54÷6=9)
- "Κάθε παπαγάλος κάνει 11 ακροβατικά. Βλέπεις 4 παπαγάλους. Πόσα ακροβατικά;" (11×4=44)
- "Μοιράζεις 72 σπόρους ηλίανθου σε 8 παπαγάλους. Πόσοι ο καθένας;" (72÷8=9)

**ΑΕΚ — Ποδοσφαιρική Ακαδημία (AEK Football Academy):**
- "Η ΑΕΚ βάζει 3 γκολ σε κάθε αγώνα. Παίζει 8 αγώνες. Πόσα γκολ;" (3×8=24)
- "Στο γήπεδο υπάρχουν 44 παίκτες σε 4 ομάδες. Πόσοι σε κάθε ομάδα;" (44÷4=11)
- "Κάθε παίκτης κάνει 6 πάσες ανά λεπτό. Πόσες πάσες σε 7 λεπτά;" (6×7=42)
- "Η ΑΕΚ έχει 12 αμυντικούς ασκήσεις. Κάνουν 3 σετ. Πόσες ασκήσεις συνολικά;" (12×3=36)
- "Μοιράζονται 63 μπάλες σε 9 γήπεδα. Πόσες σε κάθε γήπεδο;" (63÷9=7)
- "Κάθε ημίχρονο έχει 45 λεπτά. Πόσα λεπτά σε 2 ημίχρονα;" (45×2=90)
- "Η ομάδα κέρδισε 5 αγώνες. Κάθε νίκη = 3 βαθμοί. Πόσοι βαθμοί;" (5×3=15)
- "Υπάρχουν 56 φίλαθλοι σε 8 σειρές κερκίδας. Πόσοι ανά σειρά;" (56÷8=7)

**Καφετέρια Σταρ (Star Coffee Shop):**
- "Κάθε τραπέζι έχει 4 καρέκλες. Υπάρχουν 9 τραπέζια. Πόσες καρέκλες;" (4×9=36)
- "Παρήγγειλαν 48 κρουασάν για 6 τραπέζια. Πόσα ανά τραπέζι;" (48÷6=8)
- "Φτιάχνεις 7 φραπέδες. Κάθε φραπές θέλει 3 κουταλιές ζάχαρη. Πόσες κουταλιές;" (7×3=21)
- "Η καφετέρια πουλάει 11 γλυκά την ώρα. Σε 5 ώρες πόσα γλυκά;" (11×5=55)
- "Μοιράζεις 36 ζαχαρωτά σε 4 βαζάκια. Πόσα σε κάθε βαζάκι;" (36÷4=9)
- "Κάθε smoothie θέλει 8 φράουλες. Φτιάχνεις 6 smoothies. Πόσες φράουλες;" (8×6=48)
- "Η βιτρίνα έχει 3 ράφια με 12 κέικ στο καθένα. Πόσα κέικ;" (3×12=36)
- "Παραγγέλνουν 72 μπαλόνια για πάρτι. Τα δένεις σε 9 τραπέζια. Πόσα ανά τραπέζι;" (72÷9=8)

## Reward System

### Stars
- 1-3 stars per level based on accuracy:
  - 3 stars: 9-10 correct
  - 2 stars: 7-8 correct
  - 1 star: 5-6 correct (minimum to pass)
  - 0 stars (fail): <5 correct, must retry
- Dance challenges: 2 bonus stars per world (7 worlds × 2 = 14)
- Maximum total: 35 level stars × 3 = 105 max level stars + 14 dance stars = 119 stars

### Unlockables (every 5-10 stars)
| Stars | Reward (Greek name) | English |
|-------|-------------------|---------|
| 5 | Ροζ κορδέλα | Pink ribbon |
| 10 | Χρυσά σκουλαρίκια | Gold earrings |
| 15 | Φόρεμα μπαλαρίνας | Ballerina dress |
| 20 | Μικρόφωνο αστέρι | Star microphone |
| 25 | Τιάρα πριγκίπισσας | Princess tiara |
| 30 | Παπούτσια χορού LED | LED dance shoes |
| 35 | Φτερά αγγέλου | Angel wings |
| 40 | Σοκολατένιο στέμμα | Chocolate crown |
| 50 | Τροπικός παπαγάλος φίλος | Tropical parrot companion |
| 60 | Φανέλα ΑΕΚ χρυσή | Golden AEK jersey |
| 70 | Barista σετ | Barista apron & tools |
| 80 | Πλήρες σετ σούπερ σταρ! | Full superstar outfit |
| 90 | Χρυσή σκηνή | Golden stage backdrop |
| 100 | Πλατινένιο τρόπαιο "Αστέρι της Σκηνής" | Platinum trophy — game complete! |
| 119 | Μυστικό: Ουράνιο τόξο αστεριών! | Secret: Rainbow of stars — 100% completion! |

## Gameplay Mechanics

### Lives System
- 3 hearts per level
- Wrong answer = lose 1 heart
- 0 hearts = level failed, encouraging message, option to retry
- Hearts reset each level attempt

### Adaptive Logic
- Track accuracy per tier in localStorage
- When accuracy ≥ 70% over last 20 questions in current tier → unlock next tier
- If accuracy drops below 50% → offer easier questions from previous tier
- Never punish — always encourage

### Progress Persistence
- localStorage keys: `stars`, `currentTier`, `unlockedWorlds`, `unlockedItems`, `levelResults`, `settings`
- Auto-save after every level completion

## Deployment

- GitHub repository with Vite React project
- `gh-pages` branch for deployment
- Accessible via `https://<username>.github.io/<repo-name>/`
- PWA manifest for "Add to Home Screen" on mobile
- Service worker for offline capability (cached assets)

## File Structure

```
maths/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── audio/
│   │   ├── bg-beauty.mp3
│   │   ├── bg-dance.mp3
│   │   ├── bg-singing.mp3
│   │   ├── bg-chocolate.mp3
│   │   ├── bg-parrots.mp3
│   │   ├── bg-aek.mp3
│   │   ├── bg-coffee.mp3
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   ├── level-complete.mp3
│   │   ├── star.mp3
│   │   └── button.mp3
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   └── index.ts
│   ├── context/
│   │   ├── GameContext.tsx
│   │   └── AudioContext.tsx
│   ├── hooks/
│   │   ├── useGameProgress.ts
│   │   ├── useAdaptiveDifficulty.ts
│   │   └── useAudio.ts
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── StarDisplay.tsx
│   │   │   ├── Hearts.tsx
│   │   │   ├── Confetti.tsx
│   │   │   ├── FloatingElements.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── MusicToggle.tsx
│   │   ├── screens/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── WorldMap.tsx
│   │   │   ├── LevelSelect.tsx
│   │   │   ├── GameScreen.tsx
│   │   │   ├── DanceChallenge.tsx
│   │   │   ├── ResultsScreen.tsx
│   │   │   ├── TrophyScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── game/
│   │       ├── QuestionCard.tsx
│   │       ├── AnswerButton.tsx
│   │       ├── ProgressDots.tsx
│   │       ├── Timer.tsx
│   │       └── DanceFloor.tsx
│   ├── data/
│   │   ├── questions.ts
│   │   ├── worlds.ts
│   │   ├── rewards.ts
│   │   └── danceSequences.ts
│   ├── utils/
│   │   ├── mathGenerator.ts
│   │   ├── adaptiveEngine.ts
│   │   └── storage.ts
│   └── styles/
│       ├── global.css
│       ├── variables.css
│       ├── animations.css
│       └── themes/
│           ├── beauty.module.css
│           ├── dance.module.css
│           ├── singing.module.css
│           ├── chocolate.module.css
│           ├── parrots.module.css
│           ├── aek.module.css
│           └── coffee.module.css
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-20-math-game-design.md
```
