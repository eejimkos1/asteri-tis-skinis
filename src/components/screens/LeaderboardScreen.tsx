import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';

interface LeaderboardEntry {
  name: string;
  stars: number;
  date: string;
}

function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem('asteri-leaderboard');
    if (data) return JSON.parse(data);
  } catch { /* empty */ }
  return [];
}

export function updateLeaderboard(name: string, stars: number): void {
  const entries = getLeaderboard();
  const existing = entries.findIndex(e => e.name === name);

  if (existing >= 0) {
    entries[existing].stars = Math.max(entries[existing].stars, stars);
    entries[existing].date = new Date().toLocaleDateString('el-GR');
  } else {
    entries.push({ name, stars, date: new Date().toLocaleDateString('el-GR') });
  }

  entries.sort((a, b) => b.stars - a.stars);
  localStorage.setItem('asteri-leaderboard', JSON.stringify(entries.slice(0, 10)));
}

export function LeaderboardScreen() {
  const { dispatch } = useGame();
  const entries = getLeaderboard();
  const playerName = localStorage.getItem('asteri-player-name') || 'Σταρ';

  const medals = ['🥇', '🥈', '🥉'];

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
      <FloatingElements elements={['🏆', '🥇', '⭐', '🌟']} count={8} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: '20px',
          zIndex: 1,
        }}
      >
        Πίνακας Πρωταθλητών 🏆
      </motion.h1>

      <div style={{
        width: '100%',
        maxWidth: '350px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1,
        paddingBottom: '20px',
      }}>
        {entries.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', opacity: 0.7, marginTop: '40px' }}
          >
            Κανένα σκορ ακόμα! Παίξε για να μπεις στη λίστα! 🎮
          </motion.p>
        ) : (
          entries.map((entry, i) => (
            <motion.div
              key={entry.name + i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: entry.name === playerName
                  ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(196, 79, 226, 0.3))'
                  : 'rgba(255, 255, 255, 0.08)',
                border: entry.name === playerName
                  ? '1px solid rgba(255, 107, 157, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ fontSize: '24px', width: '36px', textAlign: 'center' }}>
                {i < 3 ? medals[i] : `${i + 1}.`}
              </span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: '15px' }}>
                {entry.name}
              </span>
              <span style={{
                fontFamily: 'var(--font-numbers)',
                fontSize: '16px',
                color: '#FFD700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                {entry.stars} ⭐
              </span>
            </motion.div>
          ))
        )}
      </div>

      <div style={{ zIndex: 1, paddingTop: '10px' }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="medium">
          Πίσω 🔙
        </Button>
      </div>
    </div>
  );
}
