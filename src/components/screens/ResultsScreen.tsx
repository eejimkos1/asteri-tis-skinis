import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { StarDisplay } from '../common/StarDisplay';
import { Confetti } from '../common/Confetti';
import { WORLDS } from '../../data/worlds';

export function ResultsScreen() {
  const { state, dispatch } = useGame();
  const { currentWorld, currentLevel, isDanceChallenge } = state;
  const world = WORLDS.find(w => w.id === currentWorld);

  const lastResult = currentWorld && !isDanceChallenge
    ? state.progress.levelResults[`${currentWorld}-${currentLevel}`]
    : null;

  const stars = lastResult?.stars || 0;
  const correct = lastResult?.correct || 0;
  const total = lastResult?.total || 10;
  const time = lastResult?.time || 0;

  const messages = [
    { min: 3, text: 'ΤΕΛΕΙΑ! Είσαι αστέρι! 🌟', color: '#FFD700' },
    { min: 2, text: 'Πολύ καλά! Συνέχισε έτσι! 💫', color: '#C44FE2' },
    { min: 1, text: 'Μπράβο! Προσπάθησε ξανά για περισσότερα αστέρια! ✨', color: '#FF6B9D' },
    { min: 0, text: 'Δεν πειράζει! Θα τα καταφέρεις! 💪', color: '#FFB6C1' },
  ];

  const message = messages.find(m => stars >= m.min) || messages[3];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(180deg, #1a0033, ${world?.colors.primary || '#C44FE2'}20, #1a0033)`,
      padding: '30px',
      gap: '24px',
      position: 'relative',
    }}>
      <Confetti active={stars >= 2} count={stars === 3 ? 50 : 20} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        <StarDisplay count={stars} size={44} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          color: message.color,
          textAlign: 'center',
        }}
      >
        {message.text}
      </motion.h2>

      {!isDanceChallenge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
            <span style={{ opacity: 0.7 }}>Σωστές:</span>
            <span style={{ fontFamily: 'var(--font-numbers)', fontWeight: 600 }}>{correct}/{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
            <span style={{ opacity: 0.7 }}>Χρόνος:</span>
            <span style={{ fontFamily: 'var(--font-numbers)', fontWeight: 600 }}>
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}
      >
        <Button
          onClick={() => dispatch({ type: 'SELECT_LEVEL', level: currentLevel, isDance: isDanceChallenge })}
          variant="secondary"
          size="medium"
        >
          Ξανά 🔄
        </Button>
        <Button
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'levelSelect' })}
          variant="primary"
          size="medium"
        >
          Συνέχεια ➡️
        </Button>
        <Button
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'worldMap' })}
          variant="secondary"
          size="small"
        >
          Χάρτης 🗺️
        </Button>
      </motion.div>
    </div>
  );
}
