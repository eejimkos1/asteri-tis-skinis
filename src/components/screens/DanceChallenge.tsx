import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { DANCE_SEQUENCES, MOVE_LABELS } from '../../data/danceSequences';
import { DanceMove, DanceSequence } from '../../types';
import { FloatingElements } from '../common/FloatingElements';
import { WORLDS } from '../../data/worlds';

const MOVE_EMOJIS: Record<DanceMove, string> = {
  spin: '🌀',
  jump: '⬆️',
  clap: '👏',
  kick: '🦶',
  wave: '👋',
};

export function DanceChallenge() {
  const { state, dispatch } = useGame();
  const { playSfx, playBgMusic } = useAudio();
  const world = WORLDS.find(w => w.id === state.currentWorld);

  const [phase, setPhase] = useState<'watching' | 'answering' | 'result'>('watching');
  const [currentMoveIdx, setCurrentMoveIdx] = useState(-1);
  const [sequence, setSequence] = useState<DanceSequence | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    const tier = state.progress.currentTier;
    let pool;
    if (tier <= 2) pool = DANCE_SEQUENCES.easy;
    else if (tier <= 4) pool = DANCE_SEQUENCES.medium;
    else pool = DANCE_SEQUENCES.hard;

    const seq = pool[Math.floor(Math.random() * pool.length)];
    setSequence(seq);

    if (state.currentWorld) {
      playBgMusic(state.currentWorld);
    }
  }, [state.progress.currentTier, state.currentWorld, playBgMusic]);

  useEffect(() => {
    if (!sequence || phase !== 'watching') return;

    let idx = 0;
    setCurrentMoveIdx(0);

    const interval = setInterval(() => {
      idx++;
      if (idx >= sequence.moves.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('answering'), 800);
      } else {
        setCurrentMoveIdx(idx);
      }
    }, sequence.speed);

    return () => clearInterval(interval);
  }, [sequence, phase]);

  const handleAnswer = useCallback((answer: number) => {
    if (!sequence || selectedAnswer !== null) return;
    setSelectedAnswer(answer);

    const correctAnswer = sequence.multiplier
      ? sequence.correctCount * sequence.multiplier
      : sequence.correctCount;

    const isCorrect = answer === correctAnswer;

    if (isCorrect) playSfx('correct');
    else playSfx('wrong');

    setTimeout(() => {
      dispatch({ type: 'COMPLETE_DANCE', correct: isCorrect });
    }, 1500);
  }, [sequence, selectedAnswer, playSfx, dispatch]);

  if (!sequence || !world) return null;

  const correctAnswer = sequence.multiplier
    ? sequence.correctCount * sequence.multiplier
    : sequence.correctCount;

  const options = generateDanceOptions(correctAnswer);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: `linear-gradient(180deg, #0a001a, ${world.colors.primary}20, #0a001a)`,
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>
      <FloatingElements elements={['💃', '🎵', '🎶', '✨']} count={8} />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '22px',
          color: '#FFD700',
          marginBottom: '16px',
          zIndex: 1,
        }}
      >
        Πρόκληση Χορού! 💃
      </motion.h2>

      {/* Stage area */}
      <div style={{
        width: '100%',
        maxWidth: '300px',
        height: '200px',
        borderRadius: 'var(--radius-lg)',
        background: 'radial-gradient(ellipse at center bottom, rgba(255, 215, 0, 0.1), transparent)',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: '20px',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        {/* Spotlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '100%',
          background: 'radial-gradient(ellipse at top, rgba(255, 215, 0, 0.15), transparent 70%)',
        }} />

        {/* Dancer */}
        <AnimatePresence mode="wait">
          {phase === 'watching' && currentMoveIdx >= 0 && currentMoveIdx < sequence.moves.length && (
            <motion.div
              key={currentMoveIdx}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: '80px', textAlign: 'center' }}
            >
              {MOVE_EMOJIS[sequence.moves[currentMoveIdx]]}
            </motion.div>
          )}
        </AnimatePresence>

        {phase === 'answering' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: '16px', textAlign: 'center', padding: '20px' }}
          >
            Πόσ{sequence.targetMove === 'spin' ? 'ες' : 'α'} {MOVE_LABELS[sequence.targetMove]} είδες;
            {sequence.multiplier && (
              <span style={{ display: 'block', marginTop: '8px', fontSize: '14px', opacity: 0.7 }}>
                (× {sequence.multiplier} φορές)
              </span>
            )}
          </motion.p>
        )}
      </div>

      {/* Beat indicator */}
      {phase === 'watching' && (
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '20px',
          zIndex: 1,
        }}>
          {sequence.moves.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                background: i === currentMoveIdx ? '#FFD700' : i < currentMoveIdx ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                scale: i === currentMoveIdx ? 1.3 : 1,
              }}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
              }}
            />
          ))}
        </div>
      )}

      {/* Answer buttons */}
      {phase === 'answering' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            width: '100%',
            maxWidth: '300px',
            zIndex: 1,
          }}
        >
          {options.map(opt => {
            let bg = 'rgba(255, 255, 255, 0.1)';
            let border = 'rgba(255, 255, 255, 0.2)';

            if (selectedAnswer !== null) {
              if (opt === correctAnswer) {
                bg = 'rgba(0, 230, 118, 0.3)';
                border = '#00E676';
              } else if (opt === selectedAnswer) {
                bg = 'rgba(255, 82, 82, 0.3)';
                border = '#FF5252';
              }
            }

            return (
              <motion.button
                key={opt}
                onClick={() => handleAnswer(opt)}
                whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  background: bg,
                  border: `2px solid ${border}`,
                  color: 'white',
                  fontSize: '24px',
                  fontFamily: 'var(--font-numbers)',
                  fontWeight: 600,
                  cursor: selectedAnswer === null ? 'pointer' : 'default',
                }}
              >
                {opt}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

function generateDanceOptions(correct: number): number[] {
  const options = new Set<number>([correct]);
  const candidates = [correct - 1, correct + 1, correct - 2, correct + 2, correct * 2, Math.max(1, correct - 3)];
  for (const c of candidates) {
    if (c > 0 && c !== correct) options.add(c);
    if (options.size >= 4) break;
  }
  while (options.size < 4) {
    options.add(correct + options.size);
  }
  return shuffleArray(Array.from(options).slice(0, 4));
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
