import { WorldId } from '../types';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function createOscillator(
  ctx: AudioContext,
  type: OscillatorType,
  frequency: number,
  startTime: number,
  duration: number,
  gainValue: number,
  destination: AudioNode
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(gainValue, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playCorrectSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  // Magical ascending chime: C5 -> E5 -> G5
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    createOscillator(ctx, 'sine', freq, now + i * 0.1, 0.4, 0.3, ctx.destination);
    createOscillator(ctx, 'triangle', freq * 2, now + i * 0.1, 0.2, 0.1, ctx.destination);
  });
}

export function playWrongSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  // Soft descending tone: E4 -> C4
  createOscillator(ctx, 'sine', 329.63, now, 0.3, 0.2, ctx.destination);
  createOscillator(ctx, 'sine', 261.63, now + 0.15, 0.3, 0.2, ctx.destination);
}

export function playStarSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  // Sparkly pling
  createOscillator(ctx, 'sine', 1200, now, 0.15, 0.2, ctx.destination);
  createOscillator(ctx, 'sine', 1500, now + 0.08, 0.15, 0.15, ctx.destination);
  createOscillator(ctx, 'triangle', 2000, now + 0.12, 0.1, 0.1, ctx.destination);
}

export function playLevelCompleteSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  // Triumphant fanfare: C4 -> E4 -> G4 -> C5, with harmony
  const melody = [261.63, 329.63, 392.0, 523.25];
  melody.forEach((freq, i) => {
    createOscillator(ctx, 'sine', freq, now + i * 0.2, 0.6, 0.25, ctx.destination);
    createOscillator(ctx, 'triangle', freq * 1.5, now + i * 0.2, 0.4, 0.1, ctx.destination);
    createOscillator(ctx, 'square', freq * 0.5, now + i * 0.2, 0.3, 0.05, ctx.destination);
  });
  // Final chord sustain
  createOscillator(ctx, 'sine', 523.25, now + 0.8, 1.0, 0.2, ctx.destination);
  createOscillator(ctx, 'sine', 659.25, now + 0.8, 1.0, 0.15, ctx.destination);
  createOscillator(ctx, 'sine', 783.99, now + 0.8, 1.0, 0.15, ctx.destination);
}

export function playButtonSound(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  // Soft bubble pop
  createOscillator(ctx, 'sine', 600, now, 0.08, 0.15, ctx.destination);
  createOscillator(ctx, 'sine', 800, now + 0.03, 0.06, 0.1, ctx.destination);
}

// --- MULTI-LAYER BACKGROUND MUSIC ENGINE ---

interface MusicEngine {
  intervalIds: number[];
  isPlaying: boolean;
}

let engine: MusicEngine = { intervalIds: [], isPlaying: false };

function createNoise(
  ctx: AudioContext,
  startTime: number,
  duration: number,
  gainValue: number,
  destination: AudioNode,
  highpass: number = 5000
): void {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = highpass;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainValue, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(startTime);
  source.stop(startTime + duration);
}

interface WorldMusic {
  bpm: number;
  melodyWave: OscillatorType;
  melodyNotes: number[];
  bassWave: OscillatorType;
  bassNotes: number[];
  rhythmPattern: ('kick' | 'snare' | 'hat' | 'rest')[];
  sparkleWave: OscillatorType;
  sparkleOctave: number;
  sparkleProb: number;
}

const N = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
  Bb3: 233.08, Eb4: 311.13, Ab4: 415.3, Bb4: 466.16,
  Fs4: 369.99, Cs4: 277.18,
};

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

export function startBackgroundMusic(worldId: WorldId, volume: number = 0.12): void {
  stopBackgroundMusic();

  const ctx = getAudioContext();
  const music = WORLD_MUSIC[worldId];
  const beatMs = 60000 / music.bpm;

  let melodyStep = 0;
  let bassStep = 0;
  let rhythmStep = 0;

  const melodyInterval = window.setInterval(() => {
    if (!engine.isPlaying) return;
    const now = ctx.currentTime;
    const note = music.melodyNotes[melodyStep % music.melodyNotes.length];
    const dur = (beatMs / 1000) * 0.8;
    createOscillator(ctx, music.melodyWave, note, now, dur, volume * 1.2, ctx.destination);
    if (music.sparkleProb > 0 && Math.random() < music.sparkleProb) {
      createOscillator(ctx, music.sparkleWave, note * music.sparkleOctave, now + dur * 0.3, dur * 0.5, volume * 0.3, ctx.destination);
    }
    melodyStep++;
  }, beatMs);

  const bassInterval = window.setInterval(() => {
    if (!engine.isPlaying) return;
    const now = ctx.currentTime;
    const note = music.bassNotes[bassStep % music.bassNotes.length];
    const dur = (beatMs * 2 / 1000) * 0.9;
    createOscillator(ctx, music.bassWave, note, now, dur, volume * 0.8, ctx.destination);
    bassStep++;
  }, beatMs * 2);

  const rhythmInterval = window.setInterval(() => {
    if (!engine.isPlaying) return;
    const now = ctx.currentTime;
    const hit = music.rhythmPattern[rhythmStep % music.rhythmPattern.length];
    if (hit === 'kick') {
      createOscillator(ctx, 'sine', 60, now, 0.1, volume * 0.7, ctx.destination);
      createOscillator(ctx, 'sine', 100, now, 0.05, volume * 0.5, ctx.destination);
    } else if (hit === 'snare') {
      createNoise(ctx, now, 0.08, volume * 0.4, ctx.destination, 3000);
      createOscillator(ctx, 'triangle', 200, now, 0.05, volume * 0.3, ctx.destination);
    } else if (hit === 'hat') {
      createNoise(ctx, now, 0.03, volume * 0.25, ctx.destination, 8000);
    }
    rhythmStep++;
  }, beatMs / 2);

  const sparkleInterval = window.setInterval(() => {
    if (!engine.isPlaying) return;
    if (Math.random() > 0.4) return;
    const now = ctx.currentTime;
    const note = music.melodyNotes[Math.floor(Math.random() * music.melodyNotes.length)];
    createOscillator(ctx, 'sine', note * 2, now, 0.3, volume * 0.2, ctx.destination);
    if (Math.random() > 0.5) {
      createOscillator(ctx, 'sine', note * 2.5, now + 0.1, 0.2, volume * 0.12, ctx.destination);
    }
  }, beatMs * 4);

  engine.isPlaying = true;
  engine.intervalIds = [melodyInterval, bassInterval, rhythmInterval, sparkleInterval];
}

export function stopBackgroundMusic(): void {
  engine.intervalIds.forEach(id => clearInterval(id));
  engine.intervalIds = [];
  engine.isPlaying = false;
}

export function isMusicPlaying(): boolean {
  return engine.isPlaying;
}
