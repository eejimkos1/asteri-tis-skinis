import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { WORLDS } from '../../data/worlds';
import { FloatingElements } from '../common/FloatingElements';
import { Button } from '../common/Button';

export function WorldMap() {
  const { state, dispatch } = useGame();
  const { unlockedWorlds, levelResults } = state.progress;

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
      background: 'linear-gradient(180deg, #0a001a, #1a0033, #0a001a)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <FloatingElements elements={['✨', '🌟', '💫']} count={8} />

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          color: '#FFD700',
          padding: '20px',
          zIndex: 1,
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
        gap: '20px',
        padding: '10px 20px 100px',
        zIndex: 1,
      }}>
        {WORLDS.map((world, i) => {
          const isUnlocked = unlockedWorlds.includes(world.id);
          const progress = getWorldProgress(world.id);

          return (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
            >
              {i > 0 && (
                <div style={{
                  width: '4px',
                  height: '30px',
                  background: isUnlocked
                    ? 'linear-gradient(180deg, #FFD700, #FF6B9D)'
                    : 'rgba(255, 255, 255, 0.1)',
                  margin: '0 auto 10px',
                  borderRadius: '2px',
                }} />
              )}
              <motion.button
                onClick={() => isUnlocked && dispatch({ type: 'SELECT_WORLD', worldId: world.id })}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                animate={isUnlocked ? { boxShadow: [`0 0 20px ${world.colors.primary}40`, `0 0 30px ${world.colors.primary}60`, `0 0 20px ${world.colors.primary}40`] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '100%',
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  background: isUnlocked
                    ? `linear-gradient(135deg, ${world.colors.primary}30, ${world.colors.secondary}30)`
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${isUnlocked ? world.colors.primary + '60' : 'rgba(255, 255, 255, 0.1)'}`,
                  backdropFilter: 'blur(10px)',
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
                <span style={{ fontSize: '40px', filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                  {isUnlocked ? world.icon : '🔒'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    {world.name}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {isUnlocked ? world.description : 'Ξεκλείδωσε τον προηγούμενο κόσμο!'}
                  </div>
                  {isUnlocked && progress > 0 && (
                    <div style={{
                      marginTop: '8px',
                      height: '4px',
                      borderRadius: '2px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${world.colors.primary}, ${world.colors.secondary})`,
                        borderRadius: '2px',
                      }} />
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
