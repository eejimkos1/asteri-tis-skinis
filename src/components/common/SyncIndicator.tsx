import { useState, useEffect } from 'react';
import { getSyncStatus, addSyncListener } from '../../utils/gistSync';

export function SyncIndicator() {
  const [status, setStatus] = useState(getSyncStatus());

  useEffect(() => {
    return addSyncListener(setStatus);
  }, []);

  if (status === 'unconfigured') return null;

  const config: Record<string, { color: string; label: string }> = {
    idle: { color: '#4CAF50', label: '☁️' },
    syncing: { color: '#FFC107', label: '⟳' },
    error: { color: '#F44336', label: '⚠️' },
    offline: { color: '#9E9E9E', label: '☁️' },
  };

  const { color, label } = config[status] || config.idle;

  return (
    <span
      title={`Sync: ${status}`}
      style={{
        fontSize: '14px',
        opacity: status === 'idle' ? 0.6 : 1,
        color,
        animation: status === 'syncing' ? 'spin 1s linear infinite' : undefined,
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  );
}
