import React from 'react';

export const ProgressBar = ({ value = 0, max = 100, label, height = 8, color }) => {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <span>{label}</span>
          <span className="font-mono">{percent}%</span>
        </div>
      )}
      <div className="progress-container" style={{ height: `${height}px` }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: color || undefined,
          }}
        />
      </div>
    </div>
  );
};
