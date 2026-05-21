import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { WORLDS } from '../../data/worlds';
import { FloatingElements } from '../common/FloatingElements';
import { Button } from '../common/Button';

export function WorldMap() {
  const { state, dispatch } = useGame();
  const { totalStars, levelResults } = state.progress;

  function getWorldProgress(worldId: string): number {
    const completed = Object.keys(levelResults).filter(k => k.startsWith(worldId)).length;
    return Math.round((completed / 5) * 100);
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #0a001a, #1a0033, #2d0066, #1a0033, #0a001a)',
      backgroundSize: '100% 200%',
      animation: 'gradientShift 15s ease infinite',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <FloatingElements elements={['✨', '🌟', '💫', '🗺️', '🧭']} count={10} />

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '26px',
          background: 'linear-gradient(135deg, #FFD700, #FF6B9D)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '20px',
          zIndex: 1,
          textShadow: 'none',
        }}
      >
        Χάρτης Κόσμων 🗺️
      </motion.h2>

      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '380px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '10px 20px 100px',
        zIndex: 1,
      }}>
        {WORLDS.map((world, i) => {
          const isUnlocked = totalStars >= world.starsRequired;
          const progress = getWorldProgress(world.id);

          return (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring' }}
              style={{ width: '100%' }}
            >
              {i > 0 && (
                <div style={{
                  width: '3px',
                  height: '24px',
                  margin: '0 auto 8px',
                  borderRadius: '2px',
                  background: isUnlocked
                    ? `linear-gradient(180deg, ${world.colors.primary}, ${world.colors.secondary})`
                    : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isUnlocked ? `0 0 8px ${world.colors.primary}60` : 'none',
                }} />
              )}
              <motion.button
                onClick={() => isUnlocked && dispatch({ type: 'SELECT_WORLD', worldId: world.id })}
                whileTap={isUnlocked ? { scale: 0.96 } : { x: [0, -3, 3, -3, 0] }}
                animate={isUnlocked ? {
                  boxShadow: [
                    `0 0 15px ${world.colors.primary}30, inset 0 0 15px ${world.colors.primary}10`,
                    `0 0 25px ${world.colors.primary}50, inset 0 0 20px ${world.colors.primary}20`,
                    `0 0 15px ${world.colors.primary}30, inset 0 0 15px ${world.colors.primary}10`,
                  ],
                } : {}}
                transition={isUnlocked ? { duration: 2.5, repeat: Infinity } : { duration: 0.3 }}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-lg)',
                  background: isUnlocked
                    ? `linear-gradient(135deg, ${world.colors.primary}25, ${world.colors.secondary}25, ${world.colors.primary}15)`
                    : 'rgba(255, 255, 255, 0.04)',
                  border: `2px solid ${isUnlocked ? world.colors.primary + '50' : 'rgba(255, 255, 255, 0.08)'}`,
                  backdropFilter: 'blur(12px)',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  opacity: isUnlocked ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  color: 'white',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isUnlocked && (
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '50%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${world.colors.primary}20, transparent)`,
                    animation: 'btnShine 5s ease-in-out infinite',
                    pointerEvents: 'none',
                  }} />
                )}
                <motion.span
                  animate={isUnlocked ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    fontSize: '38px',
                    filter: isUnlocked
                      ? `drop-shadow(0 0 8px ${world.colors.primary}80)`
                      : 'grayscale(1) brightness(0.5)',
                  }}
                >
                  {isUnlocked ? world.icon : '🔒'}
                </motion.span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    {world.name}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {isUnlocked
                      ? world.description
                      : `Χρειάζεσαι ${world.starsRequired} ⭐ (έχεις ${totalStars})`}
                  </div>
                  {isUnlocked && progress > 0 && (
                    <div style={{
                      marginTop: '8px',
                      height: '5px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${world.colors.primary}, ${world.colors.secondary})`,
                          borderRadius: '3px',
                          boxShadow: `0 0 6px ${world.colors.primary}80`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        zIndex: 2,
      }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="small">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
