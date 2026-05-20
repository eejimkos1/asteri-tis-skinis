import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export function SplashScreen() {
  const { dispatch } = useGame();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'home' }), 500);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #1a0033 0%, #2d0066 50%, #1a0033 100%)',
      gap: '40px',
    }}>
      <motion.div
        animate={{ rotate: 360, scale: [0.8, 1.2, 1] }}
        transition={{ duration: 2, ease: 'easeOut' }}
        style={{ fontSize: '80px', filter: 'drop-shadow(0 0 20px gold)' }}
      >
        ⭐
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '36px',
          background: 'linear-gradient(135deg, #FFD700, #FF6B9D)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          textShadow: 'none',
        }}
      >
        Αστέρι της Σκηνής
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          width: '200px',
          height: '8px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #FFD700, #FF6B9D, #C44FE2)',
            backgroundSize: '200% 100%',
            width: `${progress}%`,
          }}
          animate={{ backgroundPosition: ['0% center', '200% center'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
