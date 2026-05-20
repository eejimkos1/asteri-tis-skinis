import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { REWARDS } from '../../data/rewards';
import { FloatingElements } from '../common/FloatingElements';

export function TrophyScreen() {
  const { state, dispatch } = useGame();
  const { unlockedRewards, totalStars } = state.progress;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #1a0033, #2d0066)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>
      <FloatingElements elements={['🏆', '👑', '💎', '✨']} count={8} />

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          color: '#FFD700',
          marginBottom: '8px',
          zIndex: 1,
        }}
      >
        Τα Βραβεία μου 🏆
      </motion.h1>

      <p style={{ opacity: 0.7, fontSize: '14px', marginBottom: '20px', zIndex: 1 }}>
        {unlockedRewards.length}/{REWARDS.length} ξεκλειδωμένα • {totalStars} ⭐
      </p>

      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '350px',
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        paddingBottom: '80px',
        zIndex: 1,
        alignContent: 'start',
      }}>
        {REWARDS.map((reward, i) => {
          const unlocked = unlockedRewards.includes(reward.id);
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                background: unlocked
                  ? 'rgba(255, 215, 0, 0.15)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${unlocked ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
              }}
            >
              <span style={{
                fontSize: '32px',
                filter: unlocked ? 'none' : 'grayscale(1) brightness(0.3)',
              }}>
                {unlocked ? reward.icon : '❓'}
              </span>
              <span style={{
                fontSize: '10px',
                textAlign: 'center',
                opacity: unlocked ? 0.8 : 0.4,
                lineHeight: 1.2,
              }}>
                {unlocked ? reward.name : `${reward.starsRequired} ⭐`}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', bottom: '20px', zIndex: 2 }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="small">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
