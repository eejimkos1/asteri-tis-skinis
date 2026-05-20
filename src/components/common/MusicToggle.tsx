import { useGame } from '../../context/GameContext';

export function MusicToggle() {
  const { state, dispatch } = useGame();
  const { musicEnabled } = state.settings;

  return (
    <button
      onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { musicEnabled: !musicEnabled } })}
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 'var(--radius-full)',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white',
      }}
    >
      {musicEnabled ? '🔊' : '🔇'}
    </button>
  );
}
