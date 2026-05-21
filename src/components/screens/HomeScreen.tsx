import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { FloatingElements } from '../common/FloatingElements';

export function HomeScreen() {
  const { state, dispatch } = useGame();
  const { currentUser, logout } = useUser();
  const { totalStars } = state.progress;

  const handleLogout = () => {
    logout();
    dispatch({ type: 'SET_SCREEN', screen: 'auth' });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a0033, #2d0066, #4a0080, #2d0066, #1a0033)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 12s ease infinite',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      gap: '20px',
    }}>
      <FloatingElements elements={['✨', '💫', '⭐', '🌟', '💖', '🩷', '🎵', '💎']} count={18} />

      <motion.div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 215, 0, 0.15)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(255, 215, 0, 0.4)',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.2), inset 0 0 10px rgba(255, 215, 0, 0.1)',
        }}
        animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 20px rgba(255, 215, 0, 0.2)', '0 0 35px rgba(255, 215, 0, 0.5)', '0 0 20px rgba(255, 215, 0, 0.2)'] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span style={{ fontSize: '20px' }}>⭐</span>
        <span style={{ fontFamily: 'var(--font-numbers)', fontSize: '20px', color: '#FFD700', textShadow: '0 0 8px rgba(255, 215, 0, 0.5)' }}>
          {totalStars}
        </span>
      </motion.div>

      <motion.h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '34px',
          background: 'linear-gradient(135deg, #FFD700, #FF6B9D, #C44FE2, #FFD700)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          zIndex: 1,
          animation: 'shimmer 4s linear infinite',
        }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Αστέρι της Σκηνής
      </motion.h1>

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
      >
        <Avatar size={120} mood="idle" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: '17px',
          opacity: 0.9,
          zIndex: 1,
          textShadow: '0 0 10px rgba(255, 107, 157, 0.3)',
        }}
      >
        Γεια σου, {currentUser || 'Σταρ'}! ✨
      </motion.p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1, width: '100%', maxWidth: '280px' }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'worldMap' })} variant="primary" size="large">
          ΠΑΙΞΕ! 🎮
        </Button>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'trophy' })} variant="secondary" size="medium">
          Τα Βραβεία μου 🏆
        </Button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'leaderboard' })} variant="secondary" size="small">
            🏅
          </Button>
          <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'settings' })} variant="secondary" size="small">
            ⚙️
          </Button>
          <Button onClick={handleLogout} variant="secondary" size="small">
            🚪
          </Button>
        </div>
      </div>
    </div>
  );
}
