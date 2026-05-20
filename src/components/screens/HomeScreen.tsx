import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { FloatingElements } from '../common/FloatingElements';

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const { totalStars } = state.progress;
  const playerName = localStorage.getItem('asteri-player-name') || 'Σταρ';

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
        Γεια σου, {playerName}! ✨
      </motion.p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1, width: '100%', maxWidth: '280px' }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'worldMap' })} variant="primary" size="large">
          ΠΑΙΞΕ! 🎮
        </Button>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'trophy' })} variant="secondary" size="medium">
          Τα Βραβεία μου 🏆
        </Button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'settings' })} variant="secondary" size="small">
            ⚙️
          </Button>
          <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'leaderboard' })} variant="secondary" size="small">
            🏅
          </Button>
        </div>
      </div>
    </div>
  );
}
