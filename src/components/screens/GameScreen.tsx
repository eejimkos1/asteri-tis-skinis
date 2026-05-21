import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { generateQuestions } from '../../data/questions';
import { WORLDS } from '../../data/worlds';
import { Question } from '../../types';
import { Hearts } from '../common/Hearts';
import { Confetti } from '../common/Confetti';
import { FloatingElements } from '../common/FloatingElements';
import { MusicToggle } from '../common/MusicToggle';

const ANSWER_COLORS = [
  'rgba(255, 107, 157, 0.2)',
  'rgba(157, 107, 255, 0.2)',
  'rgba(107, 200, 255, 0.2)',
  'rgba(255, 200, 107, 0.2)',
];

export function GameScreen() {
  const { state, dispatch } = useGame();
  const { playSfx, playBgMusic } = useAudio();
  const { currentWorld, currentLevel } = state;
  const world = WORLDS.find(w => w.id === currentWorld);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (currentWorld) {
      const qs = generateQuestions(currentWorld, state.progress.currentTier, 10);
      setQuestions(qs);
      playBgMusic(currentWorld);
    }
  }, [currentWorld, state.progress.currentTier, playBgMusic]);

  const handleAnswer = useCallback((selected: number) => {
    if (answered !== null) return;
    const question = questions[currentQ];
    if (!question) return;

    setAnswered(selected);
    const isCorrect = selected === question.correctAnswer;

    if (isCorrect) {
      playSfx('correct');
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      playSfx('wrong');
      setHearts(h => h - 1);
      setStreak(0);
    }

    setTimeout(() => {
      if (hearts <= 1 && !isCorrect) {
        finishLevel(correct, false);
        return;
      }
      if (currentQ >= 9) {
        finishLevel(correct + (isCorrect ? 1 : 0), true);
        return;
      }
      setCurrentQ(q => q + 1);
      setAnswered(null);
    }, 1200);
  }, [answered, currentQ, questions, hearts, correct, playSfx]);

  function finishLevel(finalCorrect: number, completed: boolean) {
    const time = Math.round((Date.now() - startTime) / 1000);
    let stars = 0;
    if (completed) {
      if (finalCorrect >= 9) stars = 3;
      else if (finalCorrect >= 7) stars = 2;
      else if (finalCorrect >= 5) stars = 1;
    }

    playSfx('levelComplete');

    dispatch({
      type: 'COMPLETE_LEVEL',
      result: {
        worldId: currentWorld!,
        levelIndex: currentLevel,
        stars,
        correct: finalCorrect,
        total: 10,
        time,
      },
    });
  }

  if (!world || questions.length === 0) return null;

  const question = questions[currentQ];
  if (!question) return null;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: `linear-gradient(180deg, #1a0033, ${world.colors.primary}15, #1a0033)`,
      position: 'relative',
      overflow: 'hidden',
      padding: '16px',
    }}>
      <FloatingElements elements={world.floatingElements} count={10} />
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        zIndex: 1,
      }}>
        <Hearts total={3} remaining={hearts} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {streak >= 3 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{
                fontSize: '16px',
                color: '#FFD700',
                animation: 'fireGlow 1s ease infinite',
              }}
            >
              🔥{streak}
            </motion.span>
          )}
          <MusicToggle />
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        display: 'flex',
        gap: '6px',
        justifyContent: 'center',
        marginBottom: '20px',
        zIndex: 1,
      }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            animate={i === currentQ ? { scale: [1, 1.4, 1], boxShadow: [`0 0 4px ${world.colors.primary}`, `0 0 12px ${world.colors.primary}`, `0 0 4px ${world.colors.primary}`] } : {}}
            transition={i === currentQ ? { duration: 1.2, repeat: Infinity } : {}}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i < currentQ
                ? 'var(--color-success)'
                : i === currentQ
                  ? world.colors.primary
                  : 'rgba(255, 255, 255, 0.15)',
              boxShadow: i < currentQ ? '0 0 6px var(--color-success)' : 'none',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: `2px solid ${world.colors.primary}50`,
            marginBottom: '24px',
            zIndex: 1,
            boxShadow: `0 8px 32px ${world.colors.primary}25, inset 0 0 20px ${world.colors.primary}10, 0 0 15px ${world.colors.primary}15`,
          }}
        >
          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            textAlign: 'center',
            fontFamily: question.text.includes('×') || question.text.includes('÷')
              ? 'var(--font-numbers)' : 'var(--font-body)',
          }}>
            {question.text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Answer buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        zIndex: 1,
        flex: 1,
        alignContent: 'start',
      }}>
        {question.options.map((option, i) => {
          const isSelected = answered === option;
          const isCorrectAnswer = option === question.correctAnswer;
          const showResult = answered !== null;

          let bg = ANSWER_COLORS[i];
          let borderColor = 'rgba(255, 255, 255, 0.15)';
          let shadow = 'none';

          if (showResult) {
            if (isCorrectAnswer) {
              bg = 'rgba(0, 230, 118, 0.3)';
              borderColor = '#00E676';
              shadow = '0 0 20px rgba(0, 230, 118, 0.4)';
            } else if (isSelected && !isCorrectAnswer) {
              bg = 'rgba(255, 82, 82, 0.3)';
              borderColor = '#FF5252';
              shadow = '0 0 15px rgba(255, 82, 82, 0.3)';
            }
          }

          return (
            <motion.button
              key={option}
              onClick={() => handleAnswer(option)}
              whileTap={answered === null ? { scale: 0.93 } : {}}
              whileHover={answered === null ? { scale: 1.03, boxShadow: `0 0 20px ${world.colors.primary}40` } : {}}
              animate={showResult && isSelected && !isCorrectAnswer ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: bg,
                border: `2px solid ${borderColor}`,
                boxShadow: shadow,
                color: 'white',
                fontSize: '22px',
                fontFamily: 'var(--font-numbers)',
                fontWeight: 600,
                cursor: answered === null ? 'pointer' : 'default',
                backdropFilter: 'blur(10px)',
                minHeight: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Encouragement on wrong answer */}
      <AnimatePresence>
        {answered !== null && answered !== question.correctAnswer && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#FFB6C1',
              marginTop: '12px',
              zIndex: 1,
              textShadow: '0 0 8px rgba(255, 182, 193, 0.3)',
            }}
          >
            Δεν πειράζει! Προσπάθησε ξανά! 💪
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
