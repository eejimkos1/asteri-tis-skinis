import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { WORLDS } from '../../data/worlds';
import { StarDisplay } from '../common/StarDisplay';
import { FloatingElements } from '../common/FloatingElements';
import { Button } from '../common/Button';

export function LevelSelect() {
  const { state, dispatch } = useGame();
  const { currentWorld } = state;
  const world = WORLDS.find(w => w.id === currentWorld);

  if (!world) return null;

  const { levelResults } = state.progress;

  function getLevelStars(levelIndex: number): number {
    const key = `${world!.id}-${levelIndex}`;
    return levelResults[key]?.stars || 0;
  }

  function isLevelUnlocked(levelIndex: number): boolean {
    if (levelIndex === 0) return true;
    const prevKey = `${world!.id}-${levelIndex - 1}`;
    return !!levelResults[prevKey] && levelResults[prevKey].stars > 0;
  }

  const allItems: Array<{ type: 'level' | 'dance'; index: number }> = [];
  let levelIdx = 0;
  for (let i = 0; i < 7; i++) {
    if (i === 2 || i === 5) {
      allItems.push({ type: 'dance', index: i === 2 ? 0 : 1 });
    } else {
      if (levelIdx < 5) {
        allItems.push({ type: 'level', index: levelIdx });
        levelIdx++;
      }
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: `linear-gradient(180deg, #1a0033, ${world.colors.primary}20, #1a0033)`,
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>
      <FloatingElements elements={world.floatingElements} count={10} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ zIndex: 1, textAlign: 'center', marginBottom: '20px' }}
      >
        <span style={{ fontSize: '40px' }}>{world.icon}</span>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '22px',
          color: world.colors.primary,
          marginTop: '8px',
        }}>
          {world.name}
        </h2>
      </motion.div>

      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        overflowY: 'auto',
        paddingBottom: '80px',
        zIndex: 1,
      }}>
        {allItems.map((item, i) => {
          if (item.type === 'dance') {
            return (
              <motion.button
                key={`dance-${item.index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => dispatch({ type: 'SELECT_LEVEL', level: item.index, isDance: true })}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 140, 0, 0.2))',
                  border: '2px solid rgba(255, 215, 0, 0.4)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '28px' }}>💃</span>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Πρόκληση Χορού!</span>
                <span style={{ fontSize: '20px', marginLeft: 'auto' }}>🌟</span>
              </motion.button>
            );
          }

          const stars = getLevelStars(item.index);
          const unlocked = isLevelUnlocked(item.index);

          return (
            <motion.button
              key={`level-${item.index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => unlocked && dispatch({ type: 'SELECT_LEVEL', level: item.index, isDance: false })}
              whileTap={unlocked ? { scale: 0.95 } : {}}
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: unlocked
                  ? `linear-gradient(135deg, ${world.colors.primary}20, ${world.colors.secondary}20)`
                  : 'rgba(255, 255, 255, 0.03)',
                border: `2px solid ${unlocked ? world.colors.primary + '40' : 'rgba(255, 255, 255, 0.08)'}`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                opacity: unlocked ? 1 : 0.4,
              }}
            >
              <span style={{
                fontSize: '24px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-full)',
                background: unlocked ? `${world.colors.primary}30` : 'rgba(255,255,255,0.05)',
              }}>
                {unlocked ? world.icon : '🔒'}
              </span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: '15px', textAlign: 'left' }}>
                Επίπεδο {item.index + 1}
              </span>
              <StarDisplay count={stars} size={18} />
            </motion.button>
          );
        })}
      </div>

      <div style={{ position: 'absolute', bottom: '20px', zIndex: 2 }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'worldMap' })} variant="secondary" size="small">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
