import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { resetProgress } from '../../utils/storage';
import { useState } from 'react';
import { getGistConfig, setGistConfig, readGist } from '../../utils/gistApi';

export function SettingsScreen() {
  const { state, dispatch } = useGame();
  const { musicEnabled, sfxEnabled, volume } = state.settings;
  const [showReset, setShowReset] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [gistToken, setGistToken] = useState(getGistConfig()?.token || '');
  const [gistId, setGistId] = useState(getGistConfig()?.gistId || '');
  const [adminMsg, setAdminMsg] = useState('');

  const handleReset = () => {
    resetProgress();
    dispatch({ type: 'RESET_PROGRESS' });
    setShowReset(false);
  };

  const handleVersionTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 5) {
      setShowAdmin(true);
      setTapCount(0);
    }
  };

  const handleSaveGist = async () => {
    if (!gistToken.trim() || !gistId.trim()) {
      setAdminMsg('Συμπλήρωσε και τα δύο πεδία!');
      return;
    }
    setGistConfig(gistToken.trim(), gistId.trim());
    const result = await readGist({ token: gistToken.trim(), gistId: gistId.trim() });
    if (result.success) {
      setAdminMsg('Σύνδεση επιτυχής! ✅');
    } else {
      setAdminMsg(`Σφάλμα: ${result.error}`);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #1a0033, #2d0066)',
      padding: '30px',
      gap: '24px',
    }}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          color: '#FFD700',
        }}
      >
        Ρυθμίσεις ⚙️
      </motion.h1>

      <div style={{
        width: '100%',
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Music toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <span>🎵 Μουσική</span>
          <button
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { musicEnabled: !musicEnabled } })}
            style={{
              width: '50px',
              height: '28px',
              borderRadius: '14px',
              background: musicEnabled ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '3px',
              left: musicEnabled ? '25px' : '3px',
              transition: 'left 0.3s',
            }} />
          </button>
        </div>

        {/* SFX toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <span>🔊 Ηχητικά εφέ</span>
          <button
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { sfxEnabled: !sfxEnabled } })}
            style={{
              width: '50px',
              height: '28px',
              borderRadius: '14px',
              background: sfxEnabled ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '3px',
              left: sfxEnabled ? '25px' : '3px',
              transition: 'left 0.3s',
            }} />
          </button>
        </div>

        {/* Volume slider */}
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>🔈 Ένταση</span>
            <span style={{ fontFamily: 'var(--font-numbers)', opacity: 0.7 }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { volume: parseFloat(e.target.value) } })}
            style={{
              width: '100%',
              accentColor: '#FF6B9D',
            }}
          />
        </div>

        {/* Reset progress */}
        {!showReset ? (
          <Button onClick={() => setShowReset(true)} variant="secondary" size="medium">
            Επαναφορά προόδου 🗑️
          </Button>
        ) : (
          <div style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 82, 82, 0.1)',
            border: '1px solid rgba(255, 82, 82, 0.3)',
            textAlign: 'center',
          }}>
            <p style={{ marginBottom: '12px', fontSize: '14px' }}>
              Σίγουρα; Θα χαθεί όλη η πρόοδός σου!
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button onClick={handleReset} variant="primary" size="small">
                Ναι, σβήσε
              </Button>
              <Button onClick={() => setShowReset(false)} variant="secondary" size="small">
                Άκυρο
              </Button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <Button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'home' })} variant="secondary" size="medium">
          Πίσω 🔙
        </Button>
        <span
          onClick={handleVersionTap}
          style={{ fontSize: '11px', opacity: 0.3, cursor: 'default', userSelect: 'none' }}
        >
          v1.2.0
        </span>
      </div>

      {showAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            zIndex: 9999,
            gap: '16px',
          }}
        >
          <h2 style={{ color: '#FFD700', fontSize: '18px' }}>Cloud Sync Setup</h2>
          <input
            type="password"
            placeholder="GitHub Token (ghp_...)"
            value={gistToken}
            onChange={e => setGistToken(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          />
          <input
            type="text"
            placeholder="Gist ID"
            value={gistId}
            onChange={e => setGistId(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          />
          {adminMsg && <p style={{ color: adminMsg.includes('✅') ? '#4CAF50' : '#FF5252', fontSize: '13px' }}>{adminMsg}</p>}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button onClick={handleSaveGist} variant="primary" size="small">
              Test & Save
            </Button>
            <Button onClick={() => setShowAdmin(false)} variant="secondary" size="small">
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
