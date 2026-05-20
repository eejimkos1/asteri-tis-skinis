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

// --- BACKGROUND MUSIC GENERATOR ---

interface MusicLoop {
  intervalId: number | null;
  isPlaying: boolean;
}

let currentLoop: MusicLoop = { intervalId: null, isPlaying: false };

const WORLD_MUSIC_CONFIG: Record<WorldId, {
  scale: number[];
  tempo: number;
  waveform: OscillatorType;
  bassWave: OscillatorType;
  style: 'gentle' | 'upbeat' | 'dreamy' | 'jazzy' | 'tropical' | 'stadium' | 'lofi';
}> = {
  beauty: {
    scale: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33],
    tempo: 400,
    waveform: 'sine',
    bassWave: 'sine',
    style: 'gentle',
  },
  dance: {
    scale: [329.63, 369.99, 415.3, 493.88, 554.37, 659.25, 739.99],
    tempo: 250,
    waveform: 'square',
    bassWave: 'sawtooth',
    style: 'upbeat',
  },
  singing: {
    scale: [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 659.25],
    tempo: 350,
    waveform: 'triangle',
    bassWave: 'sine',
    style: 'dreamy',
  },
  chocolate: {
    scale: [261.63, 311.13, 349.23, 392.0, 466.16, 523.25, 622.25],
    tempo: 380,
    waveform: 'sine',
    bassWave: 'triangle',
    style: 'jazzy',
  },
  parrots: {
    scale: [329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99],
    tempo: 280,
    waveform: 'triangle',
    bassWave: 'sine',
    style: 'tropical',
  },
  aek: {
    scale: [196.0, 246.94, 293.66, 329.63, 392.0, 440.0, 493.88],
    tempo: 300,
    waveform: 'sawtooth',
    bassWave: 'square',
    style: 'stadium',
  },
  coffee: {
    scale: [220.0, 261.63, 293.66, 349.23, 392.0, 440.0, 523.25],
    tempo: 450,
    waveform: 'sine',
    bassWave: 'triangle',
    style: 'lofi',
  },
};

export function startBackgroundMusic(worldId: WorldId, volume: number = 0.12): void {
  stopBackgroundMusic();

  const ctx = getAudioContext();
  const config = WORLD_MUSIC_CONFIG[worldId];
  let beatCount = 0;

  const playBeat = () => {
    if (!currentLoop.isPlaying) return;
    const now = ctx.currentTime;
    const { scale, waveform, bassWave, style } = config;

    // Melody note
    const noteIdx = Math.floor(Math.random() * scale.length);
    const freq = scale[noteIdx];

    if (style === 'upbeat' || style === 'stadium') {
      // Rhythmic pattern - play on every beat with accents
      if (beatCount % 4 === 0) {
        createOscillator(ctx, waveform, freq, now, 0.2, volume * 1.5, ctx.destination);
        // Bass drum feel
        createOscillator(ctx, bassWave, scale[0] * 0.5, now, 0.15, volume * 0.8, ctx.destination);
      } else if (beatCount % 2 === 0) {
        createOscillator(ctx, waveform, freq * 0.75, now, 0.15, volume, ctx.destination);
      } else {
        // Hi-hat feel
        createOscillator(ctx, 'square', 1200 + Math.random() * 400, now, 0.03, volume * 0.3, ctx.destination);
      }
    } else if (style === 'gentle' || style === 'lofi') {
      // Arpeggiated gentle notes with long decay
      if (beatCount % 3 === 0) {
        createOscillator(ctx, waveform, freq, now, 0.6, volume, ctx.destination);
      }
      if (beatCount % 6 === 0) {
        createOscillator(ctx, bassWave, scale[0] * 0.5, now, 0.8, volume * 0.5, ctx.destination);
      }
      // Soft sparkle on random beats
      if (Math.random() > 0.7) {
        createOscillator(ctx, 'sine', freq * 2, now + 0.1, 0.15, volume * 0.3, ctx.destination);
      }
    } else if (style === 'dreamy') {
      // Layered pads
      if (beatCount % 4 === 0) {
        createOscillator(ctx, waveform, freq, now, 1.0, volume * 0.8, ctx.destination);
        createOscillator(ctx, 'sine', freq * 1.5, now, 0.8, volume * 0.3, ctx.destination);
      }
      if (beatCount % 8 === 0) {
        createOscillator(ctx, bassWave, scale[0], now, 1.2, volume * 0.5, ctx.destination);
      }
    } else if (style === 'jazzy') {
      // Swing feel with chromatic passing tones
      if (beatCount % 4 === 0 || beatCount % 4 === 2) {
        createOscillator(ctx, waveform, freq, now, 0.3, volume, ctx.destination);
      }
      if (beatCount % 4 === 1) {
        const passingTone = freq * 1.06; // chromatic
        createOscillator(ctx, waveform, passingTone, now, 0.15, volume * 0.5, ctx.destination);
      }
      if (beatCount % 8 === 0) {
        createOscillator(ctx, bassWave, scale[0] * 0.5, now, 0.5, volume * 0.6, ctx.destination);
        createOscillator(ctx, bassWave, scale[2] * 0.5, now + 0.25, 0.3, volume * 0.4, ctx.destination);
      }
    } else if (style === 'tropical') {
      // Bossa nova feel with syncopation
      if (beatCount % 8 === 0 || beatCount % 8 === 3 || beatCount % 8 === 5) {
        createOscillator(ctx, waveform, freq, now, 0.25, volume, ctx.destination);
      }
      // Marimba-like double hits
      if (beatCount % 4 === 0) {
        createOscillator(ctx, 'sine', freq * 2, now, 0.08, volume * 0.6, ctx.destination);
        createOscillator(ctx, 'sine', freq * 2, now + 0.06, 0.08, volume * 0.4, ctx.destination);
      }
      if (beatCount % 8 === 0) {
        createOscillator(ctx, bassWave, scale[0] * 0.5, now, 0.4, volume * 0.5, ctx.destination);
      }
    }

    beatCount++;
  };

  currentLoop.isPlaying = true;
  currentLoop.intervalId = window.setInterval(playBeat, config.tempo);
  playBeat();
}

export function stopBackgroundMusic(): void {
  if (currentLoop.intervalId !== null) {
    clearInterval(currentLoop.intervalId);
    currentLoop.intervalId = null;
  }
  currentLoop.isPlaying = false;
}

export function isMusicPlaying(): boolean {
  return currentLoop.isPlaying;
}
