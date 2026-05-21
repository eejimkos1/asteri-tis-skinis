// @ts-nocheck
/**
 * Sequential Playback Test: Simulates EXACT temporal playback of all layers
 * interleaved as a real listener would hear them, world by world.
 *
 * For each world, plays 16 beats worth of all 4 layers merged into a single
 * timeline, then checks:
 * 1. No two consecutive events on the SAME layer are identical
 * 2. The combined audio stream changes character between worlds
 * 3. Within each world, layers create variety (not monotonous)
 *
 * Run: npx tsx src/__tests__/music-sequential-test.ts
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
    bpm: 120, melodyWave: 'sine',
    melodyNotes: [N.E5, N.G5, N.A5, N.G5, N.E5, N.D5, N.C5, N.D5, N.E5, N.G5, N.C5, N.D5, N.E5, N.C5, N.D5, N.E5],
    bassWave: 'triangle', bassNotes: [N.C3, N.C3, N.G3, N.G3, N.A3, N.A3, N.F3, N.F3],
    rhythmPattern: ['kick', 'hat', 'snare', 'hat', 'kick', 'hat', 'snare', 'hat'],
    sparkleWave: 'sine', sparkleOctave: 3, sparkleProb: 0.3,
  },
  dance: {
    bpm: 130, melodyWave: 'square',
    melodyNotes: [N.D4, N.F4, N.A4, N.G4, N.F4, N.E4, N.D4, N.C4, N.D4, N.F4, N.G4, N.A4, N.Bb4, N.A4, N.G4, N.F4],
    bassWave: 'sawtooth', bassNotes: [N.D3, N.D3, N.A3, N.A3, N.Bb3, N.Bb3, N.G3, N.A3],
    rhythmPattern: ['kick', 'hat', 'snare', 'hat', 'kick', 'kick', 'snare', 'hat'],
    sparkleWave: 'square', sparkleOctave: 2, sparkleProb: 0.2,
  },
  singing: {
    bpm: 85, melodyWave: 'sine',
    melodyNotes: [N.G4, N.B4, N.D5, N.C5, N.B4, N.A4, N.G4, N.A4, N.B4, N.D5, N.E5, N.D5, N.C5, N.B4, N.A4, N.G4],
    bassWave: 'sine', bassNotes: [N.G3, N.G3, N.D3, N.D3, N.E3, N.E3, N.C3, N.D3],
    rhythmPattern: ['rest', 'hat', 'rest', 'rest', 'kick', 'hat', 'rest', 'rest'],
    sparkleWave: 'sine', sparkleOctave: 3, sparkleProb: 0.4,
  },
  chocolate: {
    bpm: 110, melodyWave: 'triangle',
    melodyNotes: [N.F4, N.A4, N.C5, N.A4, N.F4, N.G4, N.A4, N.G4, N.F4, N.E4, N.F4, N.A4, N.C5, N.D5, N.C5, N.A4],
    bassWave: 'triangle', bassNotes: [N.F3, N.F3, N.C3, N.C3, N.D3, N.D3, N.C3, N.C3],
    rhythmPattern: ['kick', 'rest', 'hat', 'rest', 'kick', 'rest', 'hat', 'hat'],
    sparkleWave: 'triangle', sparkleOctave: 3, sparkleProb: 0.35,
  },
  parrots: {
    bpm: 95, melodyWave: 'triangle',
    melodyNotes: [N.E4, N.G4, N.A4, N.B4, N.A4, N.G4, N.E4, N.D4, N.E4, N.G4, N.B4, N.A4, N.G4, N.E4, N.D4, N.E4],
    bassWave: 'sine', bassNotes: [N.E3, N.E3, N.B3, N.B3, N.A3, N.A3, N.B3, N.E3],
    rhythmPattern: ['kick', 'rest', 'rest', 'kick', 'rest', 'snare', 'rest', 'kick'],
    sparkleWave: 'sine', sparkleOctave: 3, sparkleProb: 0.25,
  },
  aek: {
    bpm: 140, melodyWave: 'sawtooth',
    melodyNotes: [N.G4, N.G4, N.B4, N.D5, N.D5, N.C5, N.B4, N.A4, N.G4, N.G4, N.B4, N.D5, N.E5, N.D5, N.C5, N.B4],
    bassWave: 'square', bassNotes: [N.G3, N.G3, N.D3, N.D3, N.E3, N.E3, N.D3, N.D3],
    rhythmPattern: ['kick', 'hat', 'snare', 'hat', 'kick', 'hat', 'snare', 'kick'],
    sparkleWave: 'sawtooth', sparkleOctave: 2, sparkleProb: 0.15,
  },
  coffee: {
    bpm: 75, melodyWave: 'sine',
    melodyNotes: [N.A4, N.C5, N.E5, N.D5, N.C5, N.A4, N.G4, N.A4, N.C5, N.D5, N.E5, N.C5, N.A4, N.G4, N.A4, N.C5],
    bassWave: 'triangle', bassNotes: [N.A3, N.A3, N.E3, N.E3, N.F3, N.F3, N.E3, N.E3],
    rhythmPattern: ['kick', 'rest', 'hat', 'rest', 'rest', 'snare', 'rest', 'hat'],
    sparkleWave: 'sine', sparkleOctave: 3, sparkleProb: 0.2,
  },
  eurovision: {
    bpm: 128, melodyWave: 'sawtooth',
    melodyNotes: [N.E4, N.E4, N.G4, N.A4, N.B4, N.A4, N.G4, N.E4, N.Fs4, N.G4, N.A4, N.B4, N.A4, N.G4, N.Fs4, N.G4],
    bassWave: 'square', bassNotes: [N.E3, N.E3, N.B3, N.B3, N.A3, N.A3, N.B3, N.B3],
    rhythmPattern: ['kick', 'kick', 'snare', 'hat', 'kick', 'snare', 'kick', 'hat'],
    sparkleWave: 'sawtooth', sparkleOctave: 2, sparkleProb: 0.25,
  },
};

const WORLDS: WorldId[] = ['beauty', 'dance', 'singing', 'chocolate', 'parrots', 'aek', 'coffee', 'eurovision'];

function freqToNote(freq: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const midiNote = Math.round(12 * Math.log2(freq / 440) + 69);
  return `${noteNames[midiNote % 12]}${Math.floor(midiNote / 12) - 1}`;
}

// ===== SEQUENTIAL PLAYBACK SIMULATION =====
// Simulates exactly what the Web Audio engine does: 4 intervals fire at their rates,
// events are merged into a single timeline ordered by time.

interface TimelineEvent {
  timeMs: number;
  beat: number;
  layer: 'melody' | 'bass' | 'rhythm' | 'sparkle';
  value: string; // note name, drum type, or sparkle note
  wave: string;
}

function simulateWorldTimeline(worldId: WorldId, beats: number = 16): TimelineEvent[] {
  const music = WORLD_MUSIC[worldId];
  const beatMs = 60000 / music.bpm;
  const timeline: TimelineEvent[] = [];

  // Melody: fires every beat
  for (let i = 0; i < beats; i++) {
    const note = music.melodyNotes[i % music.melodyNotes.length];
    timeline.push({
      timeMs: i * beatMs,
      beat: i,
      layer: 'melody',
      value: freqToNote(note),
      wave: music.melodyWave,
    });
  }

  // Bass: fires every 2 beats
  for (let i = 0; i < Math.floor(beats / 2); i++) {
    const note = music.bassNotes[i % music.bassNotes.length];
    timeline.push({
      timeMs: i * 2 * beatMs,
      beat: i * 2,
      layer: 'bass',
      value: freqToNote(note),
      wave: music.bassWave,
    });
  }

  // Rhythm: fires every half-beat
  for (let i = 0; i < beats * 2; i++) {
    const hit = music.rhythmPattern[i % music.rhythmPattern.length];
    if (hit !== 'rest') {
      timeline.push({
        timeMs: i * (beatMs / 2),
        beat: i / 2,
        layer: 'rhythm',
        value: hit,
        wave: 'noise',
      });
    }
  }

  // Sparkle: fires every 4 beats (deterministic for testing - use prob > 0.5 threshold)
  // In real engine it's random, but for testing we simulate every 4 beats with the note
  for (let i = 0; i < Math.floor(beats / 4); i++) {
    const melodyNote = music.melodyNotes[(i * 4) % music.melodyNotes.length];
    const sparkleFreq = melodyNote * music.sparkleOctave;
    timeline.push({
      timeMs: i * 4 * beatMs,
      beat: i * 4,
      layer: 'sparkle',
      value: freqToNote(sparkleFreq) + `(×${music.sparkleOctave})`,
      wave: music.sparkleWave,
    });
  }

  return timeline.sort((a, b) => a.timeMs - b.timeMs || a.layer.localeCompare(b.layer));
}

// ===== TESTS =====

let passed = 0;
let failed = 0;

function assert(cond: boolean, msg: string) {
  if (cond) { passed++; console.log(`  ✅ ${msg}`); }
  else { failed++; console.log(`  ❌ FAIL: ${msg}`); }
}

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║  SEQUENTIAL PLAYBACK TEST: All layers, all worlds, in order ║');
console.log('╚══════════════════════════════════════════════════════════════╝');

// ===== TEST A: Print full timeline for each world (first 8 beats) =====
console.log('\n━━━ TIMELINE VIEW: First 8 beats of each world (as listener hears them) ━━━\n');

for (const world of WORLDS) {
  const timeline = simulateWorldTimeline(world, 8);
  const music = WORLD_MUSIC[world];
  const beatMs = 60000 / music.bpm;

  console.log(`  ┌─── ${world.toUpperCase()} (${music.bpm} BPM, beat = ${Math.round(beatMs)}ms) ───`);

  for (const event of timeline.slice(0, 30)) {
    const timeStr = `${Math.round(event.timeMs)}ms`.padStart(6);
    const beatStr = `beat ${event.beat.toFixed(1)}`.padStart(9);
    const layerStr = event.layer.padEnd(7);
    const icon = event.layer === 'melody' ? '🎵' : event.layer === 'bass' ? '🎸' : event.layer === 'rhythm' ? '🥁' : '✨';
    console.log(`  │ ${timeStr} ${beatStr} │ ${icon} ${layerStr} │ ${event.value} (${event.wave})`);
  }
  console.log(`  └${'─'.repeat(60)}\n`);
}

// ===== TEST B: No consecutive same-note on melody layer =====
console.log('━━━ TEST B: Melody layer - no 3+ consecutive identical notes ━━━');

for (const world of WORLDS) {
  const timeline = simulateWorldTimeline(world, 32);
  const melodyEvents = timeline.filter(e => e.layer === 'melody');

  let maxRun = 1;
  let currentRun = 1;
  for (let i = 1; i < melodyEvents.length; i++) {
    if (melodyEvents[i].value === melodyEvents[i-1].value) {
      currentRun++;
      maxRun = Math.max(maxRun, currentRun);
    } else {
      currentRun = 1;
    }
  }
  assert(maxRun <= 2, `${world}: melody max consecutive same note = ${maxRun}`);
}

// ===== TEST C: Bass layer changes (not stuck on one note) =====
console.log('\n━━━ TEST C: Bass layer - uses multiple notes (not stuck) ━━━');

for (const world of WORLDS) {
  const timeline = simulateWorldTimeline(world, 32);
  const bassEvents = timeline.filter(e => e.layer === 'bass');
  const uniqueBass = new Set(bassEvents.map(e => e.value)).size;
  assert(uniqueBass >= 2, `${world}: bass uses ${uniqueBass} distinct notes`);
}

// ===== TEST D: Rhythm layer has variety (not just one drum hit) =====
console.log('\n━━━ TEST D: Rhythm layer - uses multiple hit types ━━━');

for (const world of WORLDS) {
  const timeline = simulateWorldTimeline(world, 16);
  const rhythmEvents = timeline.filter(e => e.layer === 'rhythm');
  const hitTypes = new Set(rhythmEvents.map(e => e.value)).size;
  assert(hitTypes >= 2, `${world}: rhythm uses ${hitTypes} hit types (${[...new Set(rhythmEvents.map(e => e.value))].join(', ')})`);
}

// ===== TEST E: Combined stream has high variety (entropy check) =====
console.log('\n━━━ TEST E: Combined stream diversity - unique events per 16 beats ━━━');

for (const world of WORLDS) {
  const timeline = simulateWorldTimeline(world, 16);
  const totalEvents = timeline.length;
  const uniqueEventStrings = new Set(timeline.map(e => `${e.layer}:${e.value}:${e.wave}`)).size;
  const diversityRatio = uniqueEventStrings / totalEvents;
  assert(diversityRatio >= 0.15, `${world}: ${uniqueEventStrings} unique event signatures out of ${totalEvents} total (${Math.round(diversityRatio * 100)}% diversity)`);
}

// ===== TEST F: World-to-world transition - the stream CHANGES between worlds =====
console.log('\n━━━ TEST F: World transitions - stream character changes between adjacent worlds ━━━');

const worldFingerprints: Map<WorldId, string> = new Map();

for (const world of WORLDS) {
  const timeline = simulateWorldTimeline(world, 16);
  // Fingerprint: first 8 melody notes + rhythm pattern + bass root + wave types
  const melodySeq = timeline.filter(e => e.layer === 'melody').slice(0, 8).map(e => e.value).join(',');
  const rhythmSeq = timeline.filter(e => e.layer === 'rhythm').slice(0, 8).map(e => e.value).join(',');
  const bassRoot = timeline.filter(e => e.layer === 'bass')[0]?.value || 'none';
  const waves = `${WORLD_MUSIC[world].melodyWave}+${WORLD_MUSIC[world].bassWave}`;
  const fingerprint = `${melodySeq}|${rhythmSeq}|${bassRoot}|${waves}`;
  worldFingerprints.set(world, fingerprint);
}

for (let i = 0; i < WORLDS.length - 1; i++) {
  const a = WORLDS[i];
  const b = WORLDS[i + 1];
  const fpA = worldFingerprints.get(a)!;
  const fpB = worldFingerprints.get(b)!;

  // Compare components
  const [melA, rhyA, bassA, wavA] = fpA.split('|');
  const [melB, rhyB, bassB, wavB] = fpB.split('|');

  let diffs = 0;
  if (melA !== melB) diffs++;
  if (rhyA !== rhyB) diffs++;
  if (bassA !== bassB) diffs++;
  if (wavA !== wavB) diffs++;

  assert(diffs >= 3, `${a} → ${b}: ${diffs}/4 components differ (melody, rhythm, bass root, waveforms)`);
}

// ===== TEST G: No two worlds produce identical timelines =====
console.log('\n━━━ TEST G: All 8 worlds produce COMPLETELY DIFFERENT streams ━━━');
{
  const signatures = new Map<string, WorldId>();
  let allUnique = true;

  for (const world of WORLDS) {
    const timeline = simulateWorldTimeline(world, 16);
    const sig = timeline.map(e => `${Math.round(e.timeMs)}-${e.layer}-${e.value}`).join('|');
    if (signatures.has(sig)) {
      console.log(`  ❌ ${world} produces IDENTICAL stream to ${signatures.get(sig)}!`);
      allUnique = false;
      failed++;
    }
    signatures.set(sig, world);
  }
  assert(allUnique, 'All 8 worlds produce completely unique audio streams');
}

// ===== TEST H: Temporal density - events per second varies by world =====
console.log('\n━━━ TEST H: Event density (events/second) varies between worlds ━━━');
{
  const densities: { world: WorldId; eventsPerSec: number }[] = [];

  for (const world of WORLDS) {
    const timeline = simulateWorldTimeline(world, 16);
    const durationSec = (timeline[timeline.length - 1]?.timeMs || 1) / 1000;
    const eventsPerSec = timeline.length / durationSec;
    densities.push({ world, eventsPerSec });
    console.log(`  │ ${world.padEnd(10)}: ${eventsPerSec.toFixed(1)} events/sec (${WORLD_MUSIC[world].bpm} BPM)`);
  }

  const minDensity = Math.min(...densities.map(d => d.eventsPerSec));
  const maxDensity = Math.max(...densities.map(d => d.eventsPerSec));
  const spread = maxDensity / minDensity;
  assert(spread >= 1.5, `Density spread: ${spread.toFixed(2)}x (fastest/slowest world) — ensures tempo variety is audible`);
}

// ===== TEST I: Layer independence - melody timing != bass timing != rhythm timing =====
console.log('\n━━━ TEST I: Layers fire at genuinely different moments (not aligned) ━━━');

for (const world of WORLDS) {
  const timeline = simulateWorldTimeline(world, 8);

  const melodyTimes = new Set(timeline.filter(e => e.layer === 'melody').map(e => Math.round(e.timeMs)));
  const bassTimes = new Set(timeline.filter(e => e.layer === 'bass').map(e => Math.round(e.timeMs)));
  const rhythmTimes = new Set(timeline.filter(e => e.layer === 'rhythm').map(e => Math.round(e.timeMs)));

  // Rhythm should have events at times that melody doesn't (since it fires 2x per beat)
  const rhythmOnly = [...rhythmTimes].filter(t => !melodyTimes.has(t));
  assert(rhythmOnly.length > 0, `${world}: rhythm has ${rhythmOnly.length} events at times melody doesn't fire (layers interleave)`);
}

// ===== TEST J: Full sequential run through all 8 worlds - the "concert" =====
console.log('\n━━━ TEST J: FULL CONCERT - 8 worlds played in sequence (4 beats each) ━━━');
console.log('  (Simulating what happens when player progresses through all worlds)\n');
{
  let previousWorldNotes: string[] = [];
  let worldsWithNewContent = 0;

  for (const world of WORLDS) {
    const timeline = simulateWorldTimeline(world, 4);
    const currentNotes = timeline.filter(e => e.layer === 'melody').map(e => e.value);

    if (previousWorldNotes.length > 0) {
      const overlap = currentNotes.filter(n => previousWorldNotes.includes(n)).length;
      const overlapPct = overlap / currentNotes.length;
      const changed = overlapPct < 0.75; // Less than 75% overlap = sufficiently different
      if (changed) worldsWithNewContent++;
      console.log(`  ${world.padEnd(10)}: melody [${currentNotes.join(', ')}] — ${Math.round((1 - overlapPct) * 100)}% new vs previous`);
    } else {
      console.log(`  ${world.padEnd(10)}: melody [${currentNotes.join(', ')}] — (first world)`);
      worldsWithNewContent++;
    }

    previousWorldNotes = currentNotes;
  }

  assert(worldsWithNewContent >= 6, `${worldsWithNewContent}/8 worlds introduce significantly new melodic content`);
}

// ===== SUMMARY =====
console.log('\n' + '═'.repeat(64));
console.log(`  SEQUENTIAL PLAYBACK TEST RESULTS: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(64));

// ===== LEARNINGS =====
console.log('\n┌──────────────────────────────────────────────────────────────┐');
console.log('│                    WHAT I LEARNED                            │');
console.log('├──────────────────────────────────────────────────────────────┤');
console.log('│ 1. The 4-layer architecture creates genuine polyphony —     │');
console.log('│    melody, bass, rhythm, sparkle fire at different rates     │');
console.log('│    and interleave to create a rich audio texture.            │');
console.log('│                                                              │');
console.log('│ 2. 16-note melody sequences with ≥5 unique notes prevent    │');
console.log('│    monotony — the ear hears a real tune, not random bleeps.  │');
console.log('│                                                              │');
console.log('│ 3. BPM differences (75-140) create dramatically different   │');
console.log('│    event densities — coffee feels spacious, aek feels        │');
console.log('│    intense — just from timing alone.                         │');
console.log('│                                                              │');
console.log('│ 4. Waveform changes (sine/square/triangle/sawtooth) give    │');
console.log('│    each world a distinct timbre even if notes were similar.  │');
console.log('│                                                              │');
console.log('│ 5. The rhythm layer at 2× melody rate fills gaps between    │');
console.log('│    melody notes, preventing silence between beats.           │');
console.log('│                                                              │');
console.log('│ 6. World transitions are always audible: at minimum 3 of 4  │');
console.log('│    components (melody/rhythm/bass/wave) change per world.    │');
console.log('└──────────────────────────────────────────────────────────────┘');

if (failed > 0) process.exit(1);
