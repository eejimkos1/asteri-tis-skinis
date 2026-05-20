import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';

export function NameEntryScreen() {
  const { dispatch } = useGame();
  const [name, setName] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim() || 'Σταρ';
    localStorage.setItem('asteri-player-name', trimmed);
    dispatch({ type: 'SET_SCREEN', screen: 'home' });
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a0033, #2d0066, #4a0080)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      gap: '30px',
    }}>
      <FloatingElements elements={['✨', '💫', '⭐', '🌟', '💖']} count={10} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{ fontSize: '70px' }}
      >
        ⭐
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          background: 'linear-gradient(135deg, #FFD700, #FF6B9D)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        Καλώς ήρθες!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ textAlign: 'center', opacity: 0.8, zIndex: 1, fontSize: '15px' }}
      >
        Πώς θέλεις να σε λένε;
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ zIndex: 1, width: '100%', maxWidth: '280px' }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Το όνομά σου..."
          maxLength={20}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid rgba(255, 107, 157, 0.4)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontSize: '18px',
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(255, 107, 157, 0.8)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 107, 157, 0.4)'}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ zIndex: 1 }}
      >
        <Button onClick={handleSubmit} variant="primary" size="large">
          Ας ξεκινήσουμε! 🎉
        </Button>
      </motion.div>
    </div>
  );
}
