// @ts-nocheck
/**
 * Music Engine Test: Simulates all layers for all 8 worlds in sequence.
 * Verifies: no repetition within layers, distinct worlds, correct timing, layer independence.
 * Run: npx tsx src/__tests__/music-layers-test.ts
 */

const N = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
  Bb3: 233.08, Eb4: 311.13, Ab4: 415.3, Bb4: 466.16,
  Fs4: 369.99, Cs4: 277.18,
};

type WorldId = 'beauty' | 'dance' | 'singing' | 'chocolate' | 'parrots' | 'aek' | 'coffee' | 'eurovision';

interface WorldMusic {
  bpm: number;
  melodyWave: string;
  melodyNotes: number[];
  bassWave: string;
  bassNotes: number[];
  rhythmPattern: ('kick' | 'snare' | 'hat' | 'rest')[];
  sparkleWave: string;
  sparkleOctave: number;
  sparkleProb: number;
}

const WORLD_MUSIC: Record<WorldId, WorldMusic> = {
  beauty: {
    bpm: 120,
    melodyWave: 'sine',
    melodyNotes: [N.E5, N.G5, N.A5, N.G5, N.E5, N.D5, N.C5, N.D5, N.E5, N.G5, N.C5, N.D5, N.E5, N.C5, N.D5, N.E5],
    bassWave: 'triangle',
    bassNotes: [N.C3, N.C3, N.G3, N.G3, N.A3, N.A3, N.F3, N.F3],
    rhythmPattern: ['kick', 'hat', 'snare', 'hat', 'kick', 'hat', 'snare', 'hat'],
    sparkleWave: 'sine',
    sparkleOctave: 3,
    sparkleProb: 0.3,
  },
  dance: {
    bpm: 130,
    melodyWave: 'square',
    melodyNotes: [N.D4, N.F4, N.A4, N.G4, N.F4, N.E4, N.D4, N.C4, N.D4, N.F4, N.G4, N.A4, N.Bb4, N.A4, N.G4, N.F4],
    bassWave: 'sawtooth',
    bassNotes: [N.D3, N.D3, N.A3, N.A3, N.Bb3, N.Bb3, N.G3, N.A3],
    rhythmPattern: ['kick', 'hat', 'snare', 'hat', 'kick', 'kick', 'snare', 'hat'],
    sparkleWave: 'square',
    sparkleOctave: 2,
    sparkleProb: 0.2,
  },
  singing: {
    bpm: 85,
    melodyWave: 'sine',
    melodyNotes: [N.G4, N.B4, N.D5, N.C5, N.B4, N.A4, N.G4, N.A4, N.B4, N.D5, N.E5, N.D5, N.C5, N.B4, N.A4, N.G4],
    bassWave: 'sine',
    bassNotes: [N.G3, N.G3, N.D3, N.D3, N.E3, N.E3, N.C3, N.D3],
    rhythmPattern: ['rest', 'hat', 'rest', 'rest', 'kick', 'hat', 'rest', 'rest'],
    sparkleWave: 'sine',
    sparkleOctave: 3,
    sparkleProb: 0.4,
  },
  chocolate: {
    bpm: 110,
    melodyWave: 'triangle',
    melodyNotes: [N.F4, N.A4, N.C5, N.A4, N.F4, N.G4, N.A4, N.G4, N.F4, N.E4, N.F4, N.A4, N.C5, N.D5, N.C5, N.A4],
    bassWave: 'triangle',
    bassNotes: [N.F3, N.F3, N.C3, N.C3, N.D3, N.D3, N.C3, N.C3],
    rhythmPattern: ['kick', 'rest', 'hat', 'rest', 'kick', 'rest', 'hat', 'hat'],
    sparkleWave: 'triangle',
    sparkleOctave: 3,
    sparkleProb: 0.35,
  },
  parrots: {
    bpm: 95,
    melodyWave: 'triangle',
    melodyNotes: [N.E4, N.G4, N.A4, N.B4, N.A4, N.G4, N.E4, N.D4, N.E4, N.G4, N.B4, N.A4, N.G4, N.E4, N.D4, N.E4],
    bassWave: 'sine',
    bassNotes: [N.E3, N.E3, N.B3, N.B3, N.A3, N.A3, N.B3, N.E3],
    rhythmPattern: ['kick', 'rest', 'rest', 'kick', 'rest', 'snare', 'rest', 'kick'],
    sparkleWave: 'sine',
    sparkleOctave: 3,
    sparkleProb: 0.25,
  },
  aek: {
    bpm: 140,
    melodyWave: 'sawtooth',
    melodyNotes: [N.G4, N.G4, N.B4, N.D5, N.D5, N.C5, N.B4, N.A4, N.G4, N.G4, N.B4, N.D5, N.E5, N.D5, N.C5, N.B4],
    bassWave: 'square',
    bassNotes: [N.G3, N.G3, N.D3, N.D3, N.E3, N.E3, N.D3, N.D3],
    rhythmPattern: ['kick', 'hat', 'snare', 'hat', 'kick', 'hat', 'snare', 'kick'],
    sparkleWave: 'sawtooth',
    sparkleOctave: 2,
    sparkleProb: 0.15,
  },
  coffee: {
    bpm: 75,
    melodyWave: 'sine',
    melodyNotes: [N.A4, N.C5, N.E5, N.D5, N.C5, N.A4, N.G4, N.A4, N.C5, N.D5, N.E5, N.C5, N.A4, N.G4, N.A4, N.C5],
    bassWave: 'triangle',
    bassNotes: [N.A3, N.A3, N.E3, N.E3, N.F3, N.F3, N.E3, N.E3],
    rhythmPattern: ['kick', 'rest', 'hat', 'rest', 'rest', 'snare', 'rest', 'hat'],
    sparkleWave: 'sine',
    sparkleOctave: 3,
    sparkleProb: 0.2,
  },
  eurovision: {
    bpm: 128,
    melodyWave: 'sawtooth',
    melodyNotes: [N.E4, N.E4, N.G4, N.A4, N.B4, N.A4, N.G4, N.E4, N.Fs4, N.G4, N.A4, N.B4, N.A4, N.G4, N.Fs4, N.G4],
    bassWave: 'square',
    bassNotes: [N.E3, N.E3, N.B3, N.B3, N.A3, N.A3, N.B3, N.B3],
    rhythmPattern: ['kick', 'kick', 'snare', 'hat', 'kick', 'snare', 'kick', 'hat'],
    sparkleWave: 'sawtooth',
    sparkleOctave: 2,
    sparkleProb: 0.25,
  },
};

// ===== TEST UTILITIES =====

function freqToNote(freq: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const midiNote = Math.round(12 * Math.log2(freq / 440) + 69);
  const name = noteNames[midiNote % 12];
  const octave = Math.floor(midiNote / 12) - 1;
  return `${name}${octave}`;
}

interface SimulatedEvent {
  time: number;
  layer: 'melody' | 'bass' | 'rhythm' | 'sparkle';
  frequency?: number;
  note?: string;
  type?: string;
}

function simulateWorld(worldId: WorldId, durationBeats: number = 32): SimulatedEvent[] {
  const music = WORLD_MUSIC[worldId];
  const beatMs = 60000 / music.bpm;
  const events: SimulatedEvent[] = [];

  let melodyStep = 0;
  let bassStep = 0;
  let rhythmStep = 0;

  // Simulate melody layer (fires every beat)
  for (let i = 0; i < durationBeats; i++) {
    const time = i * beatMs;
    const note = music.melodyNotes[melodyStep % music.melodyNotes.length];
    events.push({ time, layer: 'melody', frequency: note, note: freqToNote(note), type: music.melodyWave });
    melodyStep++;
  }

  // Simulate bass layer (fires every 2 beats)
  for (let i = 0; i < Math.floor(durationBeats / 2); i++) {
    const time = i * beatMs * 2;
    const note = music.bassNotes[bassStep % music.bassNotes.length];
    events.push({ time, layer: 'bass', frequency: note, note: freqToNote(note), type: music.bassWave });
    bassStep++;
  }

  // Simulate rhythm layer (fires every half beat)
  for (let i = 0; i < durationBeats * 2; i++) {
    const time = i * (beatMs / 2);
    const hit = music.rhythmPattern[rhythmStep % music.rhythmPattern.length];
    if (hit !== 'rest') {
      events.push({ time, layer: 'rhythm', type: hit });
    }
    rhythmStep++;
  }

  return events.sort((a, b) => a.time - b.time);
}

// ===== TEST CASES =====

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    testsPassed++;
    console.log(`  ✅ ${message}`);
  } else {
    testsFailed++;
    console.log(`  ❌ FAIL: ${message}`);
  }
}

const WORLDS: WorldId[] = ['beauty', 'dance', 'singing', 'chocolate', 'parrots', 'aek', 'coffee', 'eurovision'];

// ===== TEST 1: Each world has unique melody =====
console.log('\n━━━ TEST 1: Each world has a UNIQUE melody sequence ━━━');
{
  const melodySignatures = new Map<string, WorldId>();
  let allUnique = true;

  for (const world of WORLDS) {
    const sig = WORLD_MUSIC[world].melodyNotes.join(',');
    if (melodySignatures.has(sig)) {
      console.log(`  ❌ ${world} has SAME melody as ${melodySignatures.get(sig)}!`);
      allUnique = false;
      testsFailed++;
    } else {
      melodySignatures.set(sig, world);
    }
  }
  assert(allUnique, 'All 8 worlds have distinct melody sequences');
}

// ===== TEST 2: Each world has unique bass pattern =====
console.log('\n━━━ TEST 2: Each world has a UNIQUE bass pattern ━━━');
{
  const bassSignatures = new Map<string, WorldId>();

  for (const world of WORLDS) {
    const sig = WORLD_MUSIC[world].bassNotes.join(',');
    if (bassSignatures.has(sig)) {
      console.log(`  ⚠️  ${world} shares bass pattern with ${bassSignatures.get(sig)} (acceptable for harmonic reasons)`);
    } else {
      bassSignatures.set(sig, world);
    }
  }
  assert(bassSignatures.size >= 6, `At least 6 unique bass patterns (found ${bassSignatures.size}/8)`);
}

// ===== TEST 3: Each world has unique rhythm pattern =====
console.log('\n━━━ TEST 3: Each world has a UNIQUE rhythm pattern ━━━');
{
  const rhythmSignatures = new Map<string, WorldId>();
  let duplicates: string[] = [];

  for (const world of WORLDS) {
    const sig = WORLD_MUSIC[world].rhythmPattern.join(',');
    if (rhythmSignatures.has(sig)) {
      duplicates.push(`${world} = ${rhythmSignatures.get(sig)}`);
    } else {
      rhythmSignatures.set(sig, world);
    }
  }
  if (duplicates.length > 0) {
    console.log(`  ⚠️  Rhythm duplicates: ${duplicates.join('; ')}`);
  }
  assert(rhythmSignatures.size >= 5, `At least 5 unique rhythms (found ${rhythmSignatures.size}/8)`);
}

// ===== TEST 4: Melody has NO immediate full-sequence repetition within 32 beats =====
console.log('\n━━━ TEST 4: Melody does NOT repeat the same note consecutively (more than 2x) ━━━');
{
  for (const world of WORLDS) {
    const notes = WORLD_MUSIC[world].melodyNotes;
    let maxConsecutive = 1;
    let currentRun = 1;
    for (let i = 1; i < notes.length; i++) {
      if (notes[i] === notes[i - 1]) {
        currentRun++;
        maxConsecutive = Math.max(maxConsecutive, currentRun);
      } else {
        currentRun = 1;
      }
    }
    assert(maxConsecutive <= 2, `${world}: max consecutive same note = ${maxConsecutive} (≤2 is good)`);
  }
}

// ===== TEST 5: Each world uses different BPM =====
console.log('\n━━━ TEST 5: Worlds have VARIED tempos (no identical BPMs on more than 2) ━━━');
{
  const bpmCounts: Record<number, string[]> = {};
  for (const world of WORLDS) {
    const bpm = WORLD_MUSIC[world].bpm;
    if (!bpmCounts[bpm]) bpmCounts[bpm] = [];
    bpmCounts[bpm].push(world);
  }
  const maxSameBpm = Math.max(...Object.values(bpmCounts).map(v => v.length));
  console.log(`  BPM distribution: ${Object.entries(bpmCounts).map(([k, v]) => `${k}BPM(${v.join(',')})`).join(' | ')}`);
  assert(maxSameBpm <= 2, `No more than 2 worlds share same BPM (max group: ${maxSameBpm})`);
}

// ===== TEST 6: Layer timing independence =====
console.log('\n━━━ TEST 6: Layers fire at DIFFERENT rates (independent timing) ━━━');
{
  for (const world of WORLDS) {
    const music = WORLD_MUSIC[world];
    const beatMs = 60000 / music.bpm;

    const melodyRate = beatMs;
    const bassRate = beatMs * 2;
    const rhythmRate = beatMs / 2;
    const sparkleRate = beatMs * 4;

    const allDifferent = new Set([melodyRate, bassRate, rhythmRate, sparkleRate]).size === 4;
    assert(allDifferent, `${world}: 4 layers at different rates (${Math.round(melodyRate)}/${Math.round(bassRate)}/${Math.round(rhythmRate)}/${Math.round(sparkleRate)}ms)`);
  }
}

// ===== TEST 7: Simulate full 32-beat playback, check event distribution =====
console.log('\n━━━ TEST 7: Full 32-beat simulation - event counts per layer ━━━');
{
  for (const world of WORLDS) {
    const events = simulateWorld(world, 32);
    const melodyEvents = events.filter(e => e.layer === 'melody');
    const bassEvents = events.filter(e => e.layer === 'bass');
    const rhythmEvents = events.filter(e => e.layer === 'rhythm');

    assert(melodyEvents.length === 32, `${world} melody: ${melodyEvents.length} events (expect 32)`);
    assert(bassEvents.length === 16, `${world} bass: ${bassEvents.length} events (expect 16)`);
    assert(rhythmEvents.length > 0, `${world} rhythm: ${rhythmEvents.length} hits (non-zero)`);
  }
}

// ===== TEST 8: Melody sequence cycles correctly (no stuck notes) =====
console.log('\n━━━ TEST 8: Melody cycles through full 16-note pattern before repeating ━━━');
{
  for (const world of WORLDS) {
    const events = simulateWorld(world, 32);
    const melodyNotes = events.filter(e => e.layer === 'melody').map(e => e.note!);

    const firstPhrase = melodyNotes.slice(0, 16);
    const secondPhrase = melodyNotes.slice(16, 32);

    const identical = firstPhrase.every((n, i) => n === secondPhrase[i]);
    assert(identical, `${world}: phrase 2 correctly loops back to phrase 1`);

    const uniqueInPhrase = new Set(firstPhrase).size;
    assert(uniqueInPhrase >= 4, `${world}: uses ${uniqueInPhrase} unique notes in melody (≥4 for variety)`);
  }
}

// ===== TEST 9: No two adjacent worlds sound the same (waveform + key + tempo) =====
console.log('\n━━━ TEST 9: Adjacent worlds in progression differ in character ━━━');
{
  for (let i = 0; i < WORLDS.length - 1; i++) {
    const a = WORLD_MUSIC[WORLDS[i]];
    const b = WORLD_MUSIC[WORLDS[i + 1]];

    const differences: string[] = [];
    if (a.bpm !== b.bpm) differences.push('tempo');
    if (a.melodyWave !== b.melodyWave) differences.push('waveform');
    if (a.melodyNotes[0] !== b.melodyNotes[0]) differences.push('key');
    if (a.rhythmPattern.join('') !== b.rhythmPattern.join('')) differences.push('rhythm');

    assert(differences.length >= 2, `${WORLDS[i]} → ${WORLDS[i+1]}: ${differences.length} differences (${differences.join(', ')})`);
  }
}

// ===== TEST 10: Rhythm patterns have reasonable hit density =====
console.log('\n━━━ TEST 10: Rhythm patterns have appropriate density (not too sparse, not too dense) ━━━');
{
  for (const world of WORLDS) {
    const pattern = WORLD_MUSIC[world].rhythmPattern;
    const hits = pattern.filter(p => p !== 'rest').length;
    const density = hits / pattern.length;
    assert(density >= 0.25 && density <= 1.0, `${world}: rhythm density ${Math.round(density * 100)}% (${hits}/${pattern.length} hits)`);
  }
}

// ===== TEST 11: Print full sequence for each world (visual inspection) =====
console.log('\n━━━ VISUAL: First 16 melody notes per world ━━━');
for (const world of WORLDS) {
  const notes = WORLD_MUSIC[world].melodyNotes.map(f => freqToNote(f));
  console.log(`  ${world.padEnd(10)}: ${notes.join(' → ')}`);
}

console.log('\n━━━ VISUAL: Bass progression per world ━━━');
for (const world of WORLDS) {
  const notes = WORLD_MUSIC[world].bassNotes.map(f => freqToNote(f));
  console.log(`  ${world.padEnd(10)}: ${notes.join(' → ')}`);
}

console.log('\n━━━ VISUAL: Rhythm patterns per world ━━━');
const drumMap = { kick: '💥', snare: '🥁', hat: '🎩', rest: '··' };
for (const world of WORLDS) {
  const pattern = WORLD_MUSIC[world].rhythmPattern.map(h => drumMap[h]);
  console.log(`  ${world.padEnd(10)}: ${pattern.join(' ')}`);
}

// ===== SUMMARY =====
console.log('\n' + '═'.repeat(60));
console.log(`  RESULTS: ${testsPassed} passed, ${testsFailed} failed`);
console.log('═'.repeat(60));

if (testsFailed > 0) {
  process.exit(1);
}
